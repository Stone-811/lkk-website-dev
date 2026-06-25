import Link from 'next/link';

// Force dynamic rendering for next-intl
export const dynamic = 'force-dynamic';

const stats = [
  { num: '5.4億', label: '亞太地區 60 歲以上人口', src: '來源：WHO, 2024' },
  { num: '2030', label: '亞洲每 5 人將有 1 人超過 60 歲', src: '來源：聯合國人口署' },
  { num: '7年', label: '練健康深耕中高齡訓練市場', src: '2019 年成立至今' },
  { num: '6屆', label: 'LKK4 年度中高齡競技賽事', src: '台灣唯一同類型賽事' },
];

const marketPoints = [
  '台灣 65 歲以上人口佔比已達 **19.2%**，預計 2025 年進入超高齡社會（20%）',
  '新加坡、馬來西亞、香港同步面對高齡化，且中高收入族群比例更高，消費力更強',
  '現有健身市場幾乎以年輕族群為主，專門服務中高齡、有醫療背景支撐的訓練品牌**極度稀缺**',
  '肌少症、骨質疏鬆、術後復健的社會關注持續升高，帶動相關健康服務需求的快速成長',
];

const timingCards = [
  { num: '01', title: '市場空窗正在關閉', body: '高齡化帶來的商業機會已有更多人意識到，但能真正落地執行、有完整方法論的品牌仍然極少。先進場的品牌將取得定位優勢，後進者需要付出更高的市場教育成本。' },
  { num: '02', title: '練健康的體系已經成熟', body: '七年的實戰經驗、四間門店的營運模式、完整的教練培訓體系、以及六屆 LKK4 建立的品牌知名度——這些都已就位。你不是在投資一個概念，而是一個已被市場驗證的系統。' },
  { num: '03', title: '我們正在選擇性擴張', body: '我們不以規模為優先，而是選擇真正理解這個市場、有資源把事情做好的夥伴。現在是加入討論的合適時機，我們希望和有意思的人一起把這件事做大。' },
];

const differentiators = [
  {
    tag: '方法論',
    title: '由物理治療師主導的訓練體系',
    body: '一般健身品牌的教練是體育背景，練健康的核心團隊是物理治療師和呼吸治療師。這個差異讓我們能服務一般健身無法接觸的族群——術後、慢性病、骨質疏鬆——而這些正是中高齡市場中需求最強、黏著度最高的客群。',
  },
  {
    tag: '認證體系',
    title: '練健康學院：教練不靠外聘',
    body: '我們自建教練認證培訓體系（練健康學院），採學分制發證。這意味著加盟夥伴的教練人才問題，不需要自行從市場上搜尋和篩選——有一個完整的培訓和認證系統在支撐。這是大多數連鎖健身品牌做不到的。',
  },
  {
    tag: '品牌資產',
    title: '已有媒體信任度和公眾知名度',
    body: '大愛新聞、吳淡如、動思學院等媒體背書，以及六屆 LKK4 建立的賽事品牌，讓練健康在中高齡訓練這個品類上已有公眾辨識度。加盟夥伴進場時，不需要從零開始建立品牌信任——你站在一個已有高度的起點上。',
  },
];

const lkk4Points = [
  { icon: '🏋️', title: '賽事即行銷，無需另外投放廣告', desc: '每年一屆的 LKK4 產生大量媒體曝光、社群擴散和口碑，這些流量自然流入門店，降低加盟夥伴的行銷成本' },
  { icon: '🌏', title: '亞洲擴張的贊助吸引力', desc: 'LKK4 進入新市場後，對保健品、保險、金融品牌的贊助吸引力，是一般健身中心無法比擬的附加資產' },
  { icon: '📈', title: '參賽者即最高黏著度學員', desc: '參加過 LKK4 的學員，流失率遠低於一般學員。賽事讓訓練有了目標，目標讓人留下來' },
  { icon: '🛡️', title: '模仿者已出現，但六年的積累無法複製', desc: '市面上已有品牌開始模仿練健康的方向，甚至出現類似賽事。但六屆的歷史、媒體認知、學員社群，是時間積累出來的護城河' },
];

