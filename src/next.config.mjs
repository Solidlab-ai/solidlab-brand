const config = {
  async rewrites() {
    return {
      beforeFiles: [
        // Root → public/index.html
        { source: '/', destination: '/index.html' },
        // /preview/foo → /preview/foo.html (cleanUrls)
        { source: '/preview/:slug', destination: '/preview/:slug.html' },
        // /slides → /slides/index.html
        { source: '/slides', destination: '/slides/index.html' },
        { source: '/slides/', destination: '/slides/index.html' },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/:path*.css',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default config;
