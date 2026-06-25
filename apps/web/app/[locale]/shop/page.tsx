'use client';

import { useState } from 'react';
import Link from 'next/link';

const nutritionProducts = [
  { name: '高純度乳清蛋白粉 (銀髮高吸收配方)', desc: '富含BCAA，極佳消化率，有效針對高齡肌肉流失進行日常營養阻截。', price: 1280, icon: '🥛', tag: '熱銷推薦', tagType: 'hot' },
  { name: '活性海藻鈣＋維生素 D3 膠囊', desc: '高鈣足量添加，協同D3促進鈣吸收，強健中高齡骨質密度的關鍵基石。', price: 780, icon: '🦴' },
  { name: '專利深海魚油高濃縮軟膠囊', desc: 'rTG型態高純度EPA/DHA，維持思緒敏捷與新陳代謝流暢循環。', price: 950, icon: '🐟', tag: '教練推薦' },
  { name: '高機能活性益生菌 (順暢防護型)', desc: '專利耐酸菌株，維護高齡腸道菌相平衡，全面提升自主消化防護力。', price: 880, icon: '🦠' },
  { name: '非變性二型膠原蛋白 (UC-II) 關鍵飲', desc: '每日一瓶，修復關鍵活動磨損，找回蹲低爬高的關節靈活自在度。', price: 1680, icon: '💧' },
  { name: '全效高齡綜合維他命加鐵鋅', desc: '依據銀髮微量元素需求調配，一粒補足日常因胃口不佳流失的基礎營養。', price: 650, icon: '💊' },
  { name: '天然多酚葉黃素＋微藻 DHA 軟膠囊', desc: '全方位眼底照護配方，舒緩老化乾澀，看清生活中的每一步安全。', price: 890, icon: '🥬' },
  { name: '高纖低糖銀髮專用五穀即食燕麥餐包', desc: '豐富膳食纖維加植物蛋白，高飽足、不升糖，早餐點心的優質首選。', price: 420, icon: '🍵' },
  { name: '還原型輔酶 Q10 活力植物膠囊', desc: '直達細胞核心的發電廠，改善銀髮族日常體力疲憊與精神不濟。', price: 1200, icon: '🔥' },
  { name: '高純度螯合鋅麥芽精華膠囊', desc: '高吸收螯合結構，增進皮膚組織與黏膜健康，全方位修復肌體活力。', price: 580, icon: '🌱' },
];

const safetyProducts = [
  { name: '強磁壓紋浴室防滑不鏽鋼扶手', desc: '物理治療師極力推薦，針對潮濕浴室起立坐下提供150kg極致穩固支撐。', price: 850, icon: '🛠️', tag: '核心防跌', tagType: 'hot' },
  { name: '抗菌鋁合金高低可調防滑洗澡椅', desc: '高剛性防鏽支架，多檔高度微調，大幅度減少長輩洗澡時站立滑倒風險。', price: 1480, icon: '🪑' },
  { name: '醫療級四腳避震氣墊防滑健走杖', desc: '仿人體關節多視角抓地，分散雙膝壓力，讓每一次外出散步都穩健安心。', price: 980, icon: '🦯', tag: '外出首選' },
  { name: '超輕量可折疊雙煞車鋁合金輪椅', desc: '全車重量僅9.8kg，一秒折疊收納，出院、旅遊銜接雙腿動作弱化的最佳幫手。', price: 5500, icon: '♿' },
  { name: '門檻防滑無障礙加高斜坡墊 (全橡膠)', desc: '徹底解決掃地機器人與輪椅門檻阻礙，更是避免老人家小碎步絆倒的隱形功臣。', price: 680, icon: '🪜' },
  { name: '安全免打孔床邊起身安全護欄', desc: '利用床墊重量穩固壓實，輔助長輩晨間醒來借力撐起，並防止夜間翻滾跌落。', price: 1250, icon: '🛏️' },
  { name: '無線光感應智能防跌夜間地燈 (組)', desc: '高感度夜間人體探測，溫和不刺眼，點亮長者深夜頻尿進出浴室的每一步安全。', price: 490, icon: '💡' },
  { name: '浴室專用高效秒排水多孔防滑地墊', desc: '真空強力吸盤緊咬磁磚，大孔洞急速導流積水，全腳掌粗糙面抗滑力滿分。', price: 350, icon: '🟩' },
  { name: '高密度加厚防撞條與安全桌角套組', desc: '無毒環保NBR材質，全面包覆家中尖銳家具邊緣，防範碰撞產生的皮肉撕裂傷。', price: 290, icon: '🛡️' },
  { name: '智能防跌倒重力感應警報通報手環', desc: '內建三軸陀螺儀，偵測到異常衝擊跌倒一秒發送警報至子女手機，黃金救援不延誤。', price: 3200, icon: '⌚' },
];

