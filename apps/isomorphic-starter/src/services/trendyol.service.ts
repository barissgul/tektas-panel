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
    const url = `${API_URL}/trendyol/config`;
    console.log('Config API URL:', url);
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    console.log('Config Response status:', response.status);
    console.log('Config Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Config API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: url
      });
      throw new Error('Config verileri alınamadı');
    }
    
    const data = await response.json();
    console.log('Config Response data:', data);
    return data;
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

// Ürün tipleri
export interface TrendyolProduct {
  id: string;
  title: string;
  description: string;
  barcode: string;
  brand: string;
  categoryId: number;
  salePrice: number;
  listPrice: number;
  quantity: number;
  productCode: string;
  stockCode: string;
  images: { url: string }[];
}

export interface TrendyolProductListResponse {
  content: TrendyolProduct[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

// Ürünleri getir
export async function getTrendyolProducts(
  magazaKodu: string,
  page: number = 0,
  size: number = 50
): Promise<TrendyolProductListResponse> {
  try {
    const url = `${API_URL}/trendyol/${magazaKodu}/products?page=${page}&size=${size}`;
    console.log('API URL:', url);
    console.log('Mağaza Kodu:', magazaKodu);
    
    const response = await fetch(url, {
      cache: 'no-store',
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500) + '...', // Sadece ilk 500 karakter
        url: url
      });
      
      let errorMessage = 'Ürünler alınamadı';
      
      // HTML yanıt kontrolü (Cloudflare blok sayfası)
      if (errorText.includes('Cloudflare') || errorText.includes('<!DOCTYPE html>')) {
        errorMessage = 'Trendyol API erişim izni reddedildi. API anahtarlarınızı kontrol edin.';
      } else {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Trendyol products fetch error:', error);
    throw error;
  }
}

// Tek ürün getir
export async function getTrendyolProductById(
  magazaKodu: string,
  productId: string
): Promise<TrendyolProduct> {
  try {
    const response = await fetch(
      `${API_URL}/trendyol/${magazaKodu}/products/${productId}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Ürün alınamadı');
    }

    return await response.json();
  } catch (error) {
    console.error('Trendyol product fetch error:', error);
    throw error;
  }
}

