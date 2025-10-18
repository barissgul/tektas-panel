const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ParcaMarka {
  id: number;
  parca_marka: string;
  mensei?: string;
  parca_turu?: string;
  durum: number;
}

export interface ParcaMarkalarResponse {
  data: ParcaMarka[];
  meta: {
    total: number;
  };
}

export async function getParcaMarkalar(
  search?: string,
): Promise<ParcaMarkalarResponse> {
  try {
    const params = new URLSearchParams();

    if (search) {
      params.append('search', search);
    }

    const url = search
      ? `${API_URL}/parca-markalar?${params}`
      : `${API_URL}/parca-markalar`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Parça marka verileri alınamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Parça markalar fetch error:', error);
    return {
      data: [],
      meta: {
        total: 0,
      },
    };
  }
}

export async function getParcaMarkaById(
  id: number,
): Promise<ParcaMarka | null> {
  try {
    const response = await fetch(`${API_URL}/parca-markalar/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Parça marka fetch error:', error);
    return null;
  }
}

export async function createParcaMarka(
  data: Omit<ParcaMarka, 'id'>,
): Promise<ParcaMarka | null> {
  try {
    const response = await fetch(`${API_URL}/parca-markalar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Parça marka oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Parça marka create error:', error);
    return null;
  }
}

export async function updateParcaMarka(
  id: number,
  data: Partial<ParcaMarka>,
): Promise<ParcaMarka | null> {
  try {
    const response = await fetch(`${API_URL}/parca-markalar/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Parça marka güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Parça marka update error:', error);
    return null;
  }
}

export async function deleteParcaMarka(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/parca-markalar/${id}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Parça marka delete error:', error);
    return false;
  }
}

