import { useState, useCallback, useMemo } from 'react';

export interface SayfalamaAyarlari {
  sayfaBoyutu?: number;
  baslangicSayfasi?: number;
}

export interface Sayfalamasonucu<T> {
  // Sayfalanmış veri
  sayfaliVeri: T[];
  
  // Sayfalama durumları
  mevcutSayfa: number;
  sayfaBoyutu: number;
  toplamKayit: number;
  toplamSayfa: number;
  
  // Sayfalama bilgileri
  baslangicIndex: number;
  bitisIndex: number;
  sonrakiSayfaVar: boolean;
  oncekiSayfaVar: boolean;
  
  // Sayfalama fonksiyonları
  sayfayaGit: (sayfa: number) => void;
  sonrakiSayfa: () => void;
  oncekiSayfa: () => void;
  sayfayiSifirla: () => void;
  
  // Pagination component için props
  sayfalamaProplari: {
    total: number;
    pageSize: number;
    current: number;
    onChange: (page: number) => void;
    showLessItems: boolean;
    prevIconClassName: string;
    nextIconClassName: string;
  };
}

/**
 * Tablo sayfalama için yeniden kullanılabilir hook
 * 
 * @example
 * ```tsx
 * const { sayfaliVeri, sayfalamaProplari, mevcutSayfa } = useTabloPagination(filtreliVeri, { sayfaBoyutu: 20 });
 * 
 * // Tabloda kullan
 * {sayfaliVeri.map(item => <TableRow key={item.id} data={item} />)}
 * 
 * // Pagination bileşeni
 * <Pagination {...sayfalamaProplari} />
 * ```
 */
export function useTabloPagination<T>(
  veri: T[],
  ayarlar: SayfalamaAyarlari = {}
): Sayfalamasonucu<T> {
  const { sayfaBoyutu = 20, baslangicSayfasi = 1 } = ayarlar;
  
  const [mevcutSayfa, setMevcutSayfa] = useState(baslangicSayfasi);

  // Toplam sayfa sayısı
  const toplamSayfa = useMemo(
    () => Math.ceil(veri.length / sayfaBoyutu),
    [veri.length, sayfaBoyutu]
  );

  // Sayfa değiştiğinde, toplam sayfadan fazlaysa düzelt
  const guvenliSayfa = useMemo(() => {
    if (mevcutSayfa > toplamSayfa && toplamSayfa > 0) {
      return toplamSayfa;
    }
    return mevcutSayfa;
  }, [mevcutSayfa, toplamSayfa]);

  // Mevcut sayfanın başlangıç ve bitiş index'leri
  const baslangicIndex = useMemo(
    () => (guvenliSayfa - 1) * sayfaBoyutu,
    [guvenliSayfa, sayfaBoyutu]
  );

  const bitisIndex = useMemo(
    () => Math.min(baslangicIndex + sayfaBoyutu, veri.length),
    [baslangicIndex, sayfaBoyutu, veri.length]
  );

  // Sayfalanmış veri
  const sayfaliVeri = useMemo(
    () => veri.slice(baslangicIndex, bitisIndex),
    [veri, baslangicIndex, bitisIndex]
  );

  // Sonraki/önceki sayfa kontrolü
  const sonrakiSayfaVar = guvenliSayfa < toplamSayfa;
  const oncekiSayfaVar = guvenliSayfa > 1;

  // Sayfa değiştirme fonksiyonları
  const sayfayaGit = useCallback((sayfa: number) => {
    setMevcutSayfa(sayfa);
  }, []);

  const sonrakiSayfa = useCallback(() => {
    if (sonrakiSayfaVar) {
      setMevcutSayfa((onceki) => onceki + 1);
    }
  }, [sonrakiSayfaVar]);

  const oncekiSayfa = useCallback(() => {
    if (oncekiSayfaVar) {
      setMevcutSayfa((onceki) => onceki - 1);
    }
  }, [oncekiSayfaVar]);

  const sayfayiSifirla = useCallback(() => {
    setMevcutSayfa(1);
  }, []);

  // Pagination component için hazır props
  const sayfalamaProplari = useMemo(
    () => ({
      total: veri.length,
      pageSize: sayfaBoyutu,
      current: guvenliSayfa,
      onChange: sayfayaGit,
      showLessItems: true,
      prevIconClassName: 'py-0 text-gray-500 !leading-[26px]',
      nextIconClassName: 'py-0 text-gray-500 !leading-[26px]',
    }),
    [veri.length, sayfaBoyutu, guvenliSayfa, sayfayaGit]
  );

  return {
    sayfaliVeri,
    mevcutSayfa: guvenliSayfa,
    sayfaBoyutu,
    toplamKayit: veri.length,
    toplamSayfa,
    baslangicIndex: baslangicIndex + 1, // Gösterim için 1-tabanlı index
    bitisIndex,
    sonrakiSayfaVar,
    oncekiSayfaVar,
    sayfayaGit,
    sonrakiSayfa,
    oncekiSayfa,
    sayfayiSifirla,
    sayfalamaProplari,
  };
}

