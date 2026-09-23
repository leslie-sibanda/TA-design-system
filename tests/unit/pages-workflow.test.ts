import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
function load(name: string) {
  const path = `.github/workflows/${name}.yml`;
  return parse(existsSync(path) ? readFileSync(path, 'utf8') : '{}');
}
const caller = load('pages');
const verification = load('verify-site');
const deployment = load('deploy-site');
describe('reusable Pages delivery contract', () => {
  it('keeps a small caller with read-only PR verification', () => {
    expect(caller.on).toHaveProperty('pull_request');
    expect(caller.on).not.toHaveProperty('pull_request_target');
    expect(caller.permissions).toEqual({ contents: 'read' });
    expect(caller.jobs.verify.uses).toBe('./.github/workflows/verify-site.yml');
    expect(caller.jobs.verify.permissions).toBeUndefined();
    expect(verification.on).toHaveProperty('workflow_call');
    expect(verification.jobs.verify.permissions).toEqual({ contents: 'read' });
    expect(verification.jobs.verify.strategy.matrix.base_path).toEqual(['', '/TA-design-system']);
    expect(verification.jobs.verify.steps.some((step: { run?: string }) => step.run === 'pnpm check')).toBe(true);
    expect(verification.jobs.verify.env.PLAYWRIGHT_PROJECTS).toBeUndefined();
  });
  it('deploys only the verified main artifact through a reusable workflow', () => {
    const call = caller.jobs.deploy;
    expect(call.needs).toEqual(['verify']);
    expect(call.uses).toBe('./.github/workflows/deploy-site.yml');
    expect(deployment.on).toHaveProperty('workflow_call');
    const deploy = deployment.jobs.deploy;
    for (const job of [call, deploy]) {
      expect(job.if).toContain("github.ref == 'refs/heads/main'");
      expect(job.if).toContain("github.event_name != 'pull_request'");
      expect(job.permissions).toEqual({ 'pages': 'write', 'id-token': 'write' });
    }
    expect(deploy.environment.name).toBe('github-pages');
    expect(deploy.steps.some((step: { run?: string }) => step.run?.includes('build'))).toBe(false);
    const upload = verification.jobs.verify.steps.find((step: { uses?: string }) => step.uses?.startsWith('actions/upload-pages-artifact@'));
    expect(upload.with.path).toBe('out');
    expect(upload.if).toContain("matrix.base_path == '/TA-design-system'");
    expect(upload.if).toContain("github.event_name != 'pull_request'");
  });
  it('pins external actions to immutable revisions', () => {
    for (const workflow of [verification, deployment]) {
      expect(workflow.jobs).toBeDefined();
      for (const job of Object.values(workflow.jobs) as { steps: { uses?: string }[] }[]) {
        for (const step of job.steps) if (step.uses) expect(step.uses).toMatch(/@[0-9a-f]{40}$/);
      }
    }
  });
});
