'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavigationItem } from '@/lib/navigation';
export function DocNavigation({ items }: { items: NavigationItem[] }) {
  const path = usePathname().replace(/\/$/, '');
  return <nav aria-label="Documentation"><p className="nav-heading">Components</p>{items.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href.replace(/\/$/, '') ? 'page' : undefined}>{item.label}</Link>)}</nav>;
}
