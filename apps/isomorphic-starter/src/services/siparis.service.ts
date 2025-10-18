const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface SiparisDetay {
  id: number;
  siparis_id: number;
  urun_id?: number;
  urun_kodu?: string;
  urun_adi: string;
  barkod?: string;
  varyant_bilgisi?: string;
  miktar: number;
  birim_fiyat: number;
  indirim: number;
  toplam: number;
  kdv_orani: number;
  kdv_tutari: number;
  platform_urun_id?: string;
  platform_kalem_id?: string;
  durum: string;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  urun?: {
    id: number;
    urun_kodu: string;
    urun_adi: string;
  };
}

export interface Siparis {
  id: number;
  siparis_no: string;
  sanal_magaza_id: number;
  musteri_adi?: string;
  musteri_soyadi?: string;
  musteri_email?: string;
  musteri_telefon?: string;
  ara_toplam: number;
  kargo_ucreti: number;
  indirim_tutari: number;
  toplam_tutar: number;
  para_birimi: string;
  kargo_firmasi?: string;
  kargo_takip_no?: string;
  kargo_takip_link?: string;
  teslimat_adresi?: any;
  fatura_adresi?: any;
  durum: string;
  odeme_durumu: string;
  odeme_yontemi?: string;
  siparis_tarihi: string;
  onay_tarihi?: string;
  kargo_tarihi?: string;
  teslim_tarihi?: string;
  musteri_notu?: string;
  yonetici_notu?: string;
  platform_siparis_id?: string;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  sanal_magaza?: {
    id: number;
    magaza_adi: string;
    magaza_kodu: string;
  };
  detaylar?: SiparisDetay[];
}

export interface CreateSiparisDetayDto {
  urun_id?: number;
  urun_kodu?: string;
  urun_adi: string;
  barkod?: string;
  varyant_bilgisi?: string;
  miktar: number;
  birim_fiyat: number;
  indirim?: number;
  kdv_orani?: number;
  platform_urun_id?: string;
  platform_kalem_id?: string;
}

export interface CreateSiparisDto {
  siparis_no: string;
  sanal_magaza_id: number;
  musteri_adi?: string;
  musteri_soyadi?: string;
  musteri_email?: string;
  musteri_telefon?: string;
  kargo_ucreti?: number;
  indirim_tutari?: number;
  para_birimi?: string;
  kargo_firmasi?: string;
  kargo_takip_no?: string;
  kargo_takip_link?: string;
  teslimat_adresi?: any;
  fatura_adresi?: any;
  durum?: string;
  odeme_durumu?: string;
  odeme_yontemi?: string;
  musteri_notu?: string;
  yonetici_notu?: string;
  platform_siparis_id?: string;
  detaylar: CreateSiparisDetayDto[];
}

export async function getSiparisler(): Promise<Siparis[]> {
  try {
    const response = await fetch(`${API_URL}/siparisler`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Sipariş verileri alınamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Siparişler fetch error:', error);
    return [];
  }
}

export async function getSiparisByMagaza(magazaId: number): Promise<Siparis[]> {
  try {
    const response = await fetch(`${API_URL}/siparisler/magaza/${magazaId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Sipariş verileri alınamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Siparişler fetch error:', error);
    return [];
  }
}

export async function getSiparisByDurum(durum: string): Promise<Siparis[]> {
  try {
    const response = await fetch(`${API_URL}/siparisler/durum/${durum}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Sipariş verileri alınamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Siparişler fetch error:', error);
    return [];
  }
}

export async function getSiparisIstatistikleri(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/siparisler/istatistikler`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('İstatistik verileri alınamadı');
    }

    return response.json();
  } catch (error) {
    console.error('İstatistikler fetch error:', error);
    return null;
  }
}

export async function getBugunSiparisler(): Promise<Siparis[]> {
  try {
    const response = await fetch(`${API_URL}/siparisler/bugun`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Bugünün siparişleri alınamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Bugün siparişleri fetch error:', error);
    return [];
  }
}

export async function getSiparisById(id: number): Promise<Siparis | null> {
  try {
    const response = await fetch(`${API_URL}/siparisler/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Sipariş fetch error:', error);
    return null;
  }
}

export async function createSiparis(data: CreateSiparisDto): Promise<Siparis | null> {
  try {
    const response = await fetch(`${API_URL}/siparisler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Sipariş oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Sipariş create error:', error);
    throw error;
  }
}

export async function updateSiparis(
  id: number,
  data: Partial<CreateSiparisDto>,
): Promise<Siparis | null> {
  try {
    const response = await fetch(`${API_URL}/siparisler/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Sipariş güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Sipariş update error:', error);
    throw error;
  }
}

export async function updateSiparisDurum(
  id: number,
  durum: string,
): Promise<Siparis | null> {
  try {
    const response = await fetch(`${API_URL}/siparisler/${id}/durum`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ durum }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Durum güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Durum update error:', error);
    throw error;
  }
}

export async function deleteSiparis(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/siparisler/${id}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Sipariş delete error:', error);
    return false;
  }
}