const supports = [
  { icon: '🎓', title: '教練培訓與認證', desc: '練健康學院提供完整的教練培訓課程和學分制認證，確保每個門市的服務品質一致，不依賴外部人才市場的不確定性。' },
  { icon: '📋', title: '營運方法論', desc: '七年累積的學員評估流程、課程設計框架、客戶管理系統，讓加盟夥伴不需要從頭摸索，直接站在已驗證的系統上運作。' },
  { icon: '🏆', title: 'LKK4 賽事體系', desc: '加盟夥伴進入 LKK4 的賽事生態，包含品牌使用、賽事籌辦支援、贊助招商協助，讓門市從第一天就有不同於競爭者的差異化資產。' },
  { icon: '📣', title: '品牌與行銷支援', desc: '台灣總部建立的媒體關係、社群內容體系、品牌設計規範，提供給夥伴使用，確保品牌在不同市場的一致性。' },
  { icon: '🌐', title: '在地市場進入支援', desc: '針對不同市場（新加坡、馬來西亞、香港等），提供在地化建議，包括法規差異、目標族群定位、語言本地化，協助夥伴減少進場摩擦。' },
  { icon: '🤝', title: '持續的夥伴關係', desc: '不是簽約後就放生。我們建立持續的溝通機制，包含定期交流、問題回應、以及隨體系升級而同步更新的知識支援。' },
];

export const metadata = {
  title: '練健康加盟說明會 | LKK Wellness Franchise',
  description: '亞洲正在老去，而這個市場幾乎還沒有人在認真做。練健康花了七年建立這套體系，現在我們正在選擇合適的夥伴，一起把它帶出去。',
};

