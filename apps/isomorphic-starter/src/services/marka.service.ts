const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Marka {
  id: number;
  marka: string;
  resim_url?: string;
  durum: number;
}

export interface MarkalarResponse {
  data: Marka[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getMarkalar(
  page: number = 1,
  limit: number = 12,
  search?: string
): Promise<MarkalarResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_URL}/markalar?${params}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Marka verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Markalar fetch error:', error);
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
      },
    };
  }
}

export async function getMarkaById(id: number): Promise<Marka | null> {
  try {
    const response = await fetch(`${API_URL}/markalar/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Marka fetch error:', error);
    return null;
  }
}

export async function createMarka(data: Omit<Marka, 'id'>): Promise<Marka | null> {
  try {
    const response = await fetch(`${API_URL}/markalar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Marka oluşturulamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Marka create error:', error);
    return null;
  }
}

export async function updateMarka(id: number, data: Partial<Marka>): Promise<Marka | null> {
  try {
    const response = await fetch(`${API_URL}/markalar/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Marka güncellenemedi');
    }
    
    return response.json();
  } catch (error) {
    console.error('Marka update error:', error);
    return null;
  }
}

export async function deleteMarka(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/markalar/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Marka delete error:', error);
    return false;
  }
}

