/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/auth/login",
        destination: "/api/auth/signin",
        permanent: true,
      },
      {
        source: "/auth/logout",
        destination: "/api/auth/signout",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
