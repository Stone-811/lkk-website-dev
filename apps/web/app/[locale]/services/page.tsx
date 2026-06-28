import Link from 'next/link';

// Force dynamic rendering for next-intl
export const dynamic = 'force-dynamic';

const services = [
  {
    id: 'personal',
    title: '一對一訓練',
    subtitle: '最熱門',
    description: '專業教練量身打造個人訓練計畫，針對您的目標與身體狀況設計最適合的課程。',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop&q=80',
    features: [
      '個人化訓練計畫',
      '專業動作指導',
      '定期進度追蹤',
      '營養建議',
      '彈性排課時間',
    ],
    suitable: ['減重減脂', '增肌塑身', '體能提升', '運動新手'],
  },
  {
    id: 'rehab',
    title: '運動復健',
    subtitle: '專業醫療背景',
    description: '結合運動訓練與物理治療，協助傷後復健或慢性疼痛的改善。由物理治療師背景教練指導。',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=800&fit=crop&q=80',
    features: [
      '詳細疼痛評估',
      '客製化復健計畫',
      '漸進式訓練',
      '動作矯正',
      '居家訓練指導',
    ],
    suitable: ['運動傷害', '慢性疼痛', '術後復健', '姿勢矯正'],
  },
  {
    id: 'elderly',
    title: '銀髮族訓練',
    subtitle: '安全第一',
    description: '針對中高齡族群設計的運動課程，提升肌力、平衡感與生活品質，預防肌少症與跌倒。',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&q=80',
    features: [
      '低衝擊安全訓練',
      '平衡感訓練',
      '肌力維持',
      '關節活動度',
      '日常功能提升',
    ],
    suitable: ['50歲以上', '預防肌少症', '提升生活品質', '維持獨立生活'],
  },
  {
    id: 'group',
    title: '團體課程',
    subtitle: '小班制',
    description: '小班制團體訓練，與志同道合的夥伴一起運動，互相激勵成長。包含多元主題課程。',
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&h=800&fit=crop&q=80',
    features: [
      '小班制教學（4-8人）',
      '多元課程主題',
      '社群互動',
      '團體挑戰',
      '彈性參加',
    ],
    suitable: ['喜歡團體運動', '想認識同好', '預算考量', '多元嘗試'],
  },
];

export const metadata = {
  title: '服務介紹 | 練健康',
  description: '練健康提供一對一訓練、運動復健、銀髮族訓練、團體課程等多元服務，滿足不同需求。',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 font-serif">服務介紹</h1>
          <p className="text-cream-200 text-lg max-w-2xl mx-auto">
            針對不同需求，提供最適合您的訓練方案
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 items-start`}
              >
                {/* Image */}
                <div className="lg:w-2/5">
                  <div className="aspect-square rounded-3xl overflow-hidden sticky top-24 shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-3/5">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-navy-700 font-serif">{service.title}</h2>
                    {service.subtitle && (
                      <span className="px-3 py-1 bg-orange/10 text-orange text-sm rounded-full">
                        {service.subtitle}
                      </span>
                    )}
                  </div>

                  <p className="text-lg text-ink-600 mb-6">{service.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-3 text-navy-700">課程特色</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-orange flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suitable For */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-3 text-navy-700">適合對象</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.suitable.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 bg-cream-200 text-ink-700 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-cream-200">
                    <Link href="/booking" className="btn btn-primary">
                      預約體驗
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-cream-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-navy-700 font-serif">還有其他問題？</h2>
          <p className="text-ink-600 mb-8">查看常見問題或直接聯繫我們</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#faq" className="btn btn-outline">
              常見問題
            </Link>
            <Link href="/booking" className="btn btn-primary">
              免費諮詢
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
