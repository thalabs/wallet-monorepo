import type { Metadata } from 'next';
import './globals.css';
import { clsx } from 'clsx';
import { Link } from '@nextui-org/link';
import { fontSans } from '@/src/config/fonts';
import { Providers } from '@/src/app/providers';
import { Navbar } from '@/src/components/navbar';
import { siteConfig } from '@/src/config/site';


export const metadata: Metadata = {
  title: 'Tha Wallet',
  description: 'Own your Own Wallet',
};


export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  // noinspection HtmlRequiredTitleElement
  return (
    <html suppressHydrationWarning lang="en">
    <head />
    <body
      className={clsx(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable,
      )}
    >
    <Providers>
      <div className="relative flex flex-col h-screen">
        <Navbar />
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
          {children}
        </main>
        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href={siteConfig.links.github}
            title="nextui.org homepage"
          >
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">Tha Labs</p>
          </Link>
        </footer>
      </div>
    </Providers>
    </body>
    </html>
  );
}
