export const siteNavigation = [
  { href: '/components/', label: 'Components' },
  { href: '/pages/', label: 'Pages' },
  { href: '/styling/', label: 'Styling' },
] as const;
export type NavigationItem = { href: string; label: string };
