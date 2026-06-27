const admin = require('firebase-admin');

// Load env from apps/web/.env.local
require('dotenv').config({ path: './apps/web/.env.local' });

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const stores = [
  {
    slug: 'xindian',
    name: '新店七張店',
    city: '新北市',
    district: '新店區',
    address: '北新路二段 252 號 B1-2',
    phone: '(02) 8914-6428',
    googleMapUrl: 'https://maps.app.goo.gl/example1',
    businessHours: JSON.stringify({ weekday: '10:00 - 22:00', weekend: '09:00 - 20:00' }),
    transportation: JSON.stringify({
      mrt: { station: '新店七張站 1 號出口', desc: '出站後沿北新路方向直行約 3 分鐘' },
      bus: { stop: '七張站', desc: '849、綠12、綠14、橘12' },
      car: { desc: '沿北新路往新店方向，過捷運站後右側' },
      parking: { desc: '七張捷運站旁有公共停車場，步行約 2 分鐘' },
    }),
    images: [],
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: 'nanjing',
    name: '南京店',
    city: '台北市',
    district: '中山區',
    address: '南京東路三段 29 號 B1',
    phone: '(02) 2507-4196',
    googleMapUrl: 'https://maps.app.goo.gl/example2',
    businessHours: JSON.stringify({ weekday: '10:00 - 22:00', weekend: '09:00 - 20:00' }),
    transportation: JSON.stringify({
      mrt: { station: '南京復興站 2 號出口', desc: '出站後步行約 5 分鐘' },
      bus: { stop: '南京復興路口', desc: '275、292、306' },
      car: { desc: '南京東路三段，近復興北路口' },
      parking: { desc: '附近有嘟嘟房停車場' },
    }),
    images: [],
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: 'songjiang',
    name: '松江店',
    city: '台北市',
    district: '中山區',
    address: '松江路 122 號 B1',
    phone: '(02) 2537-1055',
    googleMapUrl: 'https://maps.app.goo.gl/example3',
    businessHours: JSON.stringify({ weekday: '10:00 - 22:00', weekend: '09:00 - 20:00' }),
    transportation: JSON.stringify({
      mrt: { station: '松江南京站 7 號出口', desc: '出站後步行約 3 分鐘' },
      bus: { stop: '松江南京路口', desc: '12、46、266' },
      car: { desc: '松江路近南京東路口' },
      parking: { desc: '松江路沿線有路邊停車格' },
    }),
    images: [],
    sortOrder: 3,
    isActive: true,
  },
  {
    slug: 'ximending',
    name: '西門店',
    city: '台北市',
    district: '中正區',
    address: '寶慶路 39 號',
    phone: '(02) 2370-3245',
    googleMapUrl: 'https://maps.app.goo.gl/example4',
    businessHours: JSON.stringify({ weekday: '10:00 - 22:00', weekend: '09:00 - 20:00' }),
    transportation: JSON.stringify({
      mrt: { station: '西門站 4 號出口', desc: '出站後步行約 5 分鐘' },
      bus: { stop: '西門市場', desc: '18、252、262' },
      car: { desc: '寶慶路近中華路口' },
      parking: { desc: '獅子林停車場，步行約 3 分鐘' },
    }),
    images: [],
    sortOrder: 4,
    isActive: true,
  },
];

async function seedStores() {
  const now = admin.firestore.Timestamp.now();

  for (const store of stores) {
    // Check if store with same slug exists
    const existing = await db.collection('stores').where('slug', '==', store.slug).limit(1).get();

    if (!existing.empty) {
      console.log(`Store "${store.name}" already exists, skipping...`);
      continue;
    }

    const docRef = db.collection('stores').doc();
    await docRef.set({
      ...store,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Created store: ${store.name}`);
  }

  console.log('Done!');
  process.exit(0);
}

seedStores().catch(console.error);
