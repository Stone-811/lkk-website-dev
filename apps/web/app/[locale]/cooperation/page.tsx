'use client';

import { useState } from 'react';
import Link from 'next/link';

const heroStats = [
  { title: '國衛院', desc: '學術共同研究計畫' },
  { title: '醫療級', desc: '草屯療養院等機構培訓' },
  { title: '跨國輸出', desc: '馬來西亞海外種子師資' },
  { title: '客製化', desc: '企業健促與團體動作篩檢' },
];

const methodPoints = [
  {
    num: '01',
    title: '講座邀約與專業授課',
    body: '應各大醫療體系、大專院校及社福團體之邀，分享練健康獨創的「中高齡與特殊族群訓練實務」。亦包含內容行銷與社群經營成果分享（如嘉義慈濟醫院講座），協助相關從業者提升專業及推廣技術。',
  },
  {
    num: '02',
    title: '企業健康促進邀請',
    body: '專為現代企業員工及中高齡同仁設計。結合科學化動作篩檢與數字化檢測，量身規劃內部健康講座與員工團體運動課程（如與知名品牌包大人合作），協助同仁踏出運動步伐，維持持之以恆的職場健康活力。',
  },
  {
    num: '03',
    title: '政府與醫療單位專業教育訓練',
    body: '輸出系統化教學經驗，為院內物理治療師、職能治療師及教練進行專業培訓（如草屯療養院教育訓練），將專業知識帶回單位持續造福病友。海外亦首度聯手馬來西亞 PhysioGym，將成熟的銀髮動作基礎訓練營帶向國際。',
  },
];

const pressCases = [
  { badge: '學術專案', org: '國家衛生研究院', title: '「中高齡訓練者訓練頻率與肌肉增長關係」共同研究', quote: '練健康引進專業級 InBody 770 與 Body Go 體適能檢測系統，協助學員透過數據精準掌握身體組成狀態，並透過博覽會展出為長輩進行科學化動作檢測。' },
  { badge: '跨國培訓', org: '馬來西亞 PhysioGym', title: '輸出成熟「銀髮動作基礎訓練營」培訓海外在機種子師資', quote: '跨國聯手將台灣成熟的銀髮訓練系統帶向國際。透過輸出系統化教學與實戰經驗，協助馬來西亞當地教練提升專業技術，讓正確的肌力訓練觀念跨越國界。' },
  { badge: '醫療教育訓練', org: '衛生福利部草屯療養院', title: '院內治療師內部培訓與病友團體訓練', quote: '合作包含團體訓練與內部教育訓練。除了親自接觸個案了解狀況外，更透過授課讓院內治療師帶回肌力訓練的專業知識，讓院內的運動訓練日後能夠持之以恆。' },
  { badge: '跨界講座與運動推廣', org: '慈濟醫院 ＆ 包大人', title: '肌力訓練課程、內容行銷分享與團體健康促進項目', quote: '應嘉義慈濟邀請開設12堂肌力課程與社群經營行銷講座；並應「包大人」邀請，為長輩量身打造團體可以進行的趣味運動課程，協助長輩順利踏出運動第一步。' },
];

const pressStats = [
  { num: '12 堂', label: '慈濟醫院專屬肌力與行銷授課' },
  { num: '跨國', label: '馬來西亞PhysioGym海外教練培訓' },
  { num: '大數據', label: '攜手國衛院推動中高齡肌肉研究' },
];

const enquiryTypes = [
  { label: '🎤 講座邀約', value: '講座邀約', placeholder: '請簡述您的講座邀約需求（例如：預計日期、聽眾背景對象、期望講授的主題方向、授課形式等）…' },
  { label: '🏢 企業健康促進', value: '企業健康促進邀請', placeholder: '請簡述您的企業同仁健康促進規劃（例如：同仁年齡層背景、期望採用的形式如健康講座/科學化動作篩檢/員工重訓體驗團體課、預計人數等）…' },
  { label: '🤝 採訪與異業合作', value: '媒體採訪與異業合作', placeholder: '請詳述您的採訪需求或異業合作提案內容（例如：報導專題、產品跨界結合構想、海外教練培訓授權洽談等）…' },
];

interface FormData {
  organization: string;
  name: string;
  phone: string;
  lineId: string;
  email: string;
  message: string;
}

const initialFormData: FormData = {
  organization: '',
  name: '',
  phone: '',
  lineId: '',
  email: '',
  message: '',
};

