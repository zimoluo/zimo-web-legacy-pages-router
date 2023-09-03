type ProjectData = {
  title: string;
  description: string;
  links: { [key: string]: string };
  date: string;
  authors: string[];
  slug: string;
  faviconFormat: string;
  content: string;
  images: ImagesData;
}
  
export default ProjectData
  