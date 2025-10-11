const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface TektasStok {
  ID: number;
  KODU: string;
  STOK: string;
  DURUM: string;
  OEM_KODU: string;
  RESIM: string | null;
  BARKOD: string;
  FIYAT: string | null;
  KATEGORI_ID: number;
  PARCA_MARKA_ID: number;
  PARCA_MARKA: string;
  ACIKLAMA: string;
  GENEL_ACIKLAMA: string;
  ALIS_FIYAT: string;
  SATIS_FIYAT: string;
  ADET: number;
  KALAN_ADET: string;
  MARKA: string;
  KATEGORI: string;
  RAF: string;
  RAF_YER: string;
}

export interface TektasStokResponse {
  HATA: boolean;
  ACIKLAMA: string;
  TOPLAM_KAYIT: number;
  DATA: TektasStok[];
}

export async function getTektasStoklar(): Promise<TektasStokResponse> {
  try {
    const response = await fetch(`${API_URL}/tektas/stoklar`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Stok verileri alınamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Tektas stok fetch error:', error);
    throw error;
  }
}

export async function getTektasStokByKodu(kodu: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/tektas/stoklar/${kodu}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Stok detayı alınamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Tektas stok detay fetch error:', error);
    throw error;
  }
}

export async function searchTektasStok(query: string): Promise<TektasStokResponse> {
  try {
    const response = await fetch(`${API_URL}/tektas/stoklar/ara?q=${encodeURIComponent(query)}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Arama başarısız');
    }

    return response.json();
  } catch (error) {
    console.error('Tektas search error:', error);
    throw error;
  }
}

