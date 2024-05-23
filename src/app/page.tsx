import { Link } from '@nextui-org/link';
import { Snippet } from '@nextui-org/snippet';
import { Code } from '@nextui-org/code';
import { button as buttonStyles } from '@nextui-org/theme';

import { siteConfig } from '@/src/config/site';
import { title } from '@/src/components/primitives';
import { GithubIcon, KeyIcon } from '@/src/components/icons';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Make your&nbsp;</h1>
        <h1 className={title({ color: 'violet' })}>Wallet&nbsp;</h1>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: 'primary',
            radius: 'full',
            variant: 'shadow',
          })}
          href='https://www.example.com'
        >
           <KeyIcon /> Link your Wallet
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: 'bordered', radius: 'full' })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
           Home Page Design <Code color="primary">Under Developing</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
