const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Urun {
  id: number;
  sanal_magaza_id: number;
  urun_kodu: string;
  urun_adi: string;
  aciklama?: string;
  kategori?: string;
  marka?: string;
  barkod?: string;
  fiyat: number;
  maliyet?: number;
  stok_miktari: number;
  min_stok_miktari?: number;
  birim?: string;
  resim_url?: string;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  sanal_magaza?: {
    id: number;
    magaza_adi: string;
    magaza_kodu: string;
  };
}

export interface CreateUrunDto {
  sanal_magaza_id: number;
  urun_kodu: string;
  urun_adi: string;
  aciklama?: string;
  kategori?: string;
  marka?: string;
  barkod?: string;
  fiyat: number;
  maliyet?: number;
  stok_miktari?: number;
  min_stok_miktari?: number;
  birim?: string;
  resim_url?: string;
  durum?: number;
}

export async function getUrunler(): Promise<Urun[]> {
  try {
    const response = await fetch(`${API_URL}/urunler`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Ürün verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Ürünler fetch error:', error);
    return [];
  }
}

export async function getUrunlerByMagaza(magazaId: number): Promise<Urun[]> {
  try {
    const response = await fetch(`${API_URL}/urunler/magaza/${magazaId}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Ürün verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Ürünler fetch error:', error);
    return [];
  }
}

export async function getUrunById(id: number): Promise<Urun | null> {
  try {
    const response = await fetch(`${API_URL}/urunler/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Ürün fetch error:', error);
    return null;
  }
}

export async function searchUrunler(searchTerm: string): Promise<Urun[]> {
  try {
    const response = await fetch(`${API_URL}/urunler/ara?q=${encodeURIComponent(searchTerm)}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Arama yapılamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Ürün arama error:', error);
    return [];
  }
}

export async function getDusukStokUrunler(): Promise<Urun[]> {
  try {
    const response = await fetch(`${API_URL}/urunler/dusuk-stok`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Düşük stok verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Düşük stok fetch error:', error);
    return [];
  }
}

export async function createUrun(data: CreateUrunDto): Promise<Urun | null> {
  try {
    const response = await fetch(`${API_URL}/urunler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ürün oluşturulamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Ürün create error:', error);
    throw error;
  }
}

export async function updateUrun(id: number, data: Partial<CreateUrunDto>): Promise<Urun | null> {
  try {
    const response = await fetch(`${API_URL}/urunler/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ürün güncellenemedi');
    }
    
    return response.json();
  } catch (error) {
    console.error('Ürün update error:', error);
    throw error;
  }
}

export async function updateUrunStok(id: number, miktar: number): Promise<Urun | null> {
  try {
    const response = await fetch(`${API_URL}/urunler/${id}/stok`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ miktar }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Stok güncellenemedi');
    }
    
    return response.json();
  } catch (error) {
    console.error('Stok update error:', error);
    throw error;
  }
}

export async function deleteUrun(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/urunler/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Ürün delete error:', error);
    return false;
  }
}

