'use client';

import Link from 'next/link';
import { Title, Text, Button, Textarea } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  PiArrowLeftBold,
  PiUploadBold,
  PiDownloadSimpleBold,
  PiPackageDuotone,
} from 'react-icons/pi';

export default function TrendyolStokFiyat() {
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
          Stok & Fiyat Güncelleme
        </Title>
        <Text className="text-gray-500">
          Toplu stok ve fiyat güncellemesi yapın
        </Text>
      </div>

      <div className="grid gap-6 @4xl:grid-cols-2">
        {/* Stok Güncelleme */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Title as="h3" className="mb-1 text-lg">
                Toplu Stok Güncelleme
              </Title>
              <Text className="text-sm text-gray-500">
                Barkod ve stok miktarlarını girin
              </Text>
            </div>
            <Button variant="outline" size="sm">
              <PiDownloadSimpleBold className="mr-2 h-4 w-4" />
              Şablon İndir
            </Button>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Stok Verileri
            </label>
            <Textarea
              rows={10}
              placeholder={`Barkod,Miktar
8806092055521,150
194252707060,89
6934177748943,45
...`}
              className="w-full font-mono text-sm"
            />
            <Text className="mt-2 text-xs text-gray-500">
              Format: Her satırda Barkod,Miktar (virgülle ayrılmış)
            </Text>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">
              <PiUploadBold className="mr-2 h-4 w-4" />
              Stok Güncelle
            </Button>
            <Button variant="outline" className="flex-1">
              Önizleme
            </Button>
          </div>

          {/* İstatistikler */}
          <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="text-center">
              <Text className="text-xs text-gray-500">Toplam</Text>
              <Text className="font-semibold">0</Text>
            </div>
            <div className="text-center">
              <Text className="text-xs text-gray-500">Başarılı</Text>
              <Text className="font-semibold text-green-600">0</Text>
            </div>
            <div className="text-center">
              <Text className="text-xs text-gray-500">Hatalı</Text>
              <Text className="font-semibold text-red-600">0</Text>
            </div>
          </div>
        </div>

        {/* Fiyat Güncelleme */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Title as="h3" className="mb-1 text-lg">
                Toplu Fiyat Güncelleme
              </Title>
              <Text className="text-sm text-gray-500">
                Barkod, satış fiyatı ve liste fiyatı girin
              </Text>
            </div>
            <Button variant="outline" size="sm">
              <PiDownloadSimpleBold className="mr-2 h-4 w-4" />
              Şablon İndir
            </Button>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Fiyat Verileri
            </label>
            <Textarea
              rows={10}
              placeholder={`Barkod,Satış Fiyatı,Liste Fiyatı
8806092055521,12999,14999
194252707060,18499,19999
6934177748943,4999,5999
...`}
              className="w-full font-mono text-sm"
            />
            <Text className="mt-2 text-xs text-gray-500">
              Format: Her satırda Barkod,SatışFiyatı,ListeFiyatı (virgülle ayrılmış)
            </Text>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">
              <PiUploadBold className="mr-2 h-4 w-4" />
              Fiyat Güncelle
            </Button>
            <Button variant="outline" className="flex-1">
              Önizleme
            </Button>
          </div>

          {/* İstatistikler */}
          <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="text-center">
              <Text className="text-xs text-gray-500">Toplam</Text>
              <Text className="font-semibold">0</Text>
            </div>
            <div className="text-center">
              <Text className="text-xs text-gray-500">Başarılı</Text>
              <Text className="font-semibold text-green-600">0</Text>
            </div>
            <div className="text-center">
              <Text className="text-xs text-gray-500">Hatalı</Text>
              <Text className="font-semibold text-red-600">0</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Son Güncellemeler */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <Title as="h3" className="mb-4 text-lg">
          Son Güncellemeler
        </Title>
        <div className="space-y-3">
          <UpdateItem
            type="Stok"
            product="Samsung Galaxy S21"
            oldValue="120 → 150"
            time="5 dk önce"
            status="success"
          />
          <UpdateItem
            type="Fiyat"
            product="iPhone 13 Pro"
            oldValue="₺17,999 → ₺18,499"
            time="15 dk önce"
            status="success"
          />
          <UpdateItem
            type="Stok"
            product="Xiaomi Redmi Note 11"
            oldValue="30 → 45"
            time="1 saat önce"
            status="success"
          />
          <UpdateItem
            type="Fiyat"
            product="Oppo A74"
            oldValue="Güncelleme başarısız"
            time="2 saat önce"
            status="error"
          />
        </div>
      </div>
    </div>
  );
}

function UpdateItem({
  type,
  product,
  oldValue,
  time,
  status,
}: {
  type: string;
  product: string;
  oldValue: string;
  time: string;
  status: 'success' | 'error';
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            status === 'success'
              ? 'bg-green-100 dark:bg-green-600/20'
              : 'bg-red-100 dark:bg-red-600/20'
          )}
        >
          <PiPackageDuotone
            className={cn(
              'h-5 w-5',
              status === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            )}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Text className="font-medium">{product}</Text>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
              {type}
            </span>
          </div>
          <Text className="text-sm text-gray-500">{oldValue}</Text>
        </div>
      </div>
      <Text className="text-xs text-gray-400">{time}</Text>
    </div>
  );
}

