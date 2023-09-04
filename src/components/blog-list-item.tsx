/** @jsx jsx */
import React from "react"
import { jsx, Link as TLink } from "theme-ui"
import { Box } from "@theme-ui/components"
import { Link } from "gatsby"
import ItemTags from "./item-tags"

type BlogListItemProps = {
  post: {
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
  }
  showTags?: boolean
}

const BlogListItem = ({ post, showTags = true }: BlogListItemProps) => (
  <Box mb={4}>
    <TLink as={Link} to={post.slug} sx={{ color: `text` }}>
      <p sx={{ fontSize: [1, 2, 3], color: `text`, mb: 1, fontWeight: `500` }}>
        {post.title}
      </p>
    </TLink>
    <p sx={{ color: `secondary`, fontSize: [1, 1, 2], m: 0, mb: 1, fontWeight: `500` }}>
      {post.description}
    </p>
    <p sx={{ color: `secondary`, fontSize: [1, 1, 1], m: 0 }}>
      <time>{post.date}</time>
      {post.tags && showTags && (
        <React.Fragment>
          {` — `}
          <ItemTags tags={post.tags} />
        </React.Fragment>
      )}
    </p>
  </Box>
)

export default BlogListItem
