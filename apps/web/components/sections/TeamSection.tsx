import Link from 'next/link';
import Image from 'next/image';

const coaches = [
  {
    id: '1',
    name: '鄭宇劭',
    role: '物理治療師・創辦人',
    avatar: '鄭',
    description: '競技與教練科學碩士，世大運場館經理、競速滑冰世界盃隨隊物理治療師，深耕中高齡運動訓練超過十年。',
    creds: ['物理治療師', '運動專項肌力訓練', '中高齡訓練'],
    photo: '/images/team/cheng-yushao.png',
  },
  {
    id: '2',
    name: '吳皓宇',
    role: '營養師・訓練部副理',
    avatar: '吳',
    description: '運動營養與增肌減脂專家，新北市競速滑輪溜冰隊合作肌力體能教練，三鐵選手合作營養師。',
    creds: ['營養師', '運動營養', '增肌減脂'],
    photo: '/images/lecturers/lkk/wu-haoyu.png',
  },
  {
    id: '3',
    name: '蕭彥嶸',
    role: '運動防護師・南京店店主管',
    avatar: '蕭',
    description: '專精重訓與健力訓練，擁有豐富的傷害預防經驗，協助學員安全有效地達成訓練目標。',
    creds: ['運動防護師', '重訓', '健力'],
    photo: '/images/lecturers/lkk/xiao-yanrong.png',
  },
];

export default function TeamSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          專業教練團隊
        </div>
        <h2 className="font-serif text-3xl lg:text-4xl font-black text-navy-700 mb-3">
          由<span className="text-orange">醫療背景</span>專業人員組成
        </h2>
        <p className="text-ink/60 leading-relaxed mb-10">
          練健康成立於 2019 年，由物理治療師帶領，結合最新醫學研究，專注服務中高齡族群。
        </p>

        {/* Coaches grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="bg-white rounded-3xl p-6 lg:p-8 border border-navy-700/15 shadow-lg flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-navy-700 flex items-center justify-center text-white font-serif text-2xl font-bold mb-4 border-[3px] border-cream-200 overflow-hidden relative">
                {coach.photo ? (
                  <Image
                    src={coach.photo}
                    alt={coach.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                    loading="eager"
                  />
                ) : (
                  coach.avatar
                )}
              </div>

              {/* Name & role */}
              <h3 className="font-serif text-lg font-bold text-navy-700 mb-1">
                {coach.name} 教練
              </h3>
              <div className="text-sm text-orange font-semibold tracking-wide mb-3">
                {coach.role}
              </div>

              {/* Description */}
              <p className="text-sm text-ink/50 leading-relaxed mb-4">
                {coach.description}
              </p>

              {/* Credentials */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {coach.creds.map((cred) => (
                  <span
                    key={cred}
                    className="text-xs font-medium text-navy-700 bg-navy-700/[0.08] px-2.5 py-0.5 rounded-full"
                  >
                    {cred}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/team-intro/coaches"
            className="inline-flex items-center gap-2 text-navy-700 border border-navy-700/15 px-6 py-2.5 rounded-full hover:border-navy-700 transition-colors"
          >
            查看完整教練介紹 →
          </Link>
        </div>
      </div>
    </section>
  );
}
