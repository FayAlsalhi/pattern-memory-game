import '../globals.css';
import { fontVars } from '../fonts';
import { metadataFor } from '../metadata';

export { viewport } from '../metadata';
export const metadata = metadataFor('en');

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
