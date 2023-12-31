import { rgbDataURL } from "@/lib/util";

export type ThemeType = "zimo" | "photos" | "blog" | "projects" | "about";

// Map for dynamic favicon
export const faviconMap: { [key: string]: string } = {
  zimo: "/zimo-favicon.svg",
  photos: "/photos-zimo.svg",
  blog: "/blog-zimo.svg",
  projects: "/projects-zimo.svg",
  about: "/favicon.svg",
};

export const websiteFaviconDirectory: { [key: string]: string } = {
  zimo: "/website-favicon/generic",
  photos: "/website-favicon/photos",
  blog: "/website-favicon/blog",
  projects: "/website-favicon/projects",
  about: "/website-favicon/generic",
};

// Map for dynamic bar color
export const barColorMap: { [key: string]: string } = {
  zimo: "bar-color-zimo",
  photos: "bar-color-photos",
  blog: "bar-color-blog",
  projects: "bar-color-projects",
  about: "bar-color-about",
};

export const sliderColorMap: { [key: string]: string } = {
  zimo: "bg-neutral-200",
  photos: "bg-orange-200",
  blog: "bg-fuchsia-200",
  projects: "bg-teal-200",
  about: "bg-sky-200",
};

export const sliderButtonColorMap: { [key: string]: string } = {
  zimo: "bg-neutral-50",
  photos: "bg-orange-50",
  blog: "bg-fuchsia-50",
  projects: "bg-teal-50",
  about: "bg-sky-50",
};

export const lightBgColorMap: { [key: string]: string } = {
  zimo: "bg-neutral-50",
  photos: "bg-orange-50",
  blog: "bg-fuchsia-50",
  projects: "bg-teal-50",
  about: "bg-color-about bg-cover bg-center",
};

export const hundredBgColorMap: { [key: string]: string } = {
  zimo: "bg-neutral-100",
  photos: "bg-orange-100",
  blog: "bg-fuchsia-100",
  projects: "bg-teal-100",
  about: "bg-sky-100",
};

export const slightlyDarkBgColorMap: { [key: string]: string } = {
  zimo: "bg-neutral-200",
  photos: "bg-orange-200",
  blog: "bg-fuchsia-200",
  projects: "bg-teal-200",
  about: "bg-color-about bg-cover bg-center",
};

export const progressBarBgColorMap: { [key: string]: string } = {
  zimo: "bg-neutral-300",
  photos: "bg-orange-300",
  blog: "bg-fuchsia-300",
  projects: "bg-teal-300",
  about: "bg-sky-300",
};

export const sliderBorderColorMap: { [key: string]: string } = {
  zimo: "border-neutral-300",
  photos: "border-orange-300",
  blog: "border-fuchsia-300",
  projects: "border-teal-300",
  about: "border-sky-300",
};

// Map for background blur
export const blurColorMap: { [key: string]: string } = {
  zimo: rgbDataURL(250, 250, 250),
  photos: rgbDataURL(255, 247, 237),
  blog: rgbDataURL(253, 244, 255),
  projects: rgbDataURL(240, 253, 250),
  about: rgbDataURL(255, 251, 228),
};

export const imageViewerPlaceholder: { [key: string]: string } = {
  zimo: rgbDataURL(245, 245, 245),
  photos: rgbDataURL(255, 237, 213),
  blog: rgbDataURL(250, 232, 255),
  projects: rgbDataURL(204, 251, 241),
  about: rgbDataURL(224, 242, 254),
};

export const siteThemeColorMap: { [key: string]: string } = {
  zimo: "#e5e5e5",
  photos: "#ffedd5",
  blog: "#f5d0fe",
  projects: "#ccfbf1",
  about: "#e0f2fe",
};

// Map for svg filter
export const svgFilterMap: { [key: string]: string } = {
  zimo: "zimo-svg-filter",
  photos: "photos-svg-filter",
  blog: "blog-svg-filter",
  projects: "projects-svg-filter",
  about: "about-svg-filter",
};

// Define a generic color map
export const genericColorMap: { [key: string]: string } = {
  zimo: "neutral-900",
  photos: "orange-900",
  blog: "fuchsia-900",
  projects: "teal-900",
  about: "sky-900",
};

