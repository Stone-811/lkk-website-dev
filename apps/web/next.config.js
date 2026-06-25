const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

// WordPress backend URL (internal)
const WORDPRESS_BACKEND_URL = process.env.WORDPRESS_BACKEND_URL || 'https://wp-backend.l-kk.tw';

/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = withNextIntl(nextConfig);
