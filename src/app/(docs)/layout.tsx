import { SiteHeader } from '@/components/site/site-header';
import { DocNavigation } from '@/components/site/doc-navigation';
import { documentationLinks } from '@/lib/source';
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const items = documentationLinks();
  return <><SiteHeader docs={items} /><div className="docs-shell"><aside className="docs-sidebar"><DocNavigation items={items} /></aside>{children}</div></>;
}
