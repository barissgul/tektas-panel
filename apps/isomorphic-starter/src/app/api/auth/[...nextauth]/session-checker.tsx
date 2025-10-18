'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export default function SessionChecker() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Sadece authenticated kullanıcılar için çalışsın
    if (status !== 'authenticated' || !session) {
      return;
    }

    // Giriş sayfasındaysak kontrol etme
    if (pathname?.includes('/giris')) {
      return;
    }

    // sessionStorage kontrolü - tarayıcı kapanınca bu silinir
    const authActive = sessionStorage.getItem('auth_active');
    const authSession = sessionStorage.getItem('auth_session');

    // Eğer sessionStorage'da session yoksa (tarayıcı kapatılıp açılmış demektir)
    if (!authActive || !authSession) {
      console.log('❌ Session bulunamadı - Tarayıcı yeni açılmış. Çıkış yapılıyor...');
      signOut({ redirect: true, callbackUrl: '/giris' });
      return;
    }

    // Session süresi kontrolü (8 saat)
    const loginTime = parseInt(authSession);
    const currentTime = Date.now();
    const maxSessionTime = 8 * 60 * 60 * 1000; // 8 saat (milisaniye)

    if (currentTime - loginTime > maxSessionTime) {
      console.log('❌ Session süresi doldu. Çıkış yapılıyor...');
      sessionStorage.removeItem('auth_active');
      sessionStorage.removeItem('auth_session');
      signOut({ redirect: true, callbackUrl: '/giris' });
      return;
    }

    console.log('✅ Session aktif');
  }, [session, status, pathname, router]);

  return null; // Görsel bir şey render etmiyoruz
}

