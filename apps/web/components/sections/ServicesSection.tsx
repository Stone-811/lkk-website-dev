const services = [
  {
    id: 'senior',
    icon: '🧓',
    title: '中高齡肌力訓練',
    description: '40歲後肌肉、骨質流失速度增加。透過科學訓練，讓你找回身體動作能力，生活健康自主又有尊嚴。',
    tags: ['肌少症預防', '骨質強化', '平衡訓練', '一對一教練'],
    badge: '最受歡迎',
    gradient: 'from-navy-800 to-navy-700',
  },
  {
    id: 'special',
    icon: '🏥',
    title: '特殊族群訓練',
    description: '中風、癌症、手術後、糖尿病、骨質疏鬆族群之專業訓練介入，由物理治療師督導，讓身體在最安全的方式下恢復。',
    tags: ['中風復健', '術後訓練', '慢性病管理', '物理治療師督導'],
    badge: '醫療背景',
    gradient: 'from-navy-700 to-navy-600',
  },
  {
    id: 'performance',
    icon: '🏅',
    title: '運動表現訓練',
    description: '針對專項需求與身體檢測，找出弱點，透過數據分析與專業肌力訓練提升你的運動表現。',
    tags: ['數據化訓練', '動作分析', '運動傷害預防'],
    badge: null,
    gradient: 'from-navy-800 to-navy-700',
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-cream-100 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          我們的服務
        </div>
        <h2 className="font-serif text-3xl lg:text-4xl font-black text-navy-700 mb-3">
          找到<span className="text-orange">適合你</span>的訓練方式
        </h2>
        <p className="text-ink/60 leading-relaxed mb-10 max-w-xl">
          以運動醫學知識為核心，每位學員都有獨立的評估與客製化課表。
        </p>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <article
              key={service.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-navy-700/15 hover:-translate-y-1 transition-transform"
            >
              {/* Card image */}
              <div className={`h-48 bg-gradient-to-br ${service.gradient} relative flex items-center justify-center`}>
                <span className="text-6xl opacity-35">{service.icon}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-800/85 to-transparent" />
                {service.badge && (
                  <span className="absolute top-4 left-4 bg-orange text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                    {service.badge}
                  </span>
                )}
              </div>

              {/* Card body */}
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-navy-700 mb-2">
                  {service.title}
                </h3>
                <p className="text-ink/60 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-navy-700 bg-navy-700/[0.08] px-2.5 py-0.5 rounded-full border border-navy-700/12"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
