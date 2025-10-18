'use client';

import { useState } from 'react';
import cn from '@core/utils/class-names';

interface MarkaLogoProps {
  resimUrl?: string | null;
  markaAdi: string;
  boyut?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const boyutMap = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

/**
 * Marka logosu gösterme componenti
 * - resim_url alanından logoyu gösterir
 * - Resim yoksa veya yüklenemezse placeholder gösterir
 */
export default function MarkaLogo({
  resimUrl,
  markaAdi,
  boyut = 'md',
  className,
}: MarkaLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Resim URL'ini oluştur - public/uploads/markalar/ klasöründen
  const fullImageUrl = resimUrl && !imageError
    ? `/uploads/markalar/${resimUrl}`
    : null;

  // Resim yoksa veya yüklenemezse placeholder
  if (!fullImageUrl || imageError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
          boyutMap[boyut],
          className
        )}
      >
        <span className="font-bold text-gray-600 dark:text-gray-300">
          {markaAdi.substring(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-white dark:bg-gray-800',
        boyutMap[boyut],
        className
      )}
    >
      <img
        src={fullImageUrl}
        alt={`${markaAdi} Logo`}
        className="h-full w-full object-contain p-1"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

/**
 * Kullanım örnekleri:
 * 
 * // Basit kullanım - resim_url ve marka adı ile
 * <MarkaLogo resimUrl={marka.resim_url} markaAdi={marka.marka} />
 * 
 * // Farklı boyutta
 * <MarkaLogo resimUrl={marka.resim_url} markaAdi={marka.marka} boyut="lg" />
 * 
 * // Custom stil ile
 * <MarkaLogo 
 *   resimUrl={marka.resim_url} 
 *   markaAdi={marka.marka} 
 *   boyut="xl" 
 *   className="shadow-lg border-2" 
 * />
 * 
 * // resim_url yoksa otomatik placeholder gösterir
 * <MarkaLogo resimUrl={null} markaAdi="Bosch" />
 * 
 * NOTLAR:
 * - resim_url DB'den gelir (örn: "alfaromeo.png")
 * - Otomatik olarak "/uploads/markalar/" eklenir
 * - Dosya yolu: public/uploads/markalar/alfaromeo.png
 * - Final URL: /uploads/markalar/alfaromeo.png
 * - Resim yüklenemezse marka adının ilk 2 harfi gösterilir
 */

