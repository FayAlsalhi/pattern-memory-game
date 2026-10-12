import type { Client, L10n } from './types';

/**
 * Verified business content carried over from the original site
 * (https://saytai.github.io/Sayt.Ai/ and /en.html). Do not add claims,
 * clients or numbers here that Sayt.Ai has not confirmed.
 */

export const links = {
  /** The original site's only contact integration — used by every CTA. */
  startCampaign: 'https://linkjar.co/ATHAR.sa',
  joinAsInfluencer: 'https://linkjar.co/ATHAR.sa',
};

export const stats: Array<{ value: number; label: L10n }> = [
  { value: 1050, label: { ar: 'مؤثر', en: 'influencers' } },
  { value: 35, label: { ar: 'مشروع منجز', en: 'completed projects' } },
];

export const clients: Client[] = [
  { name: { ar: 'النخبة الكورية', en: 'Korean Elite' }, logo: 'brand/logos/korean-elite.jpg' },
  { name: { ar: 'حنطة', en: 'Hntah' }, logo: 'brand/logos/hntah.jpg' },
  { name: { ar: 'آيب', en: 'Ayb' }, logo: 'brand/logos/ayb.jpg' },
  { name: { ar: 'حائط النفل', en: 'Haet Alnafal' }, logo: 'brand/logos/haet-alnafal.jpg' },
  { name: { ar: 'فربينيا', en: 'Verbinia' }, logo: 'brand/logos/verbinia.jpg' },
  { name: { ar: 'Score Marketing', en: 'Score Marketing' }, logo: 'brand/logos/score.jpg' },
  { name: { ar: 'جلسة شاي', en: 'Jalsat Shay' }, logo: 'brand/logos/jalsat-shay.jpg' },
  { name: { ar: 'إلكسير — نادي نسائي', en: 'Elixir — women’s club' }, logo: 'brand/logos/elixir.jpg' },
  { name: { ar: 'قهوة عُمق', en: 'Umq Coffee' }, logo: 'brand/logos/umq.jpg' },
];

/** Original "what sets us apart" services, each paired with a visual. */
export const services: Array<{ n: string; title: L10n; body: L10n; instead: L10n; media: string }> = [
  {
    n: '01',
    title: { ar: 'Brief مخصص لكل مؤثر', en: 'A tailored brief for every influencer' },
    body: {
      ar: 'نكتب لكل مؤثر Brief خاصًا مبنيًا على جمهوره وطريقة محتواه، حتى يتكلم بلغته هو لا بلغة الإعلان.',
      en: 'We write each influencer a brief built on their audience and the way they create, so they speak in their own voice, not the ad’s.',
    },
    instead: { ar: 'Brief واحد يُرسل لكل المؤثرين', en: 'One brief sent to every influencer' },
    media: 'influencer-unboxing',
  },
  {
    n: '02',
    title: { ar: 'سيناريو وفكرة لكل مؤثر', en: 'A scenario and idea for each influencer' },
    body: {
      ar: 'نصمم لكل مؤثر سيناريو وفكرة مختلفة، فيرى الجمهور زوايا متعددة لعلامتك بدل إعلان واحد يتكرر.',
      en: 'We design a different scenario and idea for each influencer, so audiences see your brand from many angles instead of one repeated ad.',
    },
    instead: { ar: 'نفس الإعلان عند كل المؤثرين', en: 'The same ad from every influencer' },
    media: 'product-fragrance',
  },
  {
    n: '03',
    title: { ar: 'نتائج نتعلّم منها', en: 'Results we learn from' },
    body: {
      ar: 'نتابع نتائج كل مؤثر ونفهم وش نجح ووش يحتاج تحسين، وكل حملة تعطينا بيانات تخلي الحملة الجاية أذكى.',
      en: 'We track each influencer’s results to understand what worked and what needs improving, and every campaign gives us data that makes the next one smarter.',
    },
    instead: { ar: 'تقرير ينتهي بانتهاء الحملة', en: 'A report that ends with the campaign' },
    media: 'brand-opening',
  },
  {
    n: '04',
    title: { ar: 'فعاليات وافتتاحات وإطلاقات', en: 'Events, openings & launches' },
    body: {
      ar: 'ونغطي أيضًا الفعاليات والافتتاحات وإطلاق المنتجات، بإدارة تنفيذ كاملة.',
      en: 'We also cover events, openings and product launches, with full execution management.',
    },
    instead: { ar: 'تنسيق متفرّق بلا إدارة تنفيذ', en: 'Scattered coordination, no execution lead' },
    media: 'film-event',
  },
];

/** Original "how we choose the influencer" — four steps. */
export const method: Array<{ title: L10n; body: L10n }> = [
  { title: { ar: 'احتياج المشروع', en: 'Project needs' }, body: { ar: 'الهدف من الحملة، والقطاع، والسوق، والمدينة.', en: 'The campaign goal, the sector, the market, and the city.' } },
  { title: { ar: 'محتوى المؤثر', en: 'Influencer’s content' }, body: { ar: 'نوع ما ينشره، وأسلوبه، ومدى قربه من مجال المشروع.', en: 'What they publish, their style, and how close it is to the project’s field.' } },
  { title: { ar: 'جمهوره', en: 'Their audience' }, body: { ar: 'من يتابعه فعلًا، وهل هو الجمهور الذي يهم المشروع.', en: 'Who actually follows them, and whether that audience matters to the project.' } },
  { title: { ar: 'الاتفاق والالتزام', en: 'Agreement and commitment' }, body: { ar: 'تعهّد مكتوب بالحضور في الموعد المحدد، والالتزام بمتطلبات التغطية.', en: 'A written pledge to show up on time and meet the coverage requirements.' } },
];

export const trust: Array<{ value: string; label: L10n }> = [
  { value: '✓', label: { ar: 'عربون محمي بعقد رسمي', en: 'Deposit protected by an official contract' } },
  { value: '100%', label: { ar: 'دفع آمن', en: 'Secure payment' } },
  { value: '24/7', label: { ar: 'دعم مباشر', en: 'Live support' } },
];

/** Original ticker / physics-chip keywords. */
export const keywords: L10n[] = [
  { ar: 'Brief مخصص لكل مؤثر', en: 'A tailored brief for every influencer' },
  { ar: 'سيناريو لكل مؤثر', en: 'A scenario per influencer' },
  { ar: 'متابعة النتائج', en: 'Tracking results' },
  { ar: 'الجمهور', en: 'Audience' },
  { ar: 'المؤثر', en: 'Influencer' },
  { ar: 'الهدف', en: 'Goal' },
  { ar: 'استراتيجية كاملة', en: 'Complete strategy' },
  { ar: 'UGC', en: 'UGC' },
  { ar: 'تعاونات المشاهير', en: 'Celebrity collaborations' },
  { ar: 'إنتاج إعلاني', en: 'Commercial production' },
];

/** Rotating words from the original closing typewriter. */
export const typewriter: L10n[] = [
  { ar: 'يناسب مشروعك', en: 'who fits your project' },
  { ar: 'قريب من مجالك', en: 'close to your field' },
  { ar: 'يصل لجمهورك', en: 'your audience follows' },
  { ar: 'يلتزم بموعده', en: 'who shows up on time' },
];
