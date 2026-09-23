import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getMDXComponents } from '@/components/mdx';
import { ComponentCatalogue } from '@/components/docs/component-catalogue';
import { createRelativeLink } from 'fumadocs-ui/mdx';
export const dynamicParams = false;
export default async function Page({ params }: PageProps<'/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const MDX = page.data.body;
  return <main id="main" className="docs-main" tabIndex={-1}>
    <div className="doc-breadcrumb">Documentation / {page.data.title}</div>
    <h1>{page.data.title}</h1><p className="lead">{page.data.description}</p>
    <div className="doc-article"><div className="prose min-w-0"><MDX components={getMDXComponents({ ComponentCatalogue, a: createRelativeLink(source, page) })} /></div>
    {page.data.toc.length > 0 && <nav className="page-toc" aria-label="On this page"><strong>On this page</strong>{page.data.toc.filter(item => item.depth === 2).map(item => <a href={item.url} key={item.url}>{item.title}</a>)}</nav>}</div>
  </main>;
}
export function generateStaticParams() { return source.generateParams().filter(params => (params.slug?.length ?? 0) > 0); }
export async function generateMetadata({ params }: PageProps<'/[...slug]'>): Promise<Metadata> {
  const page = source.getPage((await params).slug);
  if (!page) notFound();
  return { title: `${page.data.title} | TeacherActive`, description: page.data.description };
}
