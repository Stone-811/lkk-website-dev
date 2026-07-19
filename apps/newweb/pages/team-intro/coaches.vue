<script setup lang="ts">
useHead({
  title: '全體教練｜練健康 LKK Wellness',
  meta: [
    {
      name: 'description',
      content: '練健康專業教練團隊，由物理治療師與運動科學專家組成，專注於中高齡健康訓練。'
    }
  ]
})

// 門店資料
const stores = [
  { name: '新店七張店', slug: 'xindian' },
  { name: '南京店', slug: 'nanjing' },
  { name: '松江店', slug: 'songjiang' },
  { name: '西門店', slug: 'ximending' },
]

// 門店名稱對照
const storeNames: Record<string, string> = {
  xindian: '新店七張店',
  nanjing: '南京店',
  songjiang: '松江店',
  ximending: '西門店',
}

// 教練資料 (依門店分類)
const coachesByStore: Record<string, any[]> = {
  xindian: [
    {
      id: 'xd-1',
      name: '李哲宇',
      roleTitle: '店主管・物理治療師・教練',
      photo: '/images/coaches/xindian/li-zheyu.jpg',
      education: ['國立陽明交通大學物理治療暨輔助科技學系'],
      experiences: ['新店七張店 店主管', '練健康教練培訓講師', '羅東博愛醫院 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'SFMA 動作篩檢認證', 'FMS 功能性動作篩檢認證', 'DNS A Course', 'RPR Level 1'],
      specialties: ['動作優化訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'],
    },
    {
      id: 'xd-2',
      name: '劉軒豪',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/xindian/liu-xuanhao.png',
      education: ['國立台灣大學物理治療學系'],
      experiences: ['新北市私立慈濟護理之家 物理治療師', '振興醫院 物理治療師'],
      certifications: ['物理治療師證照', 'Redcord Neurac 1 紅繩懸吊訓練認證', 'Redcord Neurac 2 紅繩懸吊訓練認證', 'NASM-CES 矯正性運動訓練專家認證'],
      specialties: ['中高齡族群肌力訓練', '骨骼肌肉系統傷害後訓練', '退化性關節炎訓練', '懸吊系統訓練'],
    },
    {
      id: 'xd-3',
      name: '柯雲翔',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/xindian/ke-yunxiang.png',
      education: ['輔仁大學物理治療學系'],
      experiences: ['骨科診所 物理治療師', '健身工廠 私人教練'],
      certifications: ['物理治療師證照', 'ACE-CPT 私人教練認證', 'SFMA 動作評估系統認證', 'FMS 功能性動作篩檢認證'],
      specialties: ['中高齡族群肌力訓練', '慢性疼痛族群肌力訓練', '動作控制優化訓練'],
    },
    {
      id: 'xd-4',
      name: '林學禮',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/xindian/lin-xueli.png',
      education: ['國立陽明交通大學物理治療暨輔助科技學系'],
      experiences: ['恆新復健科診所 物理治療師', '桃園長庚醫院 物理治療師'],
      certifications: ['物理治療師證照', 'GYROKINESIS® Level 1', 'NASM-CES', 'Redcord Neurac 1', 'DNS A Course'],
      specialties: ['姿勢控制與骨盆穩定', '呼吸訓練', '術後族群肌力訓練', '脊椎與核心控制訓練'],
    },
    {
      id: 'xd-5',
      name: '楊百恩',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/xindian/yang-baien.png',
      education: ['國立台灣大學物理治療學系'],
      experiences: ['衛生福利部雙和醫院 物理治療師'],
      certifications: ['物理治療師證照', 'Polestar Pilates Mat', 'ACE-CPT 美國運動協會私人教練'],
      specialties: ['動作控制訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'],
    },
    {
      id: 'xd-6',
      name: '陳宣戎',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/xindian/chen-xuanrong.jpg',
      education: ['義守大學物理治療學系'],
      experiences: ['安德復復健專科診所 物理治療師', '長安醫院復健科 物理治療師'],
      certifications: ['物理治療師證照', 'Stott Pilates Mat 墊上皮拉提斯認證', 'DNS Exercise Course Part 1 認證', 'ACE-CPT 美國運動協會私人教練證照'],
      specialties: ['中高齡肌力訓練', '懸吊系統訓練', '皮拉提斯訓練', '腰椎骨盆穩定訓練'],
    },
    {
      id: 'xd-7',
      name: '陳冠翰',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/xindian/chen-guanhan.png',
      education: ['國立台灣大學物理治療學系'],
      experiences: ['振興醫院 物理治療師', '仁康醫院 物理治療師'],
      certifications: ['物理治療師證照', 'Redcord Neurac 1 認證', 'Redcord Neurac 2 認證', 'DNS A/B Course 認證'],
      specialties: ['中高齡肌力訓練', '懸吊系統訓練', '腰椎骨盆穩定訓練'],
    },
    {
      id: 'xd-8',
      name: '姚舜瀚',
      roleTitle: '教練',
      photo: '/images/coaches/xindian/yao-shunhan.png',
      education: ['國立體育大學競技與教練科學研究所運動教練碩士班', '國立體育大學技擊運動技術學系'],
      experiences: ['三級棒球隊 教練', '國家級武術運動員', '跆拳道道館 館長兼教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'TATHA 台灣肌力及體能訓練協會 Level 1 認證'],
      specialties: ['中高齡肌力訓練', '青少年運動表現訓練', '運動員肌力訓練'],
    },
    {
      id: 'xd-9',
      name: '林芳妤',
      roleTitle: '教練',
      photo: '/images/coaches/xindian/lin-fangyu.png',
      education: ['國立體育大學休閒產業經營學系'],
      experiences: ['AFAA MAT SCIENCE 墊上核心國際證照講師', '新北市運動中心 專任教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'ViPR 專業教練認證', 'AFAA MAT SCIENCE 墊上核心國際證照'],
      specialties: ['中高齡肌力訓練', '核心穩定訓練', '皮拉提斯課程'],
    },
    {
      id: 'xd-10',
      name: '鄭健寬',
      roleTitle: '教練',
      photo: '/images/coaches/xindian/zheng-jiankuan.png',
      education: ['國立臺灣師範大學 體育與運動科學系運動科學碩士班', '國立體育大學適應體育學系'],
      experiences: ['World Gym 世界健身俱樂部 自由教練', '身心動作教育學會 身心學 師資培訓'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'SFMA 動作篩檢認證', 'FMS 功能性動作篩檢認證', 'NSCA-CPT 美國國家肌力與體能協會私人教練'],
      specialties: ['身心動作教育', '特殊族群訓練', '中高齡肌力訓練', '功能性動作訓練'],
    },
  ],
  nanjing: [
    {
      id: 'nj-1',
      name: '蕭彥嶸',
      roleTitle: '店主管・物理治療師・教練',
      photo: '/images/coaches/nanjing/xiao-yanrong.png',
      education: ['中山醫學大學物理治療學系'],
      experiences: ['南京店 店主管', '練健康教練培訓講師', '臺北榮民總醫院 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'NSCA-CPT 美國國家肌力與體能協會私人教練', 'FMS Level 1 功能性動作篩檢'],
      specialties: ['動作優化訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'],
    },
    {
      id: 'nj-2',
      name: '鄭宇劭',
      roleTitle: '副店主管・物理治療師・教練',
      photo: '/images/coaches/nanjing/zheng-yushao.png',
      education: ['輔仁大學物理治療學系'],
      experiences: ['南京店 副店主管', '練健康教練培訓講師', '世大運 場館經理'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'FMS Level 1 功能性動作篩檢', 'Redcord Neurac 1'],
      specialties: ['中高齡肌力訓練', '運動表現提升', '術後復健訓練'],
    },
    {
      id: 'nj-3',
      name: '謝季宏',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/nanjing/xie-jihong.png',
      education: ['國立陽明交通大學物理治療暨輔助科技學系'],
      experiences: ['臺北市立聯合醫院 物理治療師', '臺大醫院 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'DNS A/B Course'],
      specialties: ['中高齡肌力訓練', '動作控制訓練', '神經系統疾患訓練'],
    },
    {
      id: 'nj-4',
      name: '林星辰',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/nanjing/lin-xingchen.png',
      education: ['國立成功大學物理治療學系'],
      experiences: ['成大醫院 物理治療師', '骨科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'NASM-CES 矯正性運動訓練專家'],
      specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '姿勢矯正訓練'],
    },
    {
      id: 'nj-5',
      name: '鍾尚哲',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/nanjing/zhong-shangzhe.png',
      education: ['國立台灣大學物理治療學系'],
      experiences: ['台大醫院 物理治療師', '復健科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'DNS A Course'],
      specialties: ['中高齡肌力訓練', '神經系統疾患訓練', '平衡訓練'],
    },
    {
      id: 'nj-6',
      name: '許逸陽',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/nanjing/xu-yiyang.png',
      education: ['國立陽明交通大學物理治療暨輔助科技學系'],
      experiences: ['醫學中心 物理治療師', '骨科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'Stott Pilates Mat'],
      specialties: ['中高齡肌力訓練', '動作控制訓練', '皮拉提斯訓練'],
    },
    {
      id: 'nj-7',
      name: '李昆穆',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/nanjing/li-kunmu.png',
      education: ['輔仁大學物理治療學系'],
      experiences: ['區域醫院 物理治療師', '長照機構 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'FMS Level 1 功能性動作篩檢'],
      specialties: ['中高齡肌力訓練', '長照族群訓練', '平衡與步態訓練'],
    },
    {
      id: 'nj-8',
      name: '楊宛珧',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/nanjing/yang-wanyao.png',
      education: ['國立成功大學物理治療學系'],
      experiences: ['醫學中心 物理治療師', '骨科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'Stott Pilates Mat', 'Stott Pilates Reformer'],
      specialties: ['中高齡肌力訓練', '皮拉提斯訓練', '女性健康訓練'],
    },
    {
      id: 'nj-9',
      name: '王韻婷',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/nanjing/wang-yunting.png',
      education: ['國立台灣大學物理治療學系'],
      experiences: ['台大醫院 物理治療師', '復健科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'GYROKINESIS® Level 1'],
      specialties: ['中高齡肌力訓練', '動作控制訓練', 'GYROKINESIS® 訓練'],
    },
    {
      id: 'nj-10',
      name: '劉心維',
      roleTitle: '教練',
      photo: '/images/coaches/nanjing/liu-xinwei.png',
      education: ['國立體育大學運動科學研究所'],
      experiences: ['健身中心 私人教練', '企業健康講座 講師'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'AFAA WT 重量訓練指導員', 'TRX STC 懸吊訓練認證'],
      specialties: ['中高齡肌力訓練', '體態雕塑', '功能性訓練'],
    },
    {
      id: 'nj-11',
      name: '王文郁',
      roleTitle: '教練',
      photo: '/images/coaches/nanjing/wang-wenyu.png',
      education: ['國立台灣師範大學體育學系'],
      experiences: ['健身中心 私人教練', '運動中心 團課教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'AFAA WT 重量訓練指導員', 'AFAA MAT 墊上核心認證'],
      specialties: ['中高齡肌力訓練', '核心訓練', '體態調整'],
    },
    {
      id: 'nj-12',
      name: '李才昇',
      roleTitle: '教練',
      photo: '/images/coaches/nanjing/li-caisheng.png',
      education: ['國立體育大學競技運動學系'],
      experiences: ['健身中心 私人教練', '運動員體能訓練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'NSCA-CPT 美國國家肌力與體能協會私人教練'],
      specialties: ['中高齡肌力訓練', '運動表現訓練', '爆發力訓練'],
    },
    {
      id: 'nj-13',
      name: '蔡秉杰',
      roleTitle: '教練',
      photo: '/images/coaches/nanjing/cai-bingjie.png',
      education: ['國立體育大學休閒產業經營學系'],
      experiences: ['健身中心 私人教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'AFAA WT 重量訓練指導員'],
      specialties: ['中高齡肌力訓練', '體態雕塑', '減脂訓練'],
    },
    {
      id: 'nj-14',
      name: '沈思彤',
      roleTitle: '教練',
      photo: '/images/coaches/nanjing/shen-sitong.png',
      education: ['國立台北教育大學體育學系'],
      experiences: ['健身中心 私人教練', '瑜珈工作室 瑜珈老師'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'RYT-200 瑜珈師資認證', 'AFAA MAT 墊上核心認證'],
      specialties: ['中高齡肌力訓練', '瑜珈課程', '柔軟度訓練'],
    },
  ],
  songjiang: [
    {
      id: 'sj-1',
      name: '王均佑',
      roleTitle: '店主管・物理治療師・教練',
      photo: '/images/coaches/songjiang/wang-junyou.jpg',
      education: ['高雄醫學大學物理治療學系'],
      experiences: ['松江店 店主管', '練健康教練培訓講師', '高雄榮民總醫院 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'FMS Level 1 功能性動作篩檢', 'SFMA 動作評估系統', 'DNS A Course'],
      specialties: ['動作優化訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'],
    },
    {
      id: 'sj-2',
      name: '劉育銘',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/songjiang/liu-yuming.jpg',
      education: ['長庚大學物理治療學系'],
      experiences: ['林口長庚醫院 物理治療師', '骨科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'FMS Level 1 功能性動作篩檢', 'NASM-CES 矯正性運動訓練專家'],
      specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '姿勢矯正訓練'],
    },
    {
      id: 'sj-3',
      name: '徐睿揚',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/songjiang/xu-ruiyang.jpg',
      education: ['國立陽明交通大學物理治療暨輔助科技學系'],
      experiences: ['台北榮民總醫院 物理治療師', '復健科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'FMS Level 1 功能性動作篩檢', 'DNS A Course'],
      specialties: ['中高齡肌力訓練', '神經系統疾患訓練', '平衡訓練'],
    },
    {
      id: 'sj-4',
      name: '陳重光',
      roleTitle: '教練',
      photo: '/images/coaches/songjiang/chen-zhongguang.jpg',
      education: ['國立體育大學競技運動學系'],
      experiences: ['健身中心 私人教練', '運動中心 體適能教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'NSCA-CPT 美國國家肌力與體能協會私人教練', 'TRX STC 懸吊訓練認證'],
      specialties: ['中高齡肌力訓練', '功能性訓練', '運動表現訓練'],
    },
    {
      id: 'sj-5',
      name: '張承玴',
      roleTitle: '教練',
      photo: '/images/coaches/songjiang/zhang-chengxi.jpg',
      education: ['國立台灣師範大學運動競技學系'],
      experiences: ['健身中心 私人教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'AFAA WT 重量訓練指導員', 'KBC 壺鈴教練認證'],
      specialties: ['中高齡肌力訓練', '壺鈴訓練', '體態雕塑'],
    },
  ],
  ximending: [
    {
      id: 'xm-1',
      name: '陳亮宇',
      roleTitle: '店主管・物理治療師・教練',
      photo: '/images/coaches/ximending/chen-liangyu.png',
      education: ['國立陽明交通大學物理治療暨輔助科技學系'],
      experiences: ['西門店 店主管', '練健康教練培訓講師', '台北市立聯合醫院 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'NSCA-CPT 美國國家肌力與體能協會私人教練', 'FMS Level 1 功能性動作篩檢'],
      specialties: ['動作優化訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'],
    },
    {
      id: 'xm-2',
      name: '林亞儒',
      roleTitle: '副店主管・物理治療師・教練',
      photo: '/images/coaches/ximending/lin-yaru.png',
      education: ['長庚大學物理治療學系'],
      experiences: ['西門店 副店主管', '練健康教練培訓講師', '林口長庚醫院 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'Stott Pilates Mat', 'Stott Pilates Reformer'],
      specialties: ['中高齡肌力訓練', '皮拉提斯訓練', '女性健康訓練'],
    },
    {
      id: 'xm-3',
      name: '趙世剛',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/ximending/zhao-shigang.png',
      education: ['中山醫學大學物理治療學系'],
      experiences: ['台中榮民總醫院 物理治療師', '骨科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'NASM-CES 矯正性運動訓練專家'],
      specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '姿勢矯正訓練'],
    },
    {
      id: 'xm-4',
      name: '吳貫宇',
      roleTitle: '呼吸治療師・教練',
      photo: '/images/coaches/ximending/wu-guanyu.png',
      education: ['長庚大學呼吸治療學系'],
      experiences: ['彰化基督教醫院 呼吸治療師', '胸腔內科診所 呼吸治療師'],
      certifications: ['呼吸治療師證照', 'ACE-CPT 美國運動協會私人教練', 'FMS Level 1 功能性動作篩檢'],
      specialties: ['中高齡肌力訓練', '心肺功能訓練', '術後族群訓練'],
    },
    {
      id: 'xm-5',
      name: '鍾緯沛',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/ximending/zhong-weipei.png',
      education: ['國立成功大學物理治療學系'],
      experiences: ['成大醫院 物理治療師', '復健科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'Stott Pilates Mat'],
      specialties: ['中高齡肌力訓練', '皮拉提斯訓練', '動作控制訓練'],
    },
    {
      id: 'xm-6',
      name: '范瑞瑜',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/ximending/fan-ruiyu.jpg',
      education: ['高雄醫學大學物理治療學系'],
      experiences: ['高雄長庚醫院 物理治療師', '骨科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'FMS Level 1 功能性動作篩檢'],
      specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '平衡訓練'],
    },
    {
      id: 'xm-7',
      name: '陳品瀚',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/ximending/chen-pinhan.png',
      education: ['輔仁大學物理治療學系'],
      experiences: ['台北馬偕醫院 物理治療師', '復健科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'DNS A Course'],
      specialties: ['中高齡肌力訓練', '動作控制訓練', '核心穩定訓練'],
    },
    {
      id: 'xm-8',
      name: '朱兆煜',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/ximending/zhu-zhaoyu.png',
      education: ['國立台灣大學物理治療學系'],
      experiences: ['台大醫院 物理治療師', '骨科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'SFMA 動作評估系統'],
      specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '動作優化訓練'],
    },
    {
      id: 'xm-9',
      name: '陳詠佑',
      roleTitle: '物理治療師・教練',
      photo: '/images/coaches/ximending/chen-yongyou.png',
      education: ['中山醫學大學物理治療學系'],
      experiences: ['台中榮民總醫院 物理治療師', '復健科診所 物理治療師'],
      certifications: ['物理治療師證照', 'ACE-CPT 美國運動協會私人教練', 'FMS Level 1 功能性動作篩檢'],
      specialties: ['中高齡肌力訓練', '神經系統疾患訓練', '平衡與步態訓練'],
    },
    {
      id: 'xm-10',
      name: '許雅淇',
      roleTitle: '教練',
      photo: '/images/coaches/ximending/xu-yaqi.png',
      education: ['國立體育大學休閒產業經營學系'],
      experiences: ['健身中心 私人教練', '運動中心 團課教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'AFAA WT 重量訓練指導員', 'AFAA MAT 墊上核心認證'],
      specialties: ['中高齡肌力訓練', '核心訓練', '體態雕塑'],
    },
    {
      id: 'xm-11',
      name: '林哲玄',
      roleTitle: '教練',
      photo: '/images/coaches/ximending/lin-zhexuan.png',
      education: ['國立台灣師範大學體育學系'],
      experiences: ['健身中心 私人教練', '運動表現訓練中心 教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'NSCA-CPT 美國國家肌力與體能協會私人教練', 'TRX STC 懸吊訓練認證'],
      specialties: ['中高齡肌力訓練', '功能性訓練', '運動表現訓練'],
    },
    {
      id: 'xm-12',
      name: '邱子豪',
      roleTitle: '教練',
      photo: '/images/coaches/ximending/qiu-zihao.png',
      education: ['國立體育大學競技運動學系'],
      experiences: ['健身中心 私人教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'AFAA WT 重量訓練指導員', 'KBC 壺鈴教練認證'],
      specialties: ['中高齡肌力訓練', '壺鈴訓練', '體態雕塑'],
    },
    {
      id: 'xm-13',
      name: '陳泊維',
      roleTitle: '教練',
      photo: '/images/coaches/ximending/chen-bowei.png',
      education: ['國立台北教育大學體育學系'],
      experiences: ['健身中心 私人教練', '運動中心 體適能教練'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'AFAA WT 重量訓練指導員'],
      specialties: ['中高齡肌力訓練', '功能性訓練', '減脂訓練'],
    },
    {
      id: 'xm-14',
      name: '林誌楷',
      roleTitle: '教練',
      photo: '/images/coaches/ximending/lin-zhikai.png',
      education: ['國立體育大學運動科學研究所'],
      experiences: ['健身中心 私人教練', '企業健康講座 講師'],
      certifications: ['ACE-CPT 美國運動協會私人教練', 'NSCA-CPT 美國國家肌力與體能協會私人教練', 'TRX STC 懸吊訓練認證'],
      specialties: ['中高齡肌力訓練', '運動表現訓練', '懸吊訓練'],
    },
  ],
}

// 將所有教練資料轉換為統一格式
const coaches = (() => {
  const allCoaches: any[] = []
  Object.entries(coachesByStore).forEach(([storeSlug, storeCoaches]) => {
    storeCoaches.forEach((coach) => {
      allCoaches.push({
        id: coach.id,
        name: coach.name,
        slug: coach.id,
        title: coach.roleTitle || '',
        store: storeNames[storeSlug] || '',
        storeSlug: storeSlug,
        specialties: coach.specialties || [],
        certifications: coach.certifications || [],
        description: '',
        photo: coach.photo,
      })
    })
  })
  return allCoaches
})()
</script>

<template>
  <div class="min-h-screen bg-cream">
    <!-- Hero Section -->
    <section class="relative bg-navy pt-16 overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(251,114,10,0.10)_0%,transparent_55%),radial-gradient(circle_at_5%_75%,rgba(58,106,133,0.3)_0%,transparent_45%)]" />
        <div
          class="absolute inset-0 opacity-[0.022]"
          :style="{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }"
        />
      </div>

      <div class="container mx-auto px-4 relative z-10 py-16 lg:py-24 text-center">
        <nav class="flex items-center justify-center gap-1.5 text-xs text-white/35 mb-6">
          <NuxtLink to="/" class="hover:text-white/70 transition-colors">練健康</NuxtLink>
          <span class="text-white/20">›</span>
          <NuxtLink to="/team-intro" class="hover:text-white/70 transition-colors">團隊介紹</NuxtLink>
          <span class="text-white/20">›</span>
          <span>全體教練</span>
        </nav>

        <div class="inline-flex items-center bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          物理治療背景專業教練
        </div>

        <h1 class="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          全體<span class="text-orange">教練</span>
        </h1>

        <p class="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto">
          每位教練都有物理治療師或醫療專業背景，專精於中高齡與特殊族群訓練，讓您在安全的環境下達到最佳訓練效果。
        </p>
      </div>
    </section>

    <!-- Store Filter -->
    <section class="border-b border-cream-200 sticky top-16 bg-cream z-10">
      <div class="container mx-auto px-4">
        <div class="flex gap-2 py-4 overflow-x-auto">
          <NuxtLink
            to="/team-intro/coaches"
            class="px-4 py-2 rounded-full whitespace-nowrap bg-orange text-white"
          >
            全部
          </NuxtLink>
          <NuxtLink
            v-for="store in stores"
            :key="store.slug"
            :to="`/locations/${store.slug}`"
            class="px-4 py-2 rounded-full whitespace-nowrap bg-cream-200 text-ink hover:bg-cream-300 transition-colors"
          >
            {{ store.name }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Coaches Grid -->
    <section class="py-12 lg:py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="coach in coaches"
            :key="coach.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-navy/10"
          >
            <!-- Coach Image -->
            <div class="aspect-square relative bg-cream-200">
              <img
                v-if="coach.photo"
                :src="coach.photo"
                :alt="coach.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy to-navy/80">
                <span class="font-serif text-6xl font-black text-white/20">{{ coach.name.charAt(0) }}</span>
              </div>
              <!-- Store badge -->
              <div
                v-if="coach.store"
                class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-medium text-navy px-3 py-1 rounded-full"
              >
                {{ coach.store }}
              </div>
            </div>

            <!-- Coach Info -->
            <div class="p-6">
              <div class="mb-3">
                <h2 class="text-xl font-bold text-navy font-serif">{{ coach.name }}</h2>
                <p class="text-orange font-semibold">{{ coach.title }}</p>
              </div>

              <!-- Specialties -->
              <div v-if="coach.specialties.length > 0" class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="specialty in coach.specialties.slice(0, 3)"
                  :key="specialty"
                  class="px-3 py-1 bg-orange/10 text-orange text-xs rounded-full"
                >
                  {{ specialty }}
                </span>
              </div>

              <!-- Certifications -->
              <div v-if="coach.certifications.length > 0" class="pt-4 border-t border-cream-200">
                <p class="text-xs text-ink/40 mb-2">專業認證</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="cert in coach.certifications.slice(0, 2)"
                    :key="cert"
                    class="text-xs text-ink/60"
                  >
                    {{ cert }}
                  </span>
                  <span v-if="coach.certifications.length > 2" class="text-xs text-ink/40">
                    +{{ coach.certifications.length - 2 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-orange py-16 lg:py-20 text-center">
      <div class="container mx-auto px-4">
        <h2 class="font-serif text-3xl lg:text-4xl font-black text-white mb-3">
          找到適合您的教練了嗎？
        </h2>
        <p class="text-white/80 mb-8 max-w-md mx-auto">
          預約免費體驗，讓專業教練為您評估並制定訓練計畫。50歲以上首次體驗完全免費。
        </p>
        <NuxtLink
          to="/booking"
          class="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          立即預約體驗 →
        </NuxtLink>
        <div class="mt-4 text-white/60 text-sm">
          50歲以上完全免費・不強迫買課
        </div>
      </div>
    </section>
  </div>
</template>
