import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return [
    {
      url: 'https://lumimaid.com/',
      lastModified: now,
    },
    {
      url: 'https://lumimaid.com/contact',
      lastModified: now,
    },
  ];
}
