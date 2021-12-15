const isProd = (process.env.NODE_ENV || 'production') === 'production'

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com','raw.githubusercontent.com'],
  },

}
