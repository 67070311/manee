'use client';

import dynamic from 'next/dynamic';

const PotionGame = dynamic(() => import('../components/PotionGameComplete'), { ssr: false });

export default function Home() {
  return <PotionGame />;
}