// Create a text color map by prefixing 'text-' to generic colors
export const textColorMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(genericColorMap).map(([key, value]) => [key, `text-${value}`])
);

// Create a border color map by prefixing 'border-' to generic colors
export const borderColorMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(genericColorMap).map(([key, value]) => [
    key,
    `border-${value}`,
  ])
);

// Create a bg color map by prefixing 'bg-' to generic colors
export const bgDarkColorMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(genericColorMap).map(([key, value]) => [key, `bg-${value}`])
);

export const notchColorMap: { [key: string]: string } = {
  zimo: "bg-neutral-700",
  photos: "bg-orange-700",
  blog: "bg-fuchsia-700",
  projects: "bg-teal-700",
  about: "bg-sky-700",
};

// Map for the icon text
export const iconTextMap: { [key: string]: string } = {
  home: "Home",
  photos: "Album",
  blog: "Blog",
  projects: "Projects",
  about: "About",
  management: "Management",
};

export const topIconMap: { [key: string]: string } = {
  photos: "/photos-light.svg",
  blog: "/blog-light.svg",
  projects: "/projects-light.svg",
  about: "/about-light.svg",
};

export const backgroundImageMap: { [key: string]: string } = {
  zimo: "/zimo-bg-light-static.svg",
  photos: "/photos-pane.svg",
  blog: "/blog-pane.svg",
  projects: "/projects-pane.svg",
  about: "/about-pane-base.svg",
};

export const backgroundClassMap: { [key: string]: string } = {
  zimo: "bg-zimo-bg-light",
  photos: "bg-photos-bg-light",
  blog: "bg-blog-bg-light",
  projects: "bg-projects-bg-light",
  about: "bg-about-bg-light",
};

export const simpleTitleMap: { [key: string]: string } = {
  zimo: "Zimo Web",
  photos: "Album - Zimo Web",
  blog: "Blog - Zimo Web",
  projects: "Projects - Zimo Web",
  about: "About - Zimo Web",
};

export const imagesArrowMap: { [key: string]: string } = {
  projects: "/projects-arrow.svg",
  photos: "/photos-arrow.svg",
  blog: "/blog-arrow.svg",
};

export const menuEntryBorderMap: { [key: string]: string } = {
  zimo: "border-neutral-700",
  photos: "border-orange-700",
  blog: "border-fuchsia-700",
  projects: "border-teal-700",
  about: "border-sky-700",
};

export const lightTextColorMap: { [key: string]: string } = {
  zimo: "text-neutral-800",
  photos: "text-orange-800",
  blog: "text-fuchsia-800",
  projects: "text-teal-800",
  about: "text-sky-800",
};

export const placeholderTextColorMap: { [key: string]: string } = {
  zimo: "placeholder:text-neutral-700",
  photos: "placeholder:text-orange-700",
  blog: "placeholder:text-fuchsia-700",
  projects: "placeholder:text-teal-700",
  about: "placeholder:text-sky-700",
};

export const likeButtonEmptySrc: { [key: string]: string } = {
  zimo: "/thumbs-up.svg",
  photos: "/heart-icon.svg",
  blog: "/thumbs-up.svg",
  projects: "/star-empty.svg",
  about: "thumbs-up.svg",
};

export const likeButtonFilledSrc: { [key: string]: string } = {
  zimo: "/thumbs-up-filled.svg",
  photos: "/heart-icon-filled.svg",
  blog: "/thumbs-up-filled.svg",
  projects: "/star-filled.svg",
  about: "thumbs-up-filled.svg",
};

export const generalLikeEmptySrc: { [key: string]: string } = {
  zimo: "/thumbs-up.svg",
  photos: "/heart-icon-photos.svg",
  blog: "/thumbs-up-blog.svg",
  projects: "/star-empty-projects.svg",
  about: "/thumbs-up.svg",
};

export const generalLikeFilledSrc: { [key: string]: string } = {
  zimo: "/thumbs-up-filled.svg",
  photos: "/heart-icon-photos-filled.svg",
  blog: "/thumbs-up-blog-filled.svg",
  projects: "/star-filled-projects.svg",
  about: "/thumbs-up-filled.svg",
};
