const createNextIntlPlugin = require('next-intl/plugin');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-js-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-style-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-data',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/api\/public\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'others',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const withNextIntl = createNextIntlPlugin();

// WordPress backend URL (internal)
const WORDPRESS_BACKEND_URL = process.env.WORDPRESS_BACKEND_URL || 'https://wp-backend.l-kk.tw';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp-backend.l-kk.tw',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'l-kk.tw',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  // WordPress proxy rewrites
  async rewrites() {
    return [
      // WordPress article paths
      {
        source: '/知識分享/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/知識分享/:path*`,
      },
      {
        source: '/案例分享/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/案例分享/:path*`,
      },
      {
        source: '/新聞報導/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/新聞報導/:path*`,
      },
      {
        source: '/活動資訊/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/活動資訊/:path*`,
      },
      {
        source: '/category/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/category/:path*`,
      },
      {
        source: '/tag/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/tag/:path*`,
      },
      // WordPress system paths
      {
        source: '/wp-admin/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/wp-admin/:path*`,
      },
      {
        source: '/wp-content/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/wp-content/:path*`,
      },
      {
        source: '/wp-includes/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/wp-includes/:path*`,
      },
      {
        source: '/wp-json/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/wp-json/:path*`,
      },
      {
        source: '/wp-login.php',
        destination: `${WORDPRESS_BACKEND_URL}/wp-login.php`,
      },
      {
        source: '/xmlrpc.php',
        destination: `${WORDPRESS_BACKEND_URL}/xmlrpc.php`,
      },
      // WordPress feed
      {
        source: '/feed/:path*',
        destination: `${WORDPRESS_BACKEND_URL}/feed/:path*`,
      },
    ];
  },

  // Redirects for old URLs
  async redirects() {
    return [
      // Example: redirect old booking page
      {
        source: '/bodytest',
        destination: '/booking',
        permanent: true,
      },
      {
        source: '/bodytest/',
        destination: '/booking',
        permanent: true,
      },
    ];
  },
};

module.exports = withPWA(withNextIntl(nextConfig));
