import type { Locale } from '@/content/types';
import { copy } from '@/content/copy';
import { LocaleProvider } from '@/lib/locale';
import { FabricBackground } from './FabricBackground';
import { Header } from './Header';
import { ViewerProvider } from './media/Viewer';
import { Hero } from './sections/Hero';
import { Featured } from './sections/Featured';
import { Creators } from './sections/Creators';
import { Gallery } from './sections/Gallery';
import { Production } from './sections/Production';
import { Services } from './sections/Services';
import { Contact } from './sections/Contact';
import { Method } from './sections/Method';
import { Numbers, Clients } from './sections/Proof';

/** The homepage as a continuous seven-scene story. */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <LocaleProvider locale={locale}>
      <ViewerProvider>
        <a href="#main" className="sr-only z-[60] rounded-full bg-white px-4 py-2 text-ink-900 focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
          {copy[locale].skip}
        </a>
        <FabricBackground />
        <Header />
        <main id="main">
          <Hero />
          <Featured />
          <Creators />
          <Gallery />
          <Production />
          <Services />
          <Method />
          <Numbers />
          <Clients />
          <Contact />
        </main>
      </ViewerProvider>
    </LocaleProvider>
  );
}
