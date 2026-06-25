import Link from 'next/link';

const steps = [
  {
    step: 1,
    title: '填寫預約表單',
    description: '姓名、電話、選擇門店\n30 秒完成',
  },
  {
    step: 2,
    title: '教練主動聯繫',
    description: '1 個工作天內\n電話或 LINE 聯絡',
  },
  {
    step: 3,
    title: '身體評估檢測',
    description: '肌力、活動度、平衡\n全面了解你的狀況',
  },
  {
    step: 4,
    title: '客製課表訓練',
    description: '物理治療師背景教練\n設計專屬課程',
  },
];

export default function FlowSection() {
  return (
    <section className="bg-navy-800 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center gap-2 text-sm font-bold text-orange/85 tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange/85" />
          預約流程
        </div>
        <h2 className="font-serif text-3xl lg:text-4xl font-black text-white mb-10">
          四步驟，<span className="text-orange">開始改變</span>
        </h2>

        {/* Steps grid */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-px bg-orange/30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="relative text-center">
                {/* Step number */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-orange text-white font-serif text-xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange/25">
                  {item.step}
                </div>

                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-orange text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg shadow-orange/35 hover:bg-orange-400 transition-all hover:-translate-y-0.5"
          >
            立即預約 →
          </Link>
          <p className="text-white/45 text-sm mt-4">
            <strong className="text-orange">50歲以上免費</strong>・一般首次體驗 $500・無隱藏費用
          </p>
        </div>
      </div>
    </section>
  );
}
