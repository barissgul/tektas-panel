const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Anamenu {
  id: number;
  anamenu: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
  menuler?: Menu[];
  altAnamenuler?: AltAnamenu[];
}

export interface AltAnamenu {
  id: number;
  alt_anamenu: string;
  anamenu_id: number;
  rota?: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
  anamenu?: Anamenu;
  menuler?: Menu[];
}

export interface Menu {
  id: number;
  menu: string;
  anamenu_id?: number;
  alt_anamenu_id?: number;
  rota: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
  anamenu?: Anamenu;
  altAnamenu?: AltAnamenu;
}

export async function getAnamenuler(): Promise<Anamenu[]> {
  try {
    const response = await fetch(`${API_URL}/anamenu`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Anamenu verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Anamenu fetch error:', error);
    return [];
  }
}

export async function getMenuler(): Promise<Menu[]> {
  try {
    const response = await fetch(`${API_URL}/menu`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Menu verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Menu fetch error:', error);
    return [];
  }
}

