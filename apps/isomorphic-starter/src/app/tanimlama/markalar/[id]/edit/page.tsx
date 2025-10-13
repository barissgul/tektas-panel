'use client';

import { useState, useEffect } from 'react';
import { Title, Text, Button, Input, Switch } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiArrowLeftBold, PiCheckBold, PiImageDuotone } from 'react-icons/pi';
import { getMarkaById, updateMarka } from '@/services/marka.service';
import { useRouter, useParams } from 'next/navigation';
import { routes } from '@/config/routes';
import Link from 'next/link';

export default function EditMarkaPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    marka: '',
    resim_url: '',
    durum: "1",
  });

  useEffect(() => {
    if (params.id) {
      loadMarka(Number(params.id));
    }
  }, [params.id]);

  const loadMarka = async (id: number) => {
    try {
      setLoading(true);
      const data = await getMarkaById(id);
      if (data) {
        setFormData({
          marka: data.marka,
          resim_url: data.resim_url || '',
          durum: data.durum.toString(),
        });
      } else {
        alert('Marka bulunamadı');
        router.push(routes.tanimlama.markalar);
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.marka.trim()) {
      alert('Marka adı zorunludur');
      return;
    }

    setSaving(true);
    try {
      const result = await updateMarka(Number(params.id), formData);
      if (result) {
        router.push(routes.tanimlama.markalar);
      } else {
        alert('Marka güncellenemedi');
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
        <div className="flex items-center gap-3 mb-2">
          <Link
            href={routes.tanimlama.markalar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <PiArrowLeftBold className="h-4 w-4" />
          </Link>
          <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-600/20 flex items-center justify-center">
            <PiImageDuotone className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <Title as="h2" className="!text-2xl">
              Marka Düzenle
            </Title>
            <Text className="text-gray-500">
              Marka bilgilerini güncelleyin
            </Text>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Marka Adı <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Örn: Bosch, Valeo, LuK..."
              value={formData.marka}
              onChange={(e) => setFormData({ ...formData, marka: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Resim URL
            </label>
            <Input
              type="text"
              placeholder="https://example.com/logo.png"
              value={formData.resim_url}
              onChange={(e) => setFormData({ ...formData, resim_url: e.target.value })}
            />
            <Text className="mt-1 text-xs text-gray-500">
              Marka logosunun URL adresi (isteğe bağlı)
            </Text>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div>
              <Text className="font-medium">Durum</Text>
              <Text className="text-xs text-gray-500">
                Markayı aktif veya pasif yapın
              </Text>
            </div>
            <Switch
              checked={formData.durum == "1"}
              onChange={(checked) => setFormData({ ...formData, durum: checked ? 1 : 0 })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={routes.tanimlama.markalar} className="flex-1">
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

