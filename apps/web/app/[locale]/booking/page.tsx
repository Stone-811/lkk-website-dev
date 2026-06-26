import { getTranslations } from 'next-intl/server';
import BookingForm from './BookingForm';
import Link from 'next/link';

// Force dynamic rendering for next-intl
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'booking' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative bg-navy-700 pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(251,114,10,0.10)_0%,transparent_55%),radial-gradient(circle_at_5%_75%,rgba(58,106,133,0.3)_0%,transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1fr_560px] gap-8 items-center py-16 lg:py-20">
          {/* Left content */}
          <div>
            {/* Free badge */}
            <div className="inline-flex items-center gap-2 bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 bg-orange rounded-full" />
              50歲以上 · 首次體驗完全免費
            </div>

            <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              第一堂課<br />
              <span className="text-orange">我們來了解你</span>
            </h1>

            <p className="text-white/60 text-lg font-light leading-relaxed mb-6 max-w-lg">
              不管幾歲、有沒有運動過、身體狀況如何——體驗課的目的是讓我們了解你，而不是評判你。由物理治療師背景教練帶領，安全有效。
            </p>

            {/* What you get */}
            <div className="space-y-2 mb-6">
              {[
                '身體素質・活動度・肌力 全面檢測',
                '核心啟動與基礎重訓教學',
                '客製化訓練動作指導',
                '訓練目標評估與規劃建議',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-white/70 text-sm">
                  <div className="w-5 h-5 rounded-full bg-orange/20 border border-orange/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange text-xs">✓</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <a href="#form" className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-orange/35 hover:bg-orange-400 transition-colors">
              立即填寫預約 →
            </a>

            <div className="flex items-center gap-2 mt-4 text-sm text-white/40">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span><strong className="text-orange-300">50歲以上免費</strong>・一般首次 $500・無隱藏費用・不強迫買課</span>
            </div>
          </div>

          {/* Right - FAQ & Cases Cards (horizontal) */}
          <aside className="hidden lg:flex flex-row gap-4">
            {/* FAQ Card */}
            <div className="flex-1 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-xs font-bold tracking-widest uppercase text-white/30 mb-2">你可能在想</div>
              <div className="space-y-1.5">
                {[
                  { q: '我年紀這麼大，可以練嗎？', a: '70% 學員都是中高齡，90 歲阿嬤也在練。' },
                  { q: '從來沒運動過？', a: '沒運動習慣反而容易進步。' },
                  { q: '有慢性病可以來嗎？', a: '可以，物理治療師會先評估。' },
                  { q: '一定要買課嗎？', a: '不強迫，你自己決定。' },
                ].map((faq) => (
                  <div key={faq.q} className="bg-white/[0.05] rounded-lg p-2">
                    <div className="text-xs font-semibold text-white mb-0.5">{faq.q}</div>
                    <div className="text-[11px] text-white/50 leading-relaxed">{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cases Card */}
            <div className="flex-1 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-xs font-bold tracking-widest uppercase text-white/30 mb-2">他們也是這樣開始的</div>
              <div className="space-y-1.5">
                {[
                  { name: '林阿嬤', info: '70歲・膝關節退化', quote: '以前膝蓋痛到走不了路，現在可以自己爬山。' },
                  { name: '王先生', info: '62歲・腦中風後', quote: '以為這輩子就這樣了，沒想到可以自己走路買東西。' },
                  { name: '陳小姐', info: '55歲・乳癌術後', quote: '醫生說我的恢復狀況比預期好很多。' },
                ].map((c) => (
                  <div key={c.name} className="flex gap-2 items-center bg-white/[0.05] rounded-lg p-2">
                    <div className="w-7 h-7 rounded-full bg-orange/30 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">{c.name}・{c.info}</div>
                      <div className="text-[11px] text-white/50 italic line-clamp-1">「{c.quote}」</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="https://l-kk.tw/category/%e6%a1%88%e4%be%8b%e5%88%86%e4%ba%ab/" className="block text-center text-[11px] text-white/50 hover:text-white mt-2 pt-2 border-t border-white/10">
                看更多學員故事 →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// Process Steps Horizontal
function ProcessStepsHorizontal() {
  const steps = [
    { title: '填寫預約表單', desc: '約 1~2 分鐘完成' },
    { title: '教練電話聯繫', desc: '1 個工作天內安排' },
    { title: '到店體驗課', desc: '60–75 分鐘', badge: '50歲以上免費' },
    { title: '你自己決定', desc: '不強迫買課' },
  ];

  return (
    <div>
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-orange tracking-widest uppercase mb-4">
        <span className="w-4 h-0.5 bg-orange" />
        接下來會發生什麼
        <span className="w-4 h-0.5 bg-orange" />
      </div>

      <div className="bg-white rounded-xl p-6 border border-navy-700/15 shadow-sm">
        <div className="grid grid-cols-4 gap-4 relative">
          {/* Horizontal line */}
          <div className="absolute top-4 left-8 right-8 h-[2px] bg-gradient-to-r from-orange via-orange to-orange/20" />

          {steps.map((step, idx) => (
            <div key={step.title} className="text-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-orange text-white font-serif text-sm font-black flex items-center justify-center mx-auto mb-2">
                {idx + 1}
              </div>
              <div className="text-sm font-semibold text-navy-700 mb-0.5">{step.title}</div>
              <div className="text-xs text-ink/50 leading-relaxed">{step.desc}</div>
              {step.badge && (
                <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 mt-1">
                  {step.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection />

      <div className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Form (centered & enlarged) */}
            <div id="form">
              <BookingForm />
            </div>

            {/* Process Steps (horizontal, aligned with form) */}
            <div className="mt-10">
              <ProcessStepsHorizontal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
