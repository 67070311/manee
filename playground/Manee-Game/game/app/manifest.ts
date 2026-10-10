import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Moonveil Alchemy',
    short_name: 'Moonveil',
    description: 'A mobile-first potion brewing game set in a magical night apothecary.',
    start_url: '/',
    display: 'standalone',
    background_color: '#efe3f3',
    theme_color: '#6d5482',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
