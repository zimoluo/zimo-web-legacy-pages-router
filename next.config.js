/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.imgur.com', 'upload.wikimedia.org', 'img0.baidu.com', 'onedrive.live.com', 'miro.medium.com', 'cdn.luogu.com.cn'],
  },
}

module.exports = nextConfig
