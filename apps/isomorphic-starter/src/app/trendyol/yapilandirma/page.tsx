'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Title, Text, Button, Input } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  PiArrowLeftBold,
  PiCheckCircleDuotone,
  PiXCircleDuotone,
} from 'react-icons/pi';

export default function TrendyolYapilandirma() {
  const [formData, setFormData] = useState({
    magaza_kodu: '',
    supplier_id: '',
    api_key: '',
    api_secret: '',
    aktif: true,
  });

  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API çağrısı buraya gelecek
    console.log('Form Data:', formData);
  };

  const handleTest = async () => {
    // API test çağrısı
    setTestResult({
      success: true,
      message: 'Bağlantı başarılı! API çalışıyor.',
    });
  };

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/trendyol"
          className="mb-3 inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
        >
          <PiArrowLeftBold className="h-4 w-4" />
          <span className="text-sm">Trendyol Dashboard'a Dön</span>
        </Link>
        <Title as="h2" className="mb-2">
          Trendyol Yapılandırması
        </Title>
        <Text className="text-gray-500">
          Trendyol API bağlantı ayarlarınızı yapılandırın
        </Text>
      </div>

      <div className="grid gap-6 @4xl:grid-cols-3">
        {/* Form */}
        <div className="@4xl:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mağaza Kodu <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Örn: MAGAZA001"
                  value={formData.magaza_kodu}
                  onChange={(e) =>
                    setFormData({ ...formData, magaza_kodu: e.target.value })
                  }
                  className="w-full"
                />
                <Text className="mt-1 text-xs text-gray-500">
                  Benzersiz mağaza tanımlayıcı kodunuz
                </Text>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Supplier ID <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Örn: 123456"
                  value={formData.supplier_id}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_id: e.target.value })
                  }
                  className="w-full"
                />
                <Text className="mt-1 text-xs text-gray-500">
                  Trendyol Satıcı Panelinden alınan Supplier ID
                </Text>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  API Key <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Trendyol API Key"
                  value={formData.api_key}
                  onChange={(e) =>
                    setFormData({ ...formData, api_key: e.target.value })
                  }
                  className="w-full"
                />
                <Text className="mt-1 text-xs text-gray-500">
                  API entegrasyonu için gerekli key
                </Text>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  API Secret <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Trendyol API Secret"
                  value={formData.api_secret}
                  onChange={(e) =>
                    setFormData({ ...formData, api_secret: e.target.value })
                  }
                  className="w-full"
                />
                <Text className="mt-1 text-xs text-gray-500">
                  API güvenlik anahtarı (şifrelenmiş saklanır)
                </Text>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="aktif"
                  checked={formData.aktif}
                  onChange={(e) =>
                    setFormData({ ...formData, aktif: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="aktif" className="text-sm">
                  Entegrasyonu aktif et
                </label>
              </div>

              {/* Test Result */}
              {testResult && (
                <div
                  className={cn(
                    'flex items-start gap-3 rounded-lg p-4',
                    testResult.success
                      ? 'bg-green-50 dark:bg-green-600/10'
                      : 'bg-red-50 dark:bg-red-600/10'
                  )}
                >
                  {testResult.success ? (
                    <PiCheckCircleDuotone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <PiXCircleDuotone className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <Text
                    className={cn(
                      'text-sm',
                      testResult.success
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    )}
                  >
                    {testResult.message}
                  </Text>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  Kaydet
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTest}
                  className="flex-1"
                >
                  Bağlantıyı Test Et
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Yardım Paneli */}
        <div className="space-y-6">
          {/* Bilgilendirme */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-600/30 dark:bg-blue-600/10">
            <Title as="h4" className="mb-2 text-base text-blue-900 dark:text-blue-100">
              Nasıl API Bilgisi Alınır?
            </Title>
            <Text className="mb-3 text-sm text-blue-700 dark:text-blue-300">
              Trendyol Satıcı Panelinden API bilgilerinizi alabilirsiniz:
            </Text>
            <ol className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>1. Trendyol Satıcı Paneline giriş yapın</li>
              <li>2. Hesabım → API Ayarları menüsüne gidin</li>
              <li>3. Yeni API Key oluşturun</li>
              <li>4. Supplier ID'nizi not alın</li>
              <li>5. API Key ve Secret'ı kopyalayın</li>
            </ol>
          </div>

          {/* Mevcut Konfigürasyonlar */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <Title as="h4" className="mb-3 text-base">
              Mevcut Konfigürasyonlar
            </Title>
            <div className="space-y-3">
              <ConfigItem
                label="Toplam Config"
                value="1"
                status="active"
              />
              <ConfigItem
                label="Aktif Bağlantı"
                value="1"
                status="active"
              />
              <ConfigItem
                label="Son Güncelleme"
                value="Bugün, 14:30"
                status="info"
              />
            </div>
          </div>

          {/* API Durumu */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <Title as="h4" className="mb-3 text-base">
              API Durumu
            </Title>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Base URL
                </Text>
                <span className="text-xs font-mono text-gray-900 dark:text-gray-100">
                  api.trendyol.com
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Bağlantı
                </Text>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Aktif
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Timeout
                </Text>
                <span className="text-xs text-gray-900 dark:text-gray-100">
                  30 saniye
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Config Item Component
function ConfigItem({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: 'active' | 'inactive' | 'info';
}) {
  const statusColors = {
    active: 'text-green-600 dark:text-green-400',
    inactive: 'text-red-600 dark:text-red-400',
    info: 'text-gray-900 dark:text-gray-100',
  };

  return (
    <div className="flex items-center justify-between">
      <Text className="text-sm text-gray-600 dark:text-gray-400">{label}</Text>
      <Text className={cn('text-sm font-semibold', statusColors[status])}>
        {value}
      </Text>
    </div>
  );
}

