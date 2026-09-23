'use client';
import { Dialog } from '@base-ui/react/dialog';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import Link from 'next/link';
import { useState } from 'react';
import { siteNavigation, type NavigationItem } from '@/lib/navigation';
export function HeaderControls({ docs = [] }: { docs?: NavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const { setOpenSearch, dialogHandle } = useSearchContext();
  return <div className="header-controls">
    <Dialog.Trigger handle={dialogHandle} className="search-trigger" onClick={() => setOpenSearch(true)}>Search<span aria-hidden="true" className="search-key">⌘ K / Ctrl K</span></Dialog.Trigger>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="menu-trigger" aria-label="Open navigation">☰</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="menu-backdrop" />
        <Dialog.Popup className="menu-popup">
          <div className="menu-heading"><Dialog.Title>Explore the system</Dialog.Title><Dialog.Close className="close-button" aria-label="Close navigation">✕</Dialog.Close></div>
          <Dialog.Description className="sr-only">Choose a page in the TeacherActive design system.</Dialog.Description>
          <nav aria-label="Mobile navigation">
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            {siteNavigation.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
            {docs.length > 0 && <><p className="nav-heading">Documentation</p>{docs.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}</>}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>;
}
