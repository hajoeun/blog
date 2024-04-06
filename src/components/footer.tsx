import { A } from '@/components/ui/a';

export function Footer() {
  return (
    <footer className="p-6 pt-3 pb-6 flex text-xs text-center mt-3 dark:text-gray-400 text-gray-500 font-mono">
      <div className="grow text-left">
        하조은의 블로그 (
        <A target="_blank" href="https://twitter.com/hajoeun_">
          @hajoeun
        </A>
        )
      </div>
      <div>
        <A target="_blank" href="https://github.com/hajoeun/blog">
          Source
        </A>
      </div>
    </footer>
  );
}