export default function CooperationPage() {
  const [activeType, setActiveType] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // 驗證 Email 格式
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 驗證電話格式（台灣手機或市話）
  const isValidPhone = (phone: string) => {
    // 手機: 09xxxxxxxx 或市話: 02-xxxx-xxxx 等
    return /^(09\d{8}|0\d{1,2}-?\d{3,4}-?\d{4})$/.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // 前端驗證
    if (!formData.organization.trim()) {
      setErrorMessage('請填寫公司/單位名稱');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage('請填寫聯絡人姓名');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('請填寫聯絡電話');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setErrorMessage('電話格式不正確，請輸入有效的手機或市話號碼');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('請填寫電子郵件');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setErrorMessage('電子郵件格式不正確');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('請填寫合作內容詳情');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    try {
      const res = await fetch('/api/leads/cooperation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cooperationType: enquiryTypes[activeType].value,
          sourcePage: '/cooperation',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
        setFormData(initialFormData);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || '送出失敗，請稍後再試');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('網路錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy-700 min-h-screen flex items-center pt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(251,114,10,0.1)_0%,transparent_52%),radial-gradient(circle_at_5%_74%,rgba(58,106,133,0.25)_0%,transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '55px 55px' }} />

        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 text-orange text-sm font-medium tracking-widest uppercase mb-8">
                <span className="w-5 h-px bg-orange" />
                大台北中高齡肌力訓練專家
                <span className="w-5 h-px bg-orange" />
              </div>

              <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                講座 / 採訪 / 合作洽詢
              </h1>

              <p className="text-white/65 text-lg font-light leading-relaxed max-w-xl mb-8">
                練健康以<strong className="text-white font-medium">中高齡與特殊族群健康為核心</strong>，積極推動跨領域合作。我們深耕醫療體系教育訓練、企業健康促進講座，以及前沿運動科學專案研究，期盼將正確的肌力訓練觀念推廣至海內外，共創雙贏。
              </p>

              <div className="flex gap-3 flex-wrap">
                <a href="#work" className="inline-flex items-center gap-2 bg-orange text-white font-medium px-6 py-2.5 rounded shadow-lg shadow-orange/35 hover:bg-orange-400 transition-colors">
                  填寫洽詢表單 →
                </a>
                <a href="#press" className="inline-flex items-center gap-2 bg-transparent border border-white/20 text-white/65 font-medium px-5 py-2.5 rounded hover:border-white/40 hover:text-white transition-colors">
                  查看過往實績
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {heroStats.map((stat) => (
                  <div key={stat.title} className="bg-white/[0.07] border border-white/10 rounded p-4">
                    <div className="font-serif text-2xl font-bold text-white">{stat.title}</div>
                    <div className="text-white/50 text-sm mt-1">{stat.desc}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.05] border border-white/10 rounded p-4">
                <div className="text-white/35 text-xs font-medium tracking-widest uppercase mb-3">深度研究與指標合作單位</div>
                <div className="flex items-center gap-3 flex-wrap text-white/65 text-sm font-medium">
                  <span>國家衛生研究院</span>
                  <span className="text-white/20">·</span>
                  <span>嘉義慈濟醫院</span>
                  <span className="text-white/20">·</span>
                  <span>草屯療養院</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="method" className="py-20 bg-cream-100">
        <div className="container mx-auto px-4">
          <span className="text-orange text-sm font-medium tracking-widest uppercase block mb-4">三大核心合作範疇</span>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-black text-navy-700 leading-tight mb-4">
                將醫學與運動科學<br /><span className="text-orange">精準落地</span>的跨界服務
              </h2>
              <p className="text-ink/60 leading-relaxed mb-8 max-w-md">
                我們打破傳統健身房的侷限，將物理治療、呼吸治療背景的專業肌力訓練系統，輸出給更需要健康促進的組織與大企業。
              </p>

              <div className="space-y-0 divide-y divide-navy-700/15">
                {methodPoints.map((point) => (
                  <div key={point.num} className="flex gap-4 py-5">
                    <div className="font-serif text-2xl font-bold text-navy-700/25 flex-shrink-0 w-8">{point.num}</div>
                    <div>
                      <h3 className="font-bold text-navy-700 mb-1">{point.title}</h3>
                      <p className="text-ink/60 text-sm leading-relaxed">{point.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Panel */}
            <div className="space-y-3">
              <div className="bg-navy-700 rounded p-6 space-y-4 divide-y divide-white/10">
                <div className="pb-4">
                  <div className="font-serif text-4xl font-black text-orange leading-none mb-2">中高齡研究</div>
                  <p className="text-white/65 text-sm leading-relaxed">與「國家衛生研究院」深度合作，共同研究中高齡訓練者訓練頻率與肌肉增長的關係。</p>
                  <span className="text-white/30 text-xs mt-2 block">學術與臨床實務接軌</span>
                </div>
                <div className="pt-4">
                  <div className="font-serif text-4xl font-black text-orange leading-none mb-2">科學化篩檢</div>
                  <p className="text-white/65 text-sm leading-relaxed">受邀參與高齡健康博覽會，將長輩動作篩檢結果數字化，提供精準動作改善與科學化評估。</p>
                  <span className="text-white/30 text-xs mt-2 block">健康照護・快樂生活・智慧服務</span>
                </div>
              </div>

              <div className="bg-white border border-navy-700/15 rounded p-5">
                <div className="text-sm font-bold text-navy-700 mb-3">專案合作引進之頂級檢測系統：</div>
                <div className="flex flex-wrap gap-2">
                  {['身體組成測量儀器 InBody 770', '智慧體適能檢測系統 Body Go', '銀髮基礎動作篩檢模組'].map((tag) => (
                    <span key={tag} className="text-xs text-navy-600 bg-navy-700/10 border border-navy-700/15 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Cases Section */}
      <section id="press" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-end mb-10">
            <div>
              <span className="text-orange text-sm font-medium tracking-widest uppercase block mb-4">Cooperation Cases</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-black text-navy-700 leading-tight">
                深耕台灣，<span className="text-orange">走向國際</span><br />練健康的跨領域實績
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {pressStats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-cream-100 border border-navy-700/15 rounded">
                  <div className="font-serif text-2xl font-bold text-navy-700 leading-none">{stat.num}</div>
                  <div className="text-ink/50 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pressCases.map((c) => (
              <article key={c.org} className="border border-navy-700/15 rounded overflow-hidden bg-white hover:shadow-lg transition-shadow">
                <div className="h-40 bg-navy-700 relative flex items-end">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-700 via-navy-700/70 to-transparent" />
                  <span className="absolute top-3 left-3 text-xs font-medium bg-orange/90 text-white px-3 py-1 rounded-full tracking-wide">
                    {c.badge}
                  </span>
                  <span className="relative z-10 font-serif text-xl font-bold text-white px-4 pb-3">{c.org}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-navy-700 text-sm mb-2 leading-snug">{c.title}</h3>
                  <p className="text-ink/60 text-sm leading-relaxed border-l-2 border-orange pl-3">「{c.quote}」</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="work" className="py-20 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-orange text-sm font-medium tracking-widest uppercase block mb-4">Contact Form</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-black text-navy-700 leading-tight mb-6">
              與我們攜手，<span className="text-orange">共創雙贏的健康價值</span>
            </h2>
            <p className="text-ink/60 text-base leading-relaxed max-w-2xl mx-auto">
              不論您是需要專業授課的醫療學術單位、期望舉辦員工健康促進講座的企業品牌，或是海外地區的訓練營授權洽詢。歡迎填寫下方表單，團隊將於 2 個工作天內由專人主動與您聯繫。
            </p>
          </div>

          <div className="bg-white border border-navy-700/15 rounded-lg p-6 lg:p-8 shadow-sm max-w-3xl mx-auto">
            <p className="text-xs font-bold text-ink/50 tracking-wide mb-4">請選擇您的洽詢項目：</p>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {enquiryTypes.map((type, idx) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setActiveType(idx)}
                  className={`py-3 px-4 rounded border text-center text-sm font-medium transition-colors ${
                    activeType === idx
                      ? 'border-navy-700 bg-navy-700/10 text-navy-700'
                      : 'border-navy-700/15 bg-cream-100 text-ink/50 hover:border-navy-700/30'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {submitStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-navy-700 mb-2">表單已送出！</h3>
                <p className="text-ink/60 mb-6">我們將於 2 個工作天內與您聯繫</p>
                <button
                  type="button"
                  onClick={() => setSubmitStatus('idle')}
                  className="text-orange font-medium hover:underline"
                >
                  填寫另一份表單
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-ink/70 block mb-1.5">公司 / 單位名稱 <span className="text-orange">*</span></label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => updateField('organization', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 bg-cream-100 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm disabled:opacity-50"
                      placeholder="請輸入完整的公司或單位名稱"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink/70 block mb-1.5">聯絡人姓名 <span className="text-orange">*</span></label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 bg-cream-100 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm disabled:opacity-50"
                      placeholder="請輸入聯絡人姓名"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-ink/70 block mb-1.5">聯絡電話 <span className="text-orange">*</span></label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 bg-cream-100 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm disabled:opacity-50"
                      placeholder="請輸入您的聯絡電話"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink/70 block mb-1.5">電子郵件 <span className="text-orange">*</span></label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 bg-cream-100 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm disabled:opacity-50"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink/70 block mb-1.5">Line ID <span className="text-ink/40 font-normal">(選填)</span></label>
                  <input
                    type="text"
                    value={formData.lineId}
                    onChange={(e) => updateField('lineId', e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-cream-100 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm disabled:opacity-50"
                    placeholder="請輸入 Line ID 以利快速聯絡"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink/70 block mb-1.5">合作內容詳情 <span className="text-orange">*</span></label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-cream-100 border border-navy-700/20 rounded focus:ring-2 focus:ring-navy-700 focus:border-navy-700 outline-none text-sm resize-none disabled:opacity-50"
                    placeholder={enquiryTypes[activeType].placeholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange text-white font-bold py-3.5 rounded shadow-lg shadow-orange/35 hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '送出中...' : '送出合作洽詢表單 →'}
                </button>
                <p className="text-center text-xs text-ink/40">送出即代表您同意本網頁資訊將僅作為商務對接與回覆洽詢使用。</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