const fitnessProducts = [
  { name: '環保無味防滾動包膠六角啞鈴 (5kg/7.5kg/10kg組)', desc: '經典多邊防滾動設計，抓握手感細緻，居家進行阻力推舉、深蹲阻力加重核心。', price: 880, icon: '🏋️', tag: '必備基礎', tagType: 'hot' },
  { name: '多功能多角度快速調整加固重訓椅', desc: '高承重鋼管、加厚背墊，7檔角度調節，提供銀髮居家訓練最高層級防翻車支撐。', price: 2980, icon: '🪑' },
  { name: '天然乳膠防斷裂高剛性阻力帶五件組', desc: '物理治療復健、上肢開背、下肢蚌殼式必備，循序漸進安全對抗阻力。', price: 450, icon: '💪', tag: '彈性抗阻' },
  { name: '免打孔室內門框安全加固自鎖單槓', desc: '雙向防滑大基座、重力自鎖，居家垂吊伸展、脊椎減壓與上肢拉力養成利器。', price: 790, icon: '🚪' },
  { name: '核心訓練靜音防爆加厚防滑健身球', desc: '高彈防爆蜂巢結構，極佳的骨盆核心訓練工具，在安全晃動中召喚深層平衡肌肉群。', price: 490, icon: '🔵' },
  { name: '負重計數專業無繩/有繩兩用跳繩', desc: '室內可無繩甩動，訓練長者上下肢連動性與爆發力，不絆倒也能訓練心肺耐力。', price: 380, icon: '🪢' },
  { name: '專業級加厚減震防滑環保 TPE 瑜珈墊', desc: '10mm極致抗衝擊厚度，跪姿、核心死蟲式訓練時，完美保護脆弱的膝蓋與關節。', price: 620, icon: '🧘' },
  { name: '加長型腕部支撐防滑半指健身手套', desc: '強力防滑矽膠網格，加長束帶穩固手腕，免除長輩因握力不佳造成的器械脫手意外。', price: 290, icon: '🧤' },
  { name: '智能液晶阻力可調微型油壓踏步機', desc: '垂直踩踏軌跡保護膝關節，體積小巧，是在客廳看電視時一邊維持心肺有氧與下肢力量的極佳選擇。', price: 1980, icon: '🛹' },
  { name: '肌肉放鬆高密度平衡泡沫軸 (筋膜滾筒)', desc: '中高密硬度不重疼，教練課後自主肌肉筋膜放鬆、延展緊繃背部與腿部肌群的最佳夥伴。', price: 390, icon: '🪵' },
];

