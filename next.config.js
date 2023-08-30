/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.imgur.com', 'upload.wikimedia.org', 'img0.baidu.com', 'onedrive.live.com', 'miro.medium.com', 'cdn.luogu.com.cn', 'docs.aws.amazon.com', 'zimo-web-bucket.s3.us-east-2.amazonaws.com'],
  },
}

module.exports = nextConfig
