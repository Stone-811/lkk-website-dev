const admin = require('firebase-admin');
require('dotenv').config({ path: './apps/web/.env.local' });

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// 經營團隊資料
const managementTeam = [
  {
    name: '黃元杰',
    nickname: '肥老闆',
    title: '創辦人暨執行長',
    photo: '/images/team/huang-yuanjie.png',
    description: '練健康創辦人，擁有經濟學碩士背景，曾任職於健身產業行銷與國際產品管理。深知台灣中高齡族群的運動需求，創立練健康，致力打造最專業的中高齡健身品牌。',
    credentials: ['IHFI 台灣 CPT 國際健康體適能專業人員', 'CPR + AED 認證', '台大農經所碩士'],
    sortOrder: 1,
  },
  {
    name: '曾子桓',
    nickname: 'Giwane',
    title: '訓練部區域經理・肌力與體能教練',
    photo: '/images/team/tseng-tzuhuan.png',
    description: '專精於肌力與體能訓練、運動表現提升及中高齡族群訓練。具備豐富的運動員培訓經驗，負責練健康教練團隊的訓練品質把關。',
    credentials: ['NSCA-CSCS', 'TSCA-SCC', 'SMA 運動總監認證', 'ASCA-VBT', 'AFAA-WT'],
    sortOrder: 2,
  },
  {
    name: '鄭宇劭',
    nickname: 'Bob',
    title: '總教練',
    photo: '/images/team/cheng-yushao.png',
    description: '物理治療師背景，專精於運動傷害防護與中高齡肌力訓練。曾擔任競速滑冰世界盃隨隊體能訓練師，將專業運動員的訓練方法融入中高齡健身課程。',
    credentials: ['物理治療師證照', 'NSCA-CSCS', 'NASM-CES', 'C 級肌力與體能教練'],
    sortOrder: 3,
  },
];

// 練健康授權講師
const lkkAuthorizedLecturers = [
  { name: '鄭宇劭', title: 'Lv 3 講師・物理治療師', photo: '/images/lecturers/lkk/cheng-yushao.png', specialties: ['運動專項肌力訓練', '中高齡/特殊族群訓練'], certifications: ['競技與教練科學碩士', '物理治療學士'], sortOrder: 1 },
  { name: '林星辰', title: 'Lv 1 講師・物理治療師', photo: '/images/lecturers/lkk/lin-xingchen.png', specialties: ['中高齡/特殊族群訓練', '動作控制', '功能改善'], certifications: ['物理治療學系', 'Neurac 認證'], sortOrder: 2 },
  { name: '鄭健寬', title: 'Lv 1 講師・職能治療師', photo: '/images/lecturers/lkk/cheng-jiankuan.png', specialties: ['中高齡/特殊族群訓練', '日常功能整合'], certifications: ['職能治療學系'], sortOrder: 3 },
  { name: '李柏橋', title: 'Lv 1 講師', photo: '/images/lecturers/lkk/li-boqiao.png', specialties: ['健力訓練', '中高齡肌力訓練'], certifications: ['NSCA-CPT'], sortOrder: 4 },
  { name: '吳禎明', title: 'Lv 1 講師', photo: '/images/lecturers/lkk/wu-zhenming.png', specialties: ['運動科學檢測', '增肌訓練', '週期化課表設計'], certifications: ['NSCA-CSCS', 'ACE-CPT'], sortOrder: 5 },
  { name: '王韻婷', title: 'Lv 1 講師', photo: '/images/lecturers/lkk/wang-yunting.png', specialties: ['功能性訓練', '身體組成調整', '壺鈴', '中高齡訓練'], certifications: ['NASM-CPT'], sortOrder: 6 },
];

// 練健康客座講師
const lkkGuestLecturers = [
  { name: '曾子桓', title: '訓練部區域經理', photo: '/images/lecturers/lkk/tseng-tzuhuan.png', specialties: ['肌力與體能訓練', '運動表現提升'], sortOrder: 10 },
  { name: '吳皓宇', title: '營養師・訓練部副理', photo: '/images/lecturers/lkk/wu-haoyu.png', specialties: ['運動營養', '增肌減脂', '中高齡訓練'], sortOrder: 11 },
  { name: '蕭彥嶸', title: '運動防護師・南京店店主管', photo: '/images/lecturers/lkk/xiao-yanrong.png', specialties: ['重訓', '健力', '傷害預防'], sortOrder: 12 },
  { name: '李哲宇', title: '新店七張店店主管', photo: '/images/lecturers/lkk/li-zheyu.png', specialties: ['肌力訓練', '功能性動作', '中高齡訓練'], sortOrder: 13 },
  { name: '石峻瑋', title: '營運經理', photo: '/images/lecturers/lkk/liuchang.png', specialties: ['營運管理', '課程規劃'], sortOrder: 14 },
  { name: '阮玟文', title: '品牌經理', photo: '/images/lecturers/lkk/ruan-wenwen.png', specialties: ['品牌行銷', '課程推廣'], certifications: ['NSCA-CPT'], sortOrder: 15 },
];