type Product = { name: string; desc: string; price: number; icon: string; tag?: string; tagType?: string };

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <article className="bg-white border border-navy-700/15 rounded overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="h-44 bg-gradient-to-br from-cream-50 to-cream-100 flex items-center justify-center relative border-b border-navy-700/10">
        {product.tag && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded ${product.tagType === 'hot' ? 'bg-orange text-white' : 'bg-navy-700 text-white'}`}>
            {product.tag}
          </span>
        )}
        <span className="text-5xl drop-shadow-sm">{product.icon}</span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-navy-700 text-sm leading-snug mb-1">{product.name}</h3>
        <p className="text-ink/50 text-xs leading-relaxed flex-1">{product.desc}</p>
      </div>
      <div className="px-4 pb-4 space-y-2">
        <div className="font-serif text-lg font-black text-orange">
          <small className="text-ink/40 font-normal text-xs mr-0.5">NT$</small>{product.price.toLocaleString()}
        </div>
        <button onClick={onClick} className="w-full py-2 border border-navy-700 text-navy-700 text-sm font-medium rounded hover:bg-navy-700 hover:text-white transition-colors">
          了解詳情
        </button>
      </div>
    </article>
  );
}

export default function ShopPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalProduct, setModalProduct] = useState('');

  const openModal = (name: string) => {
    setModalProduct(name);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy-700 pt-24 pb-16 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,114,10,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 justify-center text-orange text-sm font-bold tracking-widest uppercase mb-4">
            <span className="w-4 h-px bg-orange" />
            LKK Wellness Select
            <span className="w-4 h-px bg-orange" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
            支撐你一輩子的<span className="text-orange">自主健康生活</span>
          </h1>
          <p className="text-white/65 font-light max-w-xl mx-auto">
            物理治療師與專業教練團隊嚴選。從精準調理、居家防跌到自主增肌，我們幫你挑選最安全、最科學化的銀髮健康必備品。
          </p>
        </div>
      </section>

      {/* Category Bar */}
      <div className="sticky top-16 z-40 bg-cream-100 border-b border-navy-700/15">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-3 py-3 overflow-x-auto">
            <a href="#nutrition" className="px-5 py-2 bg-white border border-navy-700/15 rounded-full text-sm font-medium text-navy-700 hover:border-orange hover:text-orange transition-colors whitespace-nowrap">
              🥛 銀髮族營養調理
            </a>
            <a href="#safety" className="px-5 py-2 bg-white border border-navy-700/15 rounded-full text-sm font-medium text-navy-700 hover:border-orange hover:text-orange transition-colors whitespace-nowrap">
              🛁 居家安全輔具
            </a>
            <a href="#fitness" className="px-5 py-2 bg-white border border-navy-700/15 rounded-full text-sm font-medium text-navy-700 hover:border-orange hover:text-orange transition-colors whitespace-nowrap">
              🏋️ 專業健身器材
            </a>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Nutrition Section */}
        <section id="nutrition" className="mb-16 scroll-mt-32">
          <div className="mb-8">
            <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 flex items-center gap-3">
              <span className="text-2xl">🥛</span> 銀髮族營養調理
            </h2>
            <p className="text-ink/50 text-sm mt-1">專為40歲後與高齡體質調配，著重高吸收率、肌肉維持與關節關鍵防護。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {nutritionProducts.map((p) => (
              <ProductCard key={p.name} product={p} onClick={() => openModal(p.name)} />
            ))}
          </div>
        </section>

        {/* Safety Section */}
        <section id="safety" className="mb-16 scroll-mt-32">
          <div className="mb-8">
            <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 flex items-center gap-3">
              <span className="text-2xl">🛁</span> 居家安全輔具
            </h2>
            <p className="text-ink/50 text-sm mt-1">守護長輩在家的最後防線，著重浴室、臥室與進出動線的防跌防護。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {safetyProducts.map((p) => (
              <ProductCard key={p.name} product={p} onClick={() => openModal(p.name)} />
            ))}
          </div>
        </section>

        {/* Fitness Section */}
        <section id="fitness" className="mb-8 scroll-mt-32">
          <div className="mb-8">
            <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 flex items-center gap-3">
              <span className="text-2xl">🏋️</span> 專業健身器材
            </h2>
            <p className="text-ink/50 text-sm mt-1">迎擊肌肉衰退，適合居家自主操作與教練課後課表落實的精選器材。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {fitnessProducts.map((p) => (
              <ProductCard key={p.name} product={p} onClick={() => openModal(p.name)} />
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-700/60 backdrop-blur-sm flex items-center justify-center p-5" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="font-serif text-xl font-black text-navy-700 mb-3">{modalProduct} · 洽詢</h3>
            <p className="text-ink/60 text-sm leading-relaxed mb-6">
              本網頁為「練健康商城」之一頁式視覺與商品展示示意設計，目前暫不開放直接線上購物。<br /><br />
              <strong className="text-navy-700">若您對此商品有訂購或體驗需求，歡迎前往或致電練健康各大實體門店，由您的專屬教練或現場人員為您提供預購與諮詢服務！</strong>
            </p>
            <button onClick={() => setShowModal(false)} className="bg-orange text-white font-medium px-6 py-2.5 rounded shadow-lg shadow-orange/35 hover:bg-orange-400 transition-colors">
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
