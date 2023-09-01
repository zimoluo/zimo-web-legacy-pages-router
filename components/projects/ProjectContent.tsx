import markdownStyles from './projects-markdown-styles.module.css'

type Props = {
  content: string
}

const ProjectContent = ({ content }: Props) => {
  return (
    <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
  )
}

export default ProjectContent
