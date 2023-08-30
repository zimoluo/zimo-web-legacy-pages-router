import markdownStyles from './markdown-styles.module.css'

type BlogContentProps = {
  content: string
}

const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
  )
}

export default BlogContent
