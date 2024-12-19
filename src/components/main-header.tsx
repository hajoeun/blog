import Link from 'next/link';

import { ThemeToggle } from '@/utils/theme-toggle';

import { HeaderLink } from './header-link';
import { Logo } from './logo';

export function MainHeader() {
  return (
    <header className="flex mb-5 md:mb-10 items-center">
      <Logo />

      <nav className="font-mono text-xs grow justify-end items-center flex gap-1 md:gap-3">
        <ThemeToggle />
        <HeaderLink />
        <Link
          href="https://book.hajoeun.dev/friendly-next-js"
          className="inline-flex hover:bg-gray-200 dark:hover:bg-[#313131] active:bg-gray-300 dark:active:bg-[#242424] rounded-sm p-2 transition-[background-color]"
        >
          Course
        </Link>
      </nav>
    </header>
  );
}
