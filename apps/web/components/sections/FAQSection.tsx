'use client';

import { useState } from 'react';

const faqs = [
  {
    id: '1',
    question: '50歲以上可以來練健康嗎？',
    answer:
      '非常歡迎。練健康是台灣專注中高齡肌力訓練的先驅，50歲以上學員佔多數。首次體驗課完全免費，不需要任何運動基礎，教練會先做評估再設計課表。',
  },
  {
    id: '2',
    question: '從來沒有運動習慣，可以來嗎？',
    answer:
      '完全可以。我們的物理治療師背景教練會先進行身體評估，再設計安全有效的客製課表。很多學員從零開始，反而因為沒有錯誤習慣，進步更快。',
  },
  {
    id: '3',
    question: '有慢性病或術後可以訓練嗎？',
    answer:
      '可以。特殊族群訓練是我們的核心專業之一。中風、癌症術後、糖尿病、骨質疏鬆、心臟病等族群，我們都有豐富的服務經驗，並由物理治療師全程督導，安全第一。',
  },
  {
    id: '4',
    question: '體驗課之後一定要買課嗎？',
    answer:
      '完全不強迫。體驗課的目的是讓你了解我們的訓練方式，以及評估是否適合。教練會在體驗課後說明適合的課程選項，由你自由決定。',
  },
  {
    id: '5',
    question: '一對一還是團體課？',
    answer:
      '主要以一對一或小組（2–4人）為主，確保每位學員得到完整的教練關注和安全監督。中高齡與特殊族群的訓練需要個別化的動作修正，這是我們不做大班課的原因。',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="bg-cream-100 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          常見問題
        </div>
        <h2 className="font-serif text-3xl lg:text-4xl font-black text-navy-700 mb-10">
          你可能想知道的<span className="text-orange">事</span>
        </h2>

        {/* FAQ list */}
        <div className="max-w-2xl space-y-0">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-navy-700/15">
              <button
                type="button"
                className="w-full py-5 text-left flex items-center justify-between gap-4"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                aria-expanded={openId === faq.id}
              >
                <span className="font-medium text-navy-700">{faq.question}</span>
                <span
                  className={`w-6 h-6 rounded-full border border-navy-700/15 flex items-center justify-center flex-shrink-0 transition-colors ${
                    openId === faq.id ? 'bg-navy-700 border-navy-700 text-white' : 'text-navy-700'
                  }`}
                >
                  {openId === faq.id ? '−' : '+'}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openId === faq.id ? 'max-h-48 pb-5' : 'max-h-0'
                }`}
              >
                <p className="text-ink/60 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
