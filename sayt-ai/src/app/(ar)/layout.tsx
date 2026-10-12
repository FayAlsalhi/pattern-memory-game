import '../globals.css';
import { fontVars } from '../fonts';
import { metadataFor } from '../metadata';

export { viewport } from '../metadata';
export const metadata = metadataFor('ar');

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
