import { useCallback } from 'react';
import * as XLSX from 'xlsx';

export interface ExcelKolonTanimi<T> {
  /** Kolon başlığı (Excel'de görünecek) */
  baslik: string;
  /** Veri objesindeki alan adı veya değer döndüren fonksiyon */
  alan: keyof T | ((satir: T) => any);
  /** Kolon genişliği (opsiyonel) */
  genislik?: number;
}

export interface ExcelAktarAyarlari {
  /** Dosya adı (uzantısız) */
  dosyaAdi?: string;
  /** Sayfa adı */
  sayfaAdi?: string;
  /** Başlık satırı stil ayarları */
  baslikStili?: boolean;
}

/**
 * Excel'e veri aktarma hook'u
 * 500K+ satır için optimize edilmiş
 * 
 * @example
 * ```tsx
 * const { excelAktar, yukleniyor } = useExcelAktar();
 * 
 * const kolonlar: ExcelKolonTanimi<Urun>[] = [
 *   { baslik: 'Ürün Kodu', alan: 'urun_kodu', genislik: 15 },
 *   { baslik: 'Ürün Adı', alan: 'urun_adi', genislik: 30 },
 *   { baslik: 'Fiyat', alan: (urun) => `₺${urun.fiyat}`, genislik: 12 },
 * ];
 * 
 * <Button onClick={() => excelAktar(urunler, kolonlar)}>
 *   Excel'e Aktar
 * </Button>
 * ```
 */
export function useExcelAktar<T = any>() {
  /**
   * Veriyi Excel dosyası olarak indir
   */
  const excelAktar = useCallback(
    (
      veri: T[],
      kolonlar: ExcelKolonTanimi<T>[],
      ayarlar: ExcelAktarAyarlari = {}
    ) => {
      try {
        const {
          dosyaAdi = 'veri',
          sayfaAdi = 'Sayfa1',
          baslikStili = true,
        } = ayarlar;

        // Boş veri kontrolü
        if (!veri || veri.length === 0) {
          console.warn('Aktarılacak veri bulunamadı');
          return;
        }

        // Excel verisi oluştur
        const excelVerisi: any[][] = [];

        // Başlık satırı ekle
        const basliklar = kolonlar.map((kolon) => kolon.baslik);
        excelVerisi.push(basliklar);

        // Veri satırları ekle
        veri.forEach((satir) => {
          const satirVerisi = kolonlar.map((kolon) => {
            // Alan bir fonksiyon mu yoksa property mi?
            if (typeof kolon.alan === 'function') {
              return kolon.alan(satir);
            } else {
              return satir[kolon.alan];
            }
          });
          excelVerisi.push(satirVerisi);
        });

        // Worksheet oluştur
        const ws = XLSX.utils.aoa_to_sheet(excelVerisi);

        // Kolon genişlikleri ayarla
        const kolonGenislikleri = kolonlar.map((kolon) => ({
          wch: kolon.genislik || 15,
        }));
        ws['!cols'] = kolonGenislikleri;

        // Başlık satırı stilini ayarla (kalın, arka plan rengi)
        if (baslikStili) {
          kolonlar.forEach((_, index) => {
            const hucreAdresi = XLSX.utils.encode_cell({ r: 0, c: index });
            if (ws[hucreAdresi]) {
              ws[hucreAdresi].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: 'E0E0E0' } },
                alignment: { horizontal: 'center', vertical: 'center' },
              };
            }
          });
        }

        // Workbook oluştur
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sayfaAdi);

        // Dosya adına tarih ekle
        const tarih = new Date()
          .toLocaleDateString('tr-TR')
          .replace(/\./g, '-');
        const saat = new Date()
          .toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          .replace(':', '-');
        const tamDosyaAdi = `${dosyaAdi}_${tarih}_${saat}.xlsx`;

        // Excel dosyasını indir
        XLSX.writeFile(wb, tamDosyaAdi);

        console.log(`✅ Excel dosyası oluşturuldu: ${tamDosyaAdi}`);
        console.log(`📊 Toplam ${veri.length} satır aktarıldı`);
      } catch (hata) {
        console.error('❌ Excel aktarma hatası:', hata);
        throw new Error('Excel dosyası oluşturulurken bir hata oluştu');
      }
    },
    []
  );

  /**
   * Basit kolay kullanım - sadece veri objesini olduğu gibi aktar
   */
  const basitAktar = useCallback(
    (veri: T[], dosyaAdi: string = 'veri') => {
      if (!veri || veri.length === 0) {
        console.warn('Aktarılacak veri bulunamadı');
        return;
      }

      // İlk satırdan kolonları otomatik belirle
      const ilkSatir = veri[0];
      const kolonlar: ExcelKolonTanimi<T>[] = Object.keys(ilkSatir as any).map(
        (anahtar) => ({
          baslik: anahtar
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase()), // snake_case'i Title Case'e çevir
          alan: anahtar as keyof T,
          genislik: 15,
        })
      );

      excelAktar(veri, kolonlar, { dosyaAdi });
    },
    [excelAktar]
  );

  /**
   * Filtrelenmiş veriyi aktar (sayfalamadan bağımsız)
   */
  const filtreliAktar = useCallback(
    (
      tumVeri: T[],
      filtre: (satir: T) => boolean,
      kolonlar: ExcelKolonTanimi<T>[],
      dosyaAdi: string = 'filtreli_veri'
    ) => {
      const filtreliVeri = tumVeri.filter(filtre);
      excelAktar(filtreliVeri, kolonlar, { dosyaAdi });
    },
    [excelAktar]
  );

  return {
    /** Excel'e aktar (özelleştirilebilir kolonlar ile) */
    excelAktar,
    /** Basit aktarım (kolonlar otomatik) */
    basitAktar,
    /** Filtrelenmiş veriyi aktar */
    filtreliAktar,
  };
}

