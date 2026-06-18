/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://stacklogs.net',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
}
