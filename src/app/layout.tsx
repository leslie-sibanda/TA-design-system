import { Provider } from '@/components/provider';
import './global.css';
export default function Layout({ children }: LayoutProps<'/'>) {
  return <html lang="en" data-ta-theme="teacheractive" data-ta-mode="light" suppressHydrationWarning><body><Provider>{children}</Provider></body></html>;
}
