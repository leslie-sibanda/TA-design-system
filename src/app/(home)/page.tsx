import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { publicPath } from '@/lib/site-path.mjs';
export const metadata: Metadata = { title: 'TeacherActive design system', description: 'Shared foundations, components and guidance for TeacherActive products.' };
export default function HomePage() {
  return <main id="main" className="home-page" tabIndex={-1}>
    <section className="landing">
      <Image className="hero-logo" src={publicPath('/brand/teacheractive-logo.png', process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? '')} width={2430} height={501} alt="TeacherActive" priority />
      <h1>Shared foundations.<br />Consistent experiences.</h1>
      <p className="lead">Accessible components and page templates for building TeacherActive products.</p>
      <div className="home-actions"><Link className="site-action primary" href="/components/">Browse components <span aria-hidden="true">→</span></Link><Link className="site-action" href="/pages/">Explore pages</Link></div>
    </section>
    <footer className="site-footer"><span>TeacherActive design system</span><Link href="/contributing/">Contribution guidance →</Link></footer>
  </main>;
}
