import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
const docs = defineDocs({ dir: 'content/docs', docs: { schema: pageSchema }, meta: { schema: metaSchema } });
export const source = loader({ baseUrl: '/', source: docs.toFumadocsSource() });
export function componentPages() {
  return source.getPages().filter(page => page.slugs[0] === 'components' && page.slugs.length === 2)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
}
export function documentationLinks() {
  return [
    { href: '/components/', label: 'All components' },
    ...componentPages().map(page => ({ href: page.url + '/', label: page.data.title })),
    { href: '/foundations/', label: 'Foundations' },
    { href: '/contributing/', label: 'Contributing' },
  ];
}
