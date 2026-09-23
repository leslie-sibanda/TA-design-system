import { SiteHeader } from '@/components/site/site-header';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <><SiteHeader />{children}</>;
}
