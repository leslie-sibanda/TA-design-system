import Link from 'next/link';
import { componentPages } from '@/lib/source';
export function ComponentCatalogue() {
  return <div className="component-grid">{componentPages().map(page => <Link className="component-card" href={page.url + '/'} key={page.url}><h2>{page.data.title} <span aria-hidden="true">→</span></h2><p>{page.data.description}</p><span className="status-badge">Design proposal</span></Link>)}</div>;
}