// 合作講師
const partnerLecturers = [
  {
    name: '卓彥廷',
    title: '復健科醫師',
    photo: '/images/lecturers/partner/zhuo-yanting.png',
    organization: '天母力康診所',
    description: '復健科專科醫師，致力於將臨床醫學與運動科學深度結合，強調訓練策略而非僅消除疼痛。',
    specialties: ['骨骼肌肉傷害', '運動醫學', '疼痛治療', '特殊族群運動處方'],
    certifications: ['復健科專科醫師', '前台北慈濟醫院復健科主治醫師', 'CAK 認證', 'Dynamic tape 認證', 'PNF 認證'],
    sortOrder: 1,
  },
  {
    name: '陳彥志',
    title: '骨科醫師',
    photo: '/images/lecturers/partner/chen-yanzhi.png',
    organization: '光田綜合醫院運動醫學科',
    description: '骨科專科醫師，整合臨床骨科與系統化訓練指導，強調安全的動作優化。',
    specialties: ['運動傷害動作評估', '手術評估', '超音波導引注射', '運動處方介入'],
    certifications: ['骨科專科醫師', 'NASM-CES 矯正運動專家', 'NSCA-CSPS 特殊族群訓練專家', '光田綜合醫院運動醫學科主任'],
    sortOrder: 2,
  },
  {
    name: '盧昶碩',
    nickname: 'Justin',
    title: '運動專業講師',
    photo: '/images/lecturers/partner/lu-changshuo.png',
    organization: '動思學院/運動解密 創辦人',
    description: '專精運動專項肌力與體能訓練，曾培訓多支國家代表隊，著有《把私人教練帶回家》。',
    specialties: ['運動專項肌力與體能訓練', '全人教育', '運動心理學'],
    certifications: ['ACE-CPT', 'NSCA-CSCS', 'P3 應用運動科學', '衛福部預防及延緩失能協助員'],
    sortOrder: 3,
  },
];

// 海外授權講師
const overseasLecturers = [
  {
    name: '周千媚',
    title: '海外授權講師',
    photo: '/images/lecturers/overseas/zhou-qianmei.png',
    region: '馬來西亞',
    countries: ['馬來西亞'],
    description: '練健康首位海外授權講師，將台灣專業的中高齡訓練系統引進馬來西亞，推廣安全有效的銀髮健身課程。',
    specialties: ['中高齡肌力訓練', '特殊族群訓練'],
    certifications: ['練健康授權講師認證'],
    sortOrder: 1,
  },
];

function generateSlug(name) {
  const englishSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (englishSlug.length < 2) {
    return `item-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
  }
  return englishSlug;
}

async function seedData() {
  const now = admin.firestore.Timestamp.now();

  // 1. 匯入經營團隊
  console.log('\n=== 匯入經營團隊 ===');
  for (const member of managementTeam) {
    const existing = await db.collection('team').where('name', '==', member.name).limit(1).get();
    if (!existing.empty) {
      console.log(`  團隊成員 "${member.name}" 已存在，跳過...`);
      continue;
    }

    const docRef = db.collection('team').doc();
    await docRef.set({
      ...member,
      slug: generateSlug(member.name),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  建立團隊成員: ${member.name}`);
  }

  // 2. 匯入練健康授權講師
  console.log('\n=== 匯入練健康授權講師 ===');
  for (const lecturer of lkkAuthorizedLecturers) {
    const existing = await db.collection('lecturers').where('name', '==', lecturer.name).where('type', '==', 'lkk').limit(1).get();
    if (!existing.empty) {
      console.log(`  講師 "${lecturer.name}" 已存在，跳過...`);
      continue;
    }

    const docRef = db.collection('lecturers').doc();
    await docRef.set({
      ...lecturer,
      slug: generateSlug(lecturer.name),
      type: 'lkk',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  建立講師: ${lecturer.name}`);
  }

  // 3. 匯入練健康客座講師
  console.log('\n=== 匯入練健康客座講師 ===');
  for (const lecturer of lkkGuestLecturers) {
    const existing = await db.collection('lecturers').where('name', '==', lecturer.name).where('type', '==', 'lkk').limit(1).get();
    if (!existing.empty) {
      console.log(`  講師 "${lecturer.name}" 已存在，跳過...`);
      continue;
    }

    const docRef = db.collection('lecturers').doc();
    await docRef.set({
      ...lecturer,
      slug: generateSlug(lecturer.name),
      type: 'lkk',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  建立講師: ${lecturer.name}`);
  }

  // 4. 匯入合作講師
  console.log('\n=== 匯入合作講師 ===');
  for (const lecturer of partnerLecturers) {
    const existing = await db.collection('lecturers').where('name', '==', lecturer.name).where('type', '==', 'partner').limit(1).get();
    if (!existing.empty) {
      console.log(`  講師 "${lecturer.name}" 已存在，跳過...`);
      continue;
    }

    const docRef = db.collection('lecturers').doc();
    await docRef.set({
      ...lecturer,
      slug: generateSlug(lecturer.name),
      type: 'partner',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  建立講師: ${lecturer.name}`);
  }

  // 5. 匯入海外授權講師
  console.log('\n=== 匯入海外授權講師 ===');
  for (const lecturer of overseasLecturers) {
    const existing = await db.collection('lecturers').where('name', '==', lecturer.name).where('type', '==', 'overseas').limit(1).get();
    if (!existing.empty) {
      console.log(`  講師 "${lecturer.name}" 已存在，跳過...`);
      continue;
    }

    const docRef = db.collection('lecturers').doc();
    await docRef.set({
      ...lecturer,
      slug: generateSlug(lecturer.name),
      type: 'overseas',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  建立講師: ${lecturer.name}`);
  }

  console.log('\n=== 匯入完成 ===');
  process.exit(0);
}

seedData().catch(console.error);
