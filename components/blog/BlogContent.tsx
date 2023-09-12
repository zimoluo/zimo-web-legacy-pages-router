import { useSettings } from '../contexts/SettingsContext';
import markdownStyles from './blog-markdown-styles.module.css'

type BlogContentProps = {
  content: string
}

const BlogContent = ({ content }: BlogContentProps) => {
  const { settings } = useSettings();
  
  return (
    <div
        className={`${markdownStyles['markdown']} ${!settings.disableSerifFont ? markdownStyles['markdown-serif'] : ''}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
  )
}

export default BlogContent
