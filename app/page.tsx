import dynamic from 'next/dynamic';

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/journal');
  }, [router]);

  return null;
}
