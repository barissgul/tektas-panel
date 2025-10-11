const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface TrendyolConfig {
  id: number;
  magaza_adi: string;
  magaza_kodu: string;
  api_url: string;
  api_key: string;
  api_secret: string;
  satici_id: string;
  baglanti_turu: string;
  aktif: boolean;
  notlar?: string;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export async function getTrendyolConfigs(): Promise<TrendyolConfig[]> {
  try {
    const response = await fetch(`${API_URL}/trendyol/config`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Config verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Trendyol config fetch error:', error);
    return [];
  }
}

export async function getTrendyolConfigById(id: number): Promise<TrendyolConfig | null> {
  try {
    const response = await fetch(`${API_URL}/trendyol/config/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Config verisi alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Trendyol config fetch error:', error);
    return null;
  }
}

export async function createTrendyolConfig(data: any): Promise<TrendyolConfig> {
  const response = await fetch(`${API_URL}/trendyol/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Config oluşturulamadı');
  }

  return response.json();
}

export async function updateTrendyolConfig(
  id: number,
  data: any,
): Promise<TrendyolConfig> {
  const response = await fetch(`${API_URL}/trendyol/config/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Config güncellenemedi');
  }

  return response.json();
}

export async function deleteTrendyolConfig(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/trendyol/config/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Config silinemedi');
  }
}

export async function testTrendyolConnection(magazaKodu: string): Promise<any> {
  try {
    const response = await fetch(
      `${API_URL}/trendyol/${magazaKodu}/categories`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Bağlantı başarısız');
    }

    return await response.json();
  } catch (error) {
    console.error('Trendyol connection test error:', error);
    throw error;
  }
}

