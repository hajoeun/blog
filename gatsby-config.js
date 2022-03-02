require(`dotenv`).config({
  path: `.env`,
})

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

module.exports = {
  siteMetadata: {
    siteTitle: `하조은의 블로그`,
    siteTitleAlt: `하조은의 블로그`,
    siteHeadline: `하조은의 블로그`,
    siteUrl: `https://hajoeun.blog/`,
    siteImage: `/site-image.png`,
    siteLanguage: `ko`,
    siteDescription: `소프트웨어 개발자 하조은이 배우고 느낀 점을 기록하는 공간`,
    author: `@hajoeun`
  },
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-minimal-blog`,
      options: {
        blogPath: `/posts`,
        navigation: [
          {
            title: `About`,
            slug: `/about`,
          },
          {
            title: `Posts`,
            slug: `/posts`,
          },
          {
            title: `Tags`,
            slug: `/tags`
          }
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
        feedTitle: `하조은의 블로그`,
        formatString: 'YYYY.MM.DD',
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [ process.env.GOOGLE_ANALYTICS_ID ],
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `소프트웨어 개발자 하조은의 블로그`,
        short_name: `하조은의 블로그`,
        description: `소프트웨어 개발자 하조은이 배우고 느낀 점을 기록하는 공간`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
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
    `gatsby-plugin-netlify-cms`
  ].filter(Boolean),
}
