require(`dotenv`).config({
  path: `.env`,
})

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

module.exports = {
  siteMetadata: {
    siteTitle: `하조은의 개발 블로그`,
    siteTitleAlt: `하조은의 개발 블로그`,
    siteHeadline: `하조은의 개발 블로그`,
    siteUrl: `https://hajoeun.blog/`,
    siteImage: `/site-image.png`,
    siteLanguage: `ko`,
    siteDescription: `스타트업, 개발자, 블로그, 하조은, 소프트웨어, 엔지니어, blog, developer, engineer, hajoeun, joeun`,
    author: `@hajoeun`
  },
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-minimal-blog`,
      options: {
        navigation: [
          {
            title: `Posts`,
            slug: `/blog`,
          },
          {
            title: `About`,
            slug: `/about`,
          },
        ],
        externalLinks: [
          {
            name: `Github`,
            url: `https://github.com/hajoeun`,
          },
          {
            name: `Facebook`,
            url: `https://www.facebook.com/hajoeun`,
          },
        ],
        feed: true,
        feedTitle: `하조은의 개발 블로그`,
        formatString: 'YYYY.MM.DD',
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID,
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `하조은의 개발 블로그`,
        short_name: `하조은의 개발 블로그`,
        description: `스타트업, 개발자, 블로그, 하조은, 소프트웨어, 엔지니어, blog, developer, engineer, hajoeun, hajoeun.blog`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#6B46C1`,
        display: `standalone`,
        icons: [
          {
            src: `/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-netlify`,
    shouldAnalyseBundle && {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        analyzerMode: `static`,
        reportFilename: `_bundle.html`,
        openAnalyzer: false,
      },
    },
  ].filter(Boolean),
}
