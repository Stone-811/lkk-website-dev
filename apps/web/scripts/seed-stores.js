/**
 * Seed Stores to Firestore
 *
 * Usage: node scripts/seed-stores.js
 *
 * Note: This script requires Firebase Admin SDK credentials.
 * Set GOOGLE_APPLICATION_CREDENTIALS environment variable to your service account key path,
 * or run this in Firebase App Hosting environment where ADC is available.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'lkk-website-dev',
  });
}

const db = admin.firestore();

// Store data from static homepage
const stores = [
  {
    slug: 'nanjing',
    name: '南京店',
    city: '台北市',
    district: '中山區',
    address: '台北市中山區南京東路三段 29 號 B1',
    phone: '(02) 2507-4196',
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區南京東路三段29號B1',
    businessHours: '週一至週六 09:00-21:00',
    transportation: '捷運南京復興站 步行3分鐘',
    images: [],
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: 'songjiang',
    name: '松江店',
    city: '台北市',
    district: '中山區',
    address: '台北市中山區松江路 122 號 B1',
    phone: '(02) 2562-6788',
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區松江路122號B1',
    businessHours: '週一至週六 09:00-21:00',
    transportation: '捷運松江南京站 步行2分鐘',
    images: [],
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: 'ximending',
    name: '西門店',
    city: '台北市',
    district: '中正區',
    address: '台北市中正區寶慶路 39 號',
    phone: '(02) 2370-3245',
    googleMapUrl: 'https://maps.google.com/?q=台北市中正區寶慶路39號',
    businessHours: '週一至週六 09:00-21:00',
    transportation: '捷運西門站 步行5分鐘',
    images: [],
    sortOrder: 3,
    isActive: true,
  },
  {
    slug: 'xindian',
    name: '新店七張店',
    city: '新北市',
    district: '新店區',
    address: '新北市新店區北新路二段 252 號 B1-2',
    phone: '(02) 8914-6428',
    googleMapUrl: 'https://maps.google.com/?q=新北市新店區北新路二段252號B1-2',
    businessHours: '週一至週六 09:00-21:00',
    transportation: '捷運七張站 步行1分鐘',
    images: [],
    sortOrder: 4,
    isActive: true,
  },
];

async function seedStores() {
  console.log('Starting to seed stores...\n');

  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();

  for (const store of stores) {
    // Check if store already exists by slug
    const existingQuery = await db
      .collection('stores')
      .where('slug', '==', store.slug)
      .limit(1)
      .get();

    if (!existingQuery.empty) {
      console.log(`Store "${store.name}" (${store.slug}) already exists, skipping...`);
      continue;
    }

    const docRef = db.collection('stores').doc();
    batch.set(docRef, {
      ...store,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Adding store: ${store.name} (${store.slug})`);
  }

  await batch.commit();
  console.log('\nStores seeded successfully!');
}

seedStores()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding stores:', error);
    process.exit(1);
  });
