import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: process.env.SITE_DOMAIN_LIST.split(','),
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default bundleAnalyzer(nextConfig)