export default function FranchisePage() {
  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <section className="relative bg-navy-700 min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(251,114,10,0.14)_0%,transparent_70%)] -top-[200px] -right-[150px]" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(58,106,133,0.35)_0%,transparent_70%)] -bottom-[100px] -left-[100px]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,0.025) 79px,rgba(255,255,255,0.025) 80px)' }} />

        <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
          <div className="flex items-center gap-3 text-orange text-sm font-medium tracking-widest uppercase mb-8">
            <span className="w-7 h-px bg-orange" />
            練健康 LKK Wellness・加盟說明
            <span className="w-7 h-px bg-orange" />
          </div>

          <h1 className="font-serif text-5xl lg:text-7xl font-black text-white leading-tight mb-3">
            亞洲正在<br /><span className="text-orange italic">老去</span>
          </h1>
          <p className="font-serif text-xl lg:text-2xl text-white/45 mb-8 tracking-wide">
            而這個市場，幾乎還沒有人在認真做
          </p>

          <p className="text-white/60 text-lg font-light leading-relaxed max-w-xl mb-10">
            全球人口老化速度最快的地區，正是你我所在的亞洲。<br />
            <strong className="text-white/85 font-medium">需求已經在這裡，缺的是有方法論的人來承接它。</strong><br />
            練健康花了七年建立這套體系，現在我們正在選擇合適的夥伴，一起把它帶出去。
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            <a href="#apply" className="inline-flex items-center gap-2 bg-orange text-white font-medium px-9 py-4 rounded shadow-lg shadow-orange/40 hover:bg-orange-600 transition-all">
              預約加盟說明會 →
            </a>
            <span className="text-white/25 text-sm tracking-wide">說明會保密進行，不對外公開</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-orange">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={stat.label} className={`py-6 px-4 text-center border-white/20 ${idx < 3 ? 'border-r' : ''} ${idx < 2 ? 'lg:border-r' : ''}`}>
                <div className="font-serif text-3xl lg:text-4xl font-black text-white leading-none">{stat.num}</div>
                <div className="text-white/70 text-xs mt-1 tracking-wide uppercase">{stat.label}</div>
                <div className="text-white/45 text-[10px] mt-1">{stat.src}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Section */}
      <section className="py-20 bg-cream-100">
        <div className="container mx-auto px-4">
          <span className="text-orange text-sm font-medium tracking-widest uppercase block mb-4">市場機會</span>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-serif text-4xl lg:text-5xl font-black text-navy-700 leading-tight mb-6">
                這個需求<br /><span className="text-orange italic">已經存在</span>
              </h2>
              <p className="text-ink/70 leading-relaxed mb-8 max-w-lg">
                高齡人口不只是在增加，他們的消費能力和健康意識也在同步提升。這一代的 60 歲，和上一代的 60 歲完全不同——他們有意願、有能力、有需求，但幾乎找不到真正懂他們的訓練服務。
              </p>
              <div className="space-y-4">
                {marketPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 bg-orange rounded-full mt-2.5 flex-shrink-0" />
                    <p className="text-ink/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-navy-700 font-medium">$1</strong>') }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Data Callout */}
            <div className="bg-[#0f2130] rounded p-8 space-y-6">
              <div>
                <div className="font-serif text-5xl font-black text-orange leading-none mb-2">19.2%</div>
                <div className="text-white/65 text-sm leading-relaxed">台灣 65 歲以上人口佔比<br />亞洲最快速高齡化地區之一</div>
                <div className="text-white/30 text-xs mt-1">來源：國家發展委員會, 2024</div>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <div className="font-serif text-5xl font-black text-orange leading-none mb-2">2倍+</div>
                <div className="text-white/65 text-sm leading-relaxed">亞太地區老年健康相關支出<br />預估 2035 年前成長速度</div>
                <div className="text-white/30 text-xs mt-1">來源：Deloitte Asia Pacific Health Report</div>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <div className="font-serif text-5xl font-black text-orange leading-none mb-2">幾乎0</div>
                <div className="text-white/65 text-sm leading-relaxed">具備系統化方法論、醫療背景支撐<br />且已有賽事品牌的中高齡訓練連鎖</div>
                <div className="text-white/30 text-xs mt-1">東南亞市場現況</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timing Section */}
      <section className="py-20 bg-navy-700">
        <div className="container mx-auto px-4">
          <span className="text-orange/80 text-sm font-medium tracking-widest uppercase block mb-4">為什麼是現在</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-10">
            時機<span className="text-orange italic">從不等人</span>
          </h2>

          <div className="grid lg:grid-cols-3 gap-0.5 bg-white/10 rounded overflow-hidden mb-10">
            {timingCards.map((card) => (
              <div key={card.num} className="bg-navy-700 p-8 hover:bg-white/[0.04] transition-colors">
                <div className="font-serif text-5xl font-black text-orange/35 leading-none mb-4">{card.num}</div>
                <h3 className="font-serif text-lg font-bold text-white mb-3">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="border border-white/10 rounded p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
            <p className="text-white/65 leading-relaxed">
              若你也認同這個市場機會，<strong className="text-white font-medium">我們希望和你進一步談談</strong>。說明會保密進行，沒有銷售壓力。
            </p>
            <a href="#apply" className="inline-flex items-center gap-2 bg-orange text-white font-medium px-8 py-3 rounded shadow-lg shadow-orange/40 hover:bg-orange-600 transition-all flex-shrink-0">
              預約說明會 →
            </a>
          </div>
        </div>
      </section>

      {/* Differentiation */}
      <section className="py-20 bg-cream-100">
        <div className="container mx-auto px-4">
          <span className="text-orange text-sm font-medium tracking-widest uppercase block mb-4">為什麼是練健康</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-black text-navy-700 leading-tight mb-3">
            不是自己做，<br /><span className="text-orange italic">而是站在體系上做</span>
          </h2>
          <p className="text-ink/70 leading-relaxed max-w-xl mb-10">
            自己開一間健身房服務中高齡，和加入一個已有方法論、認證體系、品牌資產的體系，是完全不同的事。
          </p>

          <div className="space-y-0 border-t border-navy-700/15">
            {differentiators.map((item, idx) => (
              <div key={item.title} className="grid lg:grid-cols-[3rem_1fr_1fr] gap-4 lg:gap-8 py-8 border-b border-navy-700/15">
                <div className="font-serif text-4xl font-black text-navy-700/15 leading-none">0{idx + 1}</div>
                <div>
                  <span className="text-orange text-xs font-medium tracking-widest uppercase block mb-2">{item.tag}</span>
                  <h3 className="font-serif text-lg font-bold text-navy-700">{item.title}</h3>
                </div>
                <p className="text-ink/60 text-sm leading-relaxed lg:pt-4">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LKK4 Section */}
      <section className="py-20 bg-navy-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 font-serif text-[10rem] lg:text-[14rem] font-black text-white/[0.06] leading-none select-none">LKK4</div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-orange/15 border border-orange/30 text-orange text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
                  護城河
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
                  競爭者可以<br />複製門市，<br />但複製不了<span className="text-orange"> LKK4</span>
                </h2>
                <p className="text-white/60 text-sm leading-relaxed max-w-md">
                  LKK4 中高齡四項體能挑戰賽是練健康獨創的年度競技賽事，也是目前台灣唯一同類型賽事。六年的積累讓它成為一個有社群、有口碑、有媒體黏著度的品牌本身——而不只是一個活動。
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {lkk4Points.map((point) => (
                <div key={point.title} className="flex gap-4 items-start p-4 bg-white/[0.04] border border-white/10 rounded hover:bg-white/[0.07] transition-colors">
                  <div className="text-2xl flex-shrink-0 mt-0.5">{point.icon}</div>
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">{point.title}</h4>
                    <p className="text-white/45 text-xs leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <span className="text-orange text-sm font-medium tracking-widest uppercase block mb-4">總部支援</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-black text-navy-700 leading-tight mb-3">
            你不是一個人<br /><span className="text-orange italic">在面對這個市場</span>
          </h2>
          <p className="text-ink/70 leading-relaxed max-w-xl mb-10">
            我們的目標不是找人開店，而是找對的夥伴，然後給他最好的後援讓他做好。
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy-700/15 rounded overflow-hidden mb-8">
            {supports.map((item) => (
              <div key={item.title} className="bg-white p-6 hover:bg-cream-100 transition-colors">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-base font-bold text-navy-700 mb-2">{item.title}</h3>
                <p className="text-ink/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-cream-100 border border-navy-700/15 rounded p-6 flex flex-col lg:flex-row items-center gap-6">
            <p className="text-ink/70 text-sm leading-relaxed flex-1">
              以上所有支援的細節，包含具體的合作模式和條件，<strong className="text-navy-700 font-medium">只在說明會中說明</strong>。我們希望在真正的對話中，找到適合一起做這件事的夥伴。
            </p>
            <a href="#apply" className="inline-flex items-center gap-2 bg-orange text-white font-medium px-8 py-3 rounded shadow-lg shadow-orange/40 hover:bg-orange-600 transition-all flex-shrink-0">
              預約說明會 →
            </a>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 bg-navy-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-orange/80 text-sm font-medium tracking-widest uppercase block mb-4">預約說明會</span>
              <h2 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                讓我們<br /><span className="text-orange italic">深入談談</span>
              </h2>
              <p className="text-white/55 leading-relaxed mb-8">
                說明會以線上或面談方式進行，通常 60–90 分鐘，保密進行，沒有任何銷售壓力。我們只是想多了解你，也讓你更了解我們。
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { title: '完整的品牌與市場說明', desc: '無法在網站公開的資訊，在說明會中呈現' },
                  { title: '雙向提問', desc: '你問我們，我們也想了解你的背景和想法' },
                  { title: '探索合作可能性', desc: '不一定要立刻做決定，先看看有沒有可以一起做的事' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 items-start">
                    <span className="text-orange mt-1">→</span>
                    <div>
                      <strong className="text-white/80 font-medium block">{item.title}</strong>
                      <span className="text-white/45 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange/10 border border-orange/20 rounded p-4 text-white/45 text-sm leading-relaxed">
                <strong className="text-orange">保密說明：</strong> 本頁面不在搜尋引擎索引範圍，說明會內容保密，資料僅用於聯繫目的，不對外分享。
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded p-8 shadow-2xl">
              <h3 className="font-serif text-lg font-bold text-navy-700 mb-1">填寫基本資料</h3>
              <p className="text-ink/50 text-sm mb-6 pb-6 border-b border-navy-700/15">
                我們會在 3 個工作天內以您偏好的方式聯繫，安排說明會時間
              </p>

              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-ink/70 block mb-1.5">姓名 <span className="text-orange">*</span></label>
                    <input type="text" className="w-full px-4 py-2.5 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm" placeholder="您的姓名" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink/70 block mb-1.5">公司／機構名稱</label>
                    <input type="text" className="w-full px-4 py-2.5 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm" placeholder="如適用" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink/70 block mb-1.5">電子郵件 <span className="text-orange">*</span></label>
                  <input type="email" className="w-full px-4 py-2.5 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm" placeholder="主要聯繫信箱" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-ink/70 block mb-1.5">聯繫電話</label>
                    <input type="tel" className="w-full px-4 py-2.5 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm" placeholder="+886 或當地號碼" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink/70 block mb-1.5">所在地區 <span className="text-orange">*</span></label>
                    <select className="w-full px-4 py-2.5 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm bg-white">
                      <option value="">請選擇</option>
                      <option>台灣</option>
                      <option>新加坡</option>
                      <option>馬來西亞</option>
                      <option>香港</option>
                      <option>中國大陸</option>
                      <option>其他</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink/70 block mb-1.5">您對哪種合作方式最感興趣？ <span className="text-orange">*</span></label>
                  <select className="w-full px-4 py-2.5 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm bg-white">
                    <option value="">請選擇</option>
                    <option>實體加盟門店</option>
                    <option>區域代理／主加盟</option>
                    <option>教練認證授權</option>
                    <option>LKK4 賽事授權</option>
                    <option>尚在評估中，想先了解</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink/70 block mb-1.5">想讓我們事先了解的事（選填）</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm resize-none" placeholder="您的背景、目前的想法、或任何想提前說明的事項..." />
                </div>

                <button type="submit" className="w-full bg-orange text-white font-medium py-3.5 rounded shadow-lg shadow-orange/35 hover:bg-orange-600 transition-all">
                  送出預約申請 →
                </button>
                <p className="text-center text-xs text-ink/40">您的資料保密處理，僅用於說明會安排，不作其他用途</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
