/** @jsx jsx */
import { Link } from "gatsby"
import { jsx } from "theme-ui"
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config"
// @ts-ignore
import Bottom from "../texts/bottom"
// @ts-ignore
import Hero from "../texts/hero"
import replaceSlashes from "../utils/replaceSlashes"
import Layout from "./layout"
import List from "./list"
import Listing from "./listing"
import Title from "./title"

type PostsProps = {
  posts: {
    slug: string
    title: string
    date: string
    excerpt: string
    description: string
    timeToRead?: number
    tags?: {
      name: string
      slug: string
    }[]
  }[]
}

const Homepage = ({ posts }: PostsProps) => {
  const { basePath, blogPath } = useMinimalBlogConfig()

  return (
    <Layout>
      <section sx={{ mb: 5, p: { fontSize: [1, 2, 3], mt: 2 } }}>
        <Hero />
      </section>
      <Title text="최근 글">
        <Link to={replaceSlashes(`/${basePath}/${blogPath}`)}>더보기</Link>
      </Title>
      <Listing posts={posts} showTags={false} />
      <List>
        <Bottom />
      </List>
    </Layout>
  )
}

export default Homepage
