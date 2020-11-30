require(`dotenv`).config({
  path: `.env`,
})

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

module.exports = {
  siteMetadata: {
    siteTitle: `Joeun`,
    siteTitleAlt: `Joeun Blog`,
    siteHeadline: `Joeun Blog - joeun.dev`,
    siteUrl: `https://joeun.dev`,
    siteImage: `/site-image.png`,
    siteLanguage: `ko`,
    siteDescription: `스타트업, 개발자, 블로그, 하조은, 소프트웨어, 엔지니어, blog, developer, engineer, joeun, joeun.dev`,
    author: `@joeunha`
  },
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-minimal-blog`,
      options: {
        navigation: [
          {
            title: `Blog`,
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
            url: `https://github.com/joeunha`,
          },
          {
            name: `Facebook`,
            url: `https://www.facebook.com/joeun.dev`,
          },
        ],
        feed: true,
        feedTitle: `Joeun Blog - joeun.dev`,
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
        name: `Joeun Blog`,
        short_name: `joeun-blog`,
        description: `스타트업, 개발자, 블로그, 하조은, 소프트웨어, 엔지니어, blog, developer, engineer, joeun, joeun.dev`,
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
