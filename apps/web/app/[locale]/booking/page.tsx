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
        <div className="grid lg:grid-cols-[1fr_640px] gap-8 items-center py-16 lg:py-20">
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
          <aside className="hidden lg:flex flex-row gap-5">
            {/* FAQ Card */}
            <div className="flex-1 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">你可能在想</div>
              <div className="space-y-2.5">
                {[
                  { q: '我年紀這麼大，可以練嗎？', a: '練健康 70% 的學員都是中高齡族群，90 歲阿嬤都在這裡練硬舉。' },
                  { q: '我從來沒運動過？', a: '沒運動習慣的人反而容易進步，教練會從最基礎教起。' },
                  { q: '有慢性病可以來嗎？', a: '可以。由物理治療師督導，會先評估再設計適合的課表。' },
                  { q: '一定要買課嗎？', a: '不強迫。體驗課的目的是讓雙方了解彼此，你自己決定。' },
                ].map((faq) => (
                  <div key={faq.q} className="bg-white/[0.05] rounded-lg p-3">
                    <div className="text-sm font-semibold text-white mb-1">{faq.q}</div>
                    <div className="text-xs text-white/50 leading-relaxed">{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cases Card */}
            <div className="flex-1 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">他們也是這樣開始的</div>
              <div className="space-y-2.5">
                {[
                  { name: '林阿嬤', info: '70歲・膝關節退化', quote: '以前膝蓋痛到走不了路，現在可以自己爬山、帶孫子去公園。' },
                  { name: '王先生', info: '62歲・腦中風後', quote: '以為這輩子就這樣了，沒想到可以自己走路去買東西。' },
                  { name: '陳小姐', info: '55歲・乳癌術後', quote: '醫生說我的恢復狀況比預期好很多。' },
                ].map((c) => (
                  <div key={c.name} className="flex gap-3 items-center bg-white/[0.05] rounded-lg p-3">
                    <div className="w-9 h-9 rounded-full bg-orange/30 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{c.name}・{c.info}</div>
                      <div className="text-xs text-white/50 italic line-clamp-2">「{c.quote}」</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="https://l-kk.tw/category/%e6%a1%88%e4%be%8b%e5%88%86%e4%ba%ab/" className="block text-center text-xs text-white/50 hover:text-white mt-3 pt-3 border-t border-white/10">
                看更多學員故事 →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// Process Steps (vertical)
function ProcessSteps() {
  const steps = [
    { title: '填寫預約表單', desc: '約 1~2 分鐘完成，只填必要資訊，詳細狀況讓教練直接聊' },
    { title: '教練主動電話聯繫', desc: '1 個工作天內，我們會打電話給您安排時間。如果不方便接，我們也會留言或傳 LINE' },
    { title: '到店體驗課（60–75 分鐘）', desc: '身體評估 + 基礎動作訓練 + 教練諮詢', badges: [{ text: '50歲以上 免費', type: 'free' }, { text: '一般首次 $500', type: 'paid' }] },
    { title: '課後說明 + 你自己決定', desc: '教練說明適合的後續課程選項，沒有壓力，你來決定接下來的安排' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
        <span className="w-5 h-0.5 bg-orange" />
        接下來會發生什麼
      </div>
      <h2 className="font-serif text-2xl font-black text-navy-700 mb-6">
        填完表單後<span className="text-orange">四個步驟</span>
      </h2>

      <div className="relative flex flex-col">
        {/* Vertical line */}
        <div className="absolute left-5 top-5 bottom-5 w-[1.5px] bg-gradient-to-b from-orange to-orange/20" />

        {steps.map((step, idx) => (
          <div key={step.title} className="flex gap-4 items-start py-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-orange text-white font-serif text-lg font-black flex items-center justify-center flex-shrink-0 shadow-[0_0_0_4px_rgba(251,114,10,0.12)]">
              {idx + 1}
            </div>
            <div>
              <div className="text-base font-semibold text-navy-700 mb-0.5">{step.title}</div>
              <div className="text-sm text-ink/60 leading-relaxed">{step.desc}</div>
              {step.badges && (
                <div className="flex gap-2 mt-2">
                  {step.badges.map((badge) => (
                    <span
                      key={badge.text}
                      className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                        badge.type === 'free'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-navy-700/10 text-navy-700'
                      }`}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
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
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
            {/* Left - Form */}
            <div id="form">
              <BookingForm />
            </div>

            {/* Right - Process Steps */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProcessSteps />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
