import Link from 'next/link';
import Image from 'next/image';
import { siteNavigation, type NavigationItem } from '@/lib/navigation';
import { publicPath } from '@/lib/site-path.mjs';
import { HeaderControls } from './header-controls';
export function SiteHeader({ docs }: { docs?: NavigationItem[] }) {
  return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header">
    <Link href="/" className="brand"><Image src={publicPath('/brand/teacheractive-icon.png', process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? '')} alt="TeacherActive home" width={284} height={254} priority /></Link>
    <nav aria-label="Primary">{siteNavigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
    <HeaderControls docs={docs} />
  </header></>;
}
