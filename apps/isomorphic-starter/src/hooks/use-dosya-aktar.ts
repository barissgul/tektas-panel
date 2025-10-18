import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface KolonTanimi<T> {
  /** Kolon başlığı */
  baslik: string;
  /** Veri alanı veya fonksiyon */
  alan: keyof T | ((satir: T) => any);
  /** Kolon genişliği (opsiyonel) */
  genislik?: number;
}

export interface AktarAyarlari {
  /** Dosya adı (uzantısız) */
  dosyaAdi?: string;
  /** Sayfa adı (sadece Excel için) */
  sayfaAdi?: string;
  /** Başlık */
  baslik?: string;
  /** Alt başlık */
  altBaslik?: string;
}

export type AktarTipi = 'excel' | 'pdf';

/**
 * Dosya aktarma hook'u (Excel & PDF)
 * 
 * @example
 * ```tsx
 * const { dosyaAktar } = useDosyaAktar<Urun>();
 * 
 * const kolonlar: KolonTanimi<Urun>[] = [
 *   { baslik: 'Ürün Kodu', alan: 'urun_kodu' },
 *   { baslik: 'Ürün Adı', alan: 'urun_adi' },
 * ];
 * 
 * // Excel
 * <Button onClick={() => dosyaAktar('excel', urunler, kolonlar)}>Excel</Button>
 * 
 * // PDF
 * <Button onClick={() => dosyaAktar('pdf', urunler, kolonlar)}>PDF</Button>
 * ```
 */
export function useDosyaAktar<T = any>() {
  /**
   * Excel'e aktar
   */
  const excelAktar = useCallback(
    (
      veri: T[],
      kolonlar: KolonTanimi<T>[],
      ayarlar: AktarAyarlari = {}
    ) => {
      const {
        dosyaAdi = 'veri',
        sayfaAdi = 'Sayfa1',
      } = ayarlar;

      if (!veri || veri.length === 0) {
        throw new Error('Aktarılacak veri bulunamadı');
      }

      // Excel verisi oluştur
      const excelVerisi: any[][] = [];
      const basliklar = kolonlar.map((k) => k.baslik);
      excelVerisi.push(basliklar);

      // Veri satırları
      veri.forEach((satir) => {
        const satirVerisi = kolonlar.map((kolon) => {
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

      // Kolon genişlikleri
      const kolonGenislikleri = kolonlar.map((k) => ({
        wch: k.genislik || 15,
      }));
      ws['!cols'] = kolonGenislikleri;

      // Workbook oluştur
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sayfaAdi);

      // Tarih ekle
      const tarih = new Date()
        .toLocaleDateString('tr-TR')
        .replace(/\./g, '-');
      const saat = new Date()
        .toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        .replace(':', '-');
      const tamDosyaAdi = `${dosyaAdi}_${tarih}_${saat}.xlsx`;

      // İndir
      XLSX.writeFile(wb, tamDosyaAdi);
    },
    []
  );

  /**
   * PDF'e aktar
   */
  const pdfAktar = useCallback(
    (
      veri: T[],
      kolonlar: KolonTanimi<T>[],
      ayarlar: AktarAyarlari = {}
    ) => {
      const {
        dosyaAdi = 'veri',
        baslik = 'Rapor',
        altBaslik,
      } = ayarlar;

      if (!veri || veri.length === 0) {
        throw new Error('Aktarılacak veri bulunamadı');
      }

      // PDF oluştur (A4 yatay)
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Türkçe karakter desteği için font ekle (varsayılan font Türkçe destekliyor)
      doc.setFont('helvetica');

      // Başlık
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(baslik, 14, 15);

      // Alt başlık
      if (altBaslik) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(altBaslik, 14, 22);
      }

      // Tarih
      const tarihStr = new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      doc.setFontSize(9);
      doc.text(tarihStr, 14, altBaslik ? 27 : 22);

      // Tablo başlıkları
      const basliklar = kolonlar.map((k) => k.baslik);

      // Tablo verileri
      const satirlar = veri.map((satir) =>
        kolonlar.map((kolon) => {
          if (typeof kolon.alan === 'function') {
            const deger = kolon.alan(satir);
            return deger != null ? String(deger) : '-';
          } else {
            const deger = satir[kolon.alan];
            return deger != null ? String(deger) : '-';
          }
        })
      );

      // AutoTable ile tablo oluştur
      autoTable(doc, {
        head: [basliklar],
        body: satirlar,
        startY: altBaslik ? 32 : 27,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 14, right: 14 },
      });

      // Sayfa numarası (alt bilgi)
      const sayfaSayisi = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= sayfaSayisi; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Sayfa ${i} / ${sayfaSayisi}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Tarihli dosya adı
      const tarih = new Date()
        .toLocaleDateString('tr-TR')
        .replace(/\./g, '-');
      const saat = new Date()
        .toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        .replace(':', '-');
      const tamDosyaAdi = `${dosyaAdi}_${tarih}_${saat}.pdf`;

      // İndir
      doc.save(tamDosyaAdi);
    },
    []
  );

  /**
   * Tip seçimine göre aktar
   */
  const dosyaAktar = useCallback(
    (
      tip: AktarTipi,
      veri: T[],
      kolonlar: KolonTanimi<T>[],
      ayarlar: AktarAyarlari = {}
    ) => {
      if (tip === 'excel') {
        excelAktar(veri, kolonlar, ayarlar);
      } else if (tip === 'pdf') {
        pdfAktar(veri, kolonlar, ayarlar);
      }
    },
    [excelAktar, pdfAktar]
  );

  return {
    /** Dosya aktar (excel veya pdf) */
    dosyaAktar,
    /** Sadece Excel'e aktar */
    excelAktar,
    /** Sadece PDF'e aktar */
    pdfAktar,
  };
}

