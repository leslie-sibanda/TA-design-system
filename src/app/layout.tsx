import { Provider } from '@/components/provider';
import './global.css';
export default function Layout({ children }: LayoutProps<'/'>) {
  return <html lang="en" suppressHydrationWarning><body><Provider>{children}</Provider></body></html>;
}
