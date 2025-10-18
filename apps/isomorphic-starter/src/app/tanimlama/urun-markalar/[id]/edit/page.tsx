'use client';

import { useState, useEffect } from 'react';
import { Title, Text, Button, Input, Switch } from 'rizzui';
import { PiArrowLeftBold, PiCheckBold, PiPackageDuotone } from 'react-icons/pi';
import {
  getParcaMarkaById,
  updateParcaMarka,
} from '@/services/urun-marka.service';
import { useRouter, useParams } from 'next/navigation';
import { routes } from '@/config/routes';
import Link from 'next/link';

export default function EditUrunMarkaPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    parca_marka: '',
    mensei: '',
    parca_turu: '',
    durum: 1,
  });

  useEffect(() => {
    if (params.id) {
      loadParcaMarka(Number(params.id));
    }
  }, [params.id]);

  const loadParcaMarka = async (id: number) => {
    try {
      setLoading(true);
      const data = await getParcaMarkaById(id);
      if (data) {
        setFormData({
          parca_marka: data.parca_marka,
          mensei: data.mensei || '',
          parca_turu: data.parca_turu || '',
          durum: data.durum,
        });
      } else {
        alert('Ürün marka bulunamadı');
        router.push(routes.tanimlama.urunMarkalar);
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.parca_marka.trim()) {
      alert('Ürün marka adı zorunludur');
      return;
    }

    setSaving(true);
    try {
      const result = await updateParcaMarka(Number(params.id), formData);
      if (result) {
        router.push(routes.tanimlama.urunMarkalar);
      } else {
        alert('Ürün marka güncellenemedi');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <Text className="mt-3 text-gray-500">Yükleniyor...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <Link
            href={routes.tanimlama.urunMarkalar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <PiArrowLeftBold className="h-4 w-4" />
          </Link>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-600/20">
            <PiPackageDuotone className="h-7 w-7 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <Title as="h2" className="!text-2xl">
              Ürün Marka Düzenle
            </Title>
            <Text className="text-gray-500">
              Ürün marka bilgilerini güncelleyin
            </Text>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Ürün Marka Adı <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Örn: FAE, NGK, Bosch..."
              value={formData.parca_marka}
              onChange={(e) =>
                setFormData({ ...formData, parca_marka: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Menşei</label>
            <Input
              type="text"
              placeholder="Örn: İspanya, Japonya, Almanya..."
              value={formData.mensei}
              onChange={(e) =>
                setFormData({ ...formData, mensei: e.target.value })
              }
            />
            <Text className="mt-1 text-xs text-gray-500">
              Ürünün menşei (köken ülke) - isteğe bağlı
            </Text>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Ürün Türü</label>
            <Input
              type="text"
              placeholder="Örn: Elektrik Parçaları, Buji, Filtre..."
              value={formData.parca_turu}
              onChange={(e) =>
                setFormData({ ...formData, parca_turu: e.target.value })
              }
            />
            <Text className="mt-1 text-xs text-gray-500">
              Ürün kategorisi veya türü - isteğe bağlı
            </Text>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div>
              <Text className="font-medium">Durum</Text>
              <Text className="text-xs text-gray-500">
                Ürün markayı aktif veya pasif yapın
              </Text>
            </div>
            <Switch
              checked={formData.durum === 1}
              onChange={(checked) =>
                setFormData({ ...formData, durum: checked ? 1 : 0 })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={routes.tanimlama.urunMarkalar} className="flex-1">
              <Button variant="outline" className="w-full" disabled={saving}>
                İptal
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? (
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              ) : (
                <>
                  <PiCheckBold className="mr-2 h-4 w-4" />
                  Güncelle
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}





