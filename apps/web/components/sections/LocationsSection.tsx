import Link from 'next/link';

const stores = [
  {
    id: 'nanjing',
    num: 1,
    name: '南京店',
    address: '台北市中山區南京東路三段 29 號 B1',
    phone: '(02) 2507-4196',
  },
  {
    id: 'songjiang',
    num: 2,
    name: '松江店',
    address: '台北市中山區松江路 122 號 B1',
    phone: '(02) 2537-1055',
  },
  {
    id: 'ximending',
    num: 3,
    name: '西門店',
    address: '台北市中正區寶慶路 39 號',
    phone: '(02) 2370-3245',
  },
  {
    id: 'xindian',
    num: 4,
    name: '新店七張店',
    address: '新北市新店區北新路二段 252 號 B1-2',
    phone: '(02) 8914-6428',
  },
];

export default function LocationsSection() {
  return (
    <section className="bg-cream-100 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          分店資訊
        </div>
        <h2 className="font-serif text-3xl lg:text-4xl font-black text-navy-700 mb-10">
          台北・新北，<span className="text-orange">找到離你最近</span>的門店
        </h2>

        {/* Stores grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/locations/${store.id}`}
              className="bg-white border border-navy-700/15 rounded-2xl p-5 hover:border-navy-700/30 hover:shadow-lg transition-all"
            >
              {/* Number badge */}
              <div className="w-8 h-8 rounded-full bg-navy-700 text-white text-sm font-bold flex items-center justify-center mb-3">
                {store.num}
              </div>

              {/* Store name */}
              <h3 className="font-serif text-lg font-bold text-navy-700 mb-1">
                {store.name}
              </h3>

              {/* Address */}
              <p className="text-sm text-ink/50 leading-relaxed mb-2">
                {store.address}
              </p>

              {/* Phone */}
              <p className="text-sm text-navy-700 font-medium">
                {store.phone}
              </p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-navy-700 border border-navy-700/15 px-6 py-2.5 rounded-full hover:border-navy-700 transition-colors"
          >
            查看練健康分店 →
          </Link>
        </div>
      </div>
    </section>
  );
}
