'use client';

import { useEffect, useState } from 'react';
import { getAnamenuler, type Anamenu } from '@/services/menu.service';
import { getIconByName } from '@/utils/menu-icons';

export interface MenuItem {
  name: string;
  href?: string;
  icon?: React.ReactElement;
  badge?: string;
  dropdownItems?: {
    name: string;
    href: string;
    badge?: string;
  }[];
}

export function useDynamicMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const anamenuler = await getAnamenuler();
        const items = transformToMenuItems(anamenuler);
        setMenuItems(items);
      } catch (error) {
        console.error('Menü yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  return { menuItems, loading };
}

function transformToMenuItems(anamenuler: Anamenu[]): MenuItem[] {
  const items: MenuItem[] = [];

  anamenuler.forEach((anamenu) => {
    // Anamenu başlığını ekle (sadece başlık, href yok)
    items.push({
      name: anamenu.anamenu,
    });

    // Alt anamenüler varsa (anamenu_id ile ilişkili olanlar)
    if (anamenu.altAnamenuler && anamenu.altAnamenuler.length > 0) {
      anamenu.altAnamenuler.forEach((altAnamenu) => {
        // Alt anamenu ikonunu al
        const icon = altAnamenu.ikon ? getIconByName(altAnamenu.ikon) : undefined;

        // Alt anamenu altında menüler varsa (alt_anamenu_id ile ilişkili olanlar)
        if (altAnamenu.menuler && altAnamenu.menuler.length > 0) {
          items.push({
            name: altAnamenu.alt_anamenu,
            href: '#',
            icon: icon,
            dropdownItems: altAnamenu.menuler.map((menu) => ({
              name: menu.menu,
              href: menu.rota,
            })),
          });
        } else {
          // Alt anamenu altında menü yoksa, alt anamenu'nun rotasını kullan
          const rota = altAnamenu.rota;
          items.push({
            name: altAnamenu.alt_anamenu,
            href: rota ? (rota.startsWith('/') ? rota : '/' + rota) : '#',
            icon: icon,
          });
        }
      });
    }
  });

  return items;
}

