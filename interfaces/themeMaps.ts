import { rgbDataURL } from "@/lib/util";

export type ThemeType = 'zimo' | 'photos' | 'blog' | 'projects' | 'about';

// Map for dynamic favicon
export const faviconMap: { [key: string]: string } = {
    "zimo": "/zimo-favicon.svg",
    "photos": "/photos-zimo.svg",
    "blog": "/blog-zimo.svg",
    "projects": "/projects-zimo.svg",
    "about": "/favicon.svg",
};

// Map for dynamic bar color
export const barColorMap: { [key: string]: string } = {
    "zimo": "bar-color-zimo",
    "photos": "bar-color-photos",
    "blog": "bar-color-blog",
    "projects": "bar-color-projects",
    "about": "bar-color-about",
};

// Map for background blur
export const blurColorMap: { [key: string]: string } = {
    "zimo": rgbDataURL(250, 250, 250),
    "photos": rgbDataURL(255, 247, 237),
    "blog": rgbDataURL(253, 244, 255),
    "projects": rgbDataURL(240, 253, 250),
    "about": rgbDataURL(255, 251, 228),
};

export const siteThemeColorMap: { [key: string]: string } = {
  "zimo": '#e5e5e5',
  "photos": '#ffedd5',
  "blog": '#f5d0fe',
  "projects": '#ccfbf1',
  "about": '#e0f2fe',
}

// Map for svg filter
export const svgFilterMap: { [key: string]: string } = {
    "zimo": "zimo-svg-filter",
    "photos": "photos-svg-filter",
    "blog": "blog-svg-filter",
    "projects": "projects-svg-filter",
    "about": "about-svg-filter",
};

// Define a generic color map
export const genericColorMap: { [key: string]: string } = {
  "zimo": "neutral-900",
  "photos": "orange-900",
  "blog": "fuchsia-900",
  "projects": "teal-900",
  "about": "sky-900",
};

// Create a text color map by prefixing 'text-' to generic colors
export const textColorMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(genericColorMap).map(([key, value]) => [key, `text-${value}`])
);

// Create a border color map by prefixing 'border-' to generic colors
export const borderColorMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(genericColorMap).map(([key, value]) => [key, `border-${value}`])
);

// Map for the icon text
export const iconTextMap: { [key: string]: string } = {
  'photos': 'Album',
  'blog': 'Blog',
  'projects': 'Projects',
  'about': 'About',
};

// Map for light icons
export const topIconMap: { [key: string]: string } = {
  'photos': '/photos-light.svg',
  'blog': '/blog-light.svg',
  'projects': '/projects-light.svg',
  'about': '/about-light.svg',
};

export const backgroundImageMap: { [key: string]: string } = {
  'zimo': '/zimo-bg-light-static.svg',
  'photos': '/photos-pane.svg',
  'blog': '/blog-pane.svg',
  'projects': '/projects-pane.svg',
  'about': '/about-pane-base.svg',
};

export const backgroundClassMap: { [key: string]: string } = {
  'zimo': 'bg-zimo-bg-light',
  'photos': 'bg-photos-bg-light',
  'blog': 'bg-blog-bg-light',
  'projects': 'bg-projects-bg-light',
  'about': 'bg-about-bg-light',
};

export const simpleTitleMap: { [key: string]: string } = {
  'zimo': 'Zimo',
  'photos': 'Album - Zimo',
  'blog': 'Blog - Zimo',
  'projects': 'Projects - Zimo',
  'about': 'About - Zimo',
};

export const imagesArrowMap: { [key: string]: string } = {
  'projects': '/projects-arrow.svg',
  'photos': '/photos-arrow.svg',
};

