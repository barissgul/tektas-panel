'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Title, Text, Button, Input } from 'rizzui';
import {
  PiArrowLeftBold,
  PiMagnifyingGlassBold,
  PiDownloadBold,
  PiUploadBold,
} from 'react-icons/pi';

export default function TrendyolUrunler() {
  const [searchTerm, setSearchTerm] = useState('');

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
          Ürün Yönetimi
        </Title>
        <Text className="text-gray-500">
          Trendyol'daki ürünlerinizi görüntüleyin ve yönetin
        </Text>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 @xl:flex-row @xl:items-center @xl:justify-between">
        <div className="flex-1 @xl:max-w-md">
          <Input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            className="w-full"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="w-full @xl:w-auto">
            <PiDownloadBold className="mr-2 h-4 w-4" />
            Ürünleri Çek
          </Button>
          <Button className="w-full @xl:w-auto">
            <PiUploadBold className="mr-2 h-4 w-4" />
            Ürün Gönder
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 @xl:grid-cols-4">
        <StatsCard title="Toplam Ürün" value="1,234" />
        <StatsCard title="Aktif" value="1,156" color="green" />
        <StatsCard title="Beklemede" value="45" color="orange" />
        <StatsCard title="Pasif" value="33" color="red" />
      </div>

      {/* Products Table */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 text-left text-sm font-semibold">Ürün</th>
                <th className="p-4 text-left text-sm font-semibold">Barkod</th>
                <th className="p-4 text-left text-sm font-semibold">Stok</th>
                <th className="p-4 text-left text-sm font-semibold">Fiyat</th>
                <th className="p-4 text-left text-sm font-semibold">Durum</th>
                <th className="p-4 text-right text-sm font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              <ProductRow
                name="Samsung Galaxy S21"
                barcode="8806092055521"
                stock={150}
                price="₺12,999"
                status="active"
              />
              <ProductRow
                name="iPhone 13 Pro"
                barcode="194252707060"
                stock={89}
                price="₺18,499"
                status="active"
              />
              <ProductRow
                name="Xiaomi Redmi Note 11"
                barcode="6934177748943"
                stock={5}
                price="₺4,999"
                status="low-stock"
              />
              <ProductRow
                name="Oppo A74"
                barcode="6944284682078"
                stock={0}
                price="₺3,799"
                status="out-of-stock"
              />
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-700">
          <Text className="text-sm text-gray-500">
            1-10 arası gösteriliyor (Toplam 1,234)
          </Text>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Önceki
            </Button>
            <Button variant="outline" size="sm">
              Sonraki
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  color = 'blue',
}: {
  title: string;
  value: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
}) {
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <Text className="mb-1 text-sm text-gray-500">{title}</Text>
      <Title as="h3" className={`text-2xl ${colors[color]}`}>
        {value}
      </Title>
    </div>
  );
}

function ProductRow({
  name,
  barcode,
  stock,
  price,
  status,
}: {
  name: string;
  barcode: string;
  stock: number;
  price: string;
  status: 'active' | 'low-stock' | 'out-of-stock';
}) {
  const statusConfig = {
    active: {
      label: 'Aktif',
      class: 'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400',
    },
    'low-stock': {
      label: 'Düşük Stok',
      class: 'bg-orange-100 text-orange-700 dark:bg-orange-600/20 dark:text-orange-400',
    },
    'out-of-stock': {
      label: 'Stokta Yok',
      class: 'bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400',
    },
  };

  return (
    <tr className="border-b border-gray-100 last:border-0 dark:border-gray-700/50">
      <td className="p-4">
        <Text className="font-medium">{name}</Text>
      </td>
      <td className="p-4">
        <Text className="text-sm text-gray-500">{barcode}</Text>
      </td>
      <td className="p-4">
        <Text className="font-semibold">{stock}</Text>
      </td>
      <td className="p-4">
        <Text className="font-semibold">{price}</Text>
      </td>
      <td className="p-4">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusConfig[status].class}`}>
          {statusConfig[status].label}
        </span>
      </td>
      <td className="p-4 text-right">
        <Button variant="outline" size="sm">
          Düzenle
        </Button>
      </td>
    </tr>
  );
}

