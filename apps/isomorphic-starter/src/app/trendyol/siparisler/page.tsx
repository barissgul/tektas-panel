'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Title, Text, Button, Input } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  PiArrowLeftBold,
  PiMagnifyingGlassBold,
  PiDownloadBold,
  PiPackageDuotone,
} from 'react-icons/pi';

export default function TrendyolSiparisler() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'awaiting', label: 'Onay Bekliyor' },
    { value: 'approved', label: 'Onaylandı' },
    { value: 'shipped', label: 'Kargoda' },
    { value: 'delivered', label: 'Teslim Edildi' },
  ];

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
          Sipariş Yönetimi
        </Title>
        <Text className="text-gray-500">
          Trendyol siparişlerinizi görüntüleyin ve yönetin
        </Text>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 @xl:flex-row @xl:items-center @xl:justify-between">
        <div className="flex gap-3">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                selectedStatus === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Button>
          <PiDownloadBold className="mr-2 h-4 w-4" />
          Siparişleri Çek
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 @xl:grid-cols-5">
        <OrderStatCard title="Tümü" value="156" color="gray" />
        <OrderStatCard title="Onay Bekliyor" value="12" color="orange" />
        <OrderStatCard title="Hazırlanıyor" value="28" color="blue" />
        <OrderStatCard title="Kargoda" value="45" color="purple" />
        <OrderStatCard title="Teslim Edildi" value="71" color="green" />
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 text-left text-sm font-semibold">
                  Sipariş No
                </th>
                <th className="p-4 text-left text-sm font-semibold">
                  Müşteri
                </th>
                <th className="p-4 text-left text-sm font-semibold">Tarih</th>
                <th className="p-4 text-left text-sm font-semibold">Ürün</th>
                <th className="p-4 text-left text-sm font-semibold">Tutar</th>
                <th className="p-4 text-left text-sm font-semibold">Durum</th>
                <th className="p-4 text-right text-sm font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow
                orderNo="TY-123456789"
                customer="Ahmet Yılmaz"
                date="11 Ekim 2025"
                products="Samsung Galaxy S21"
                amount="₺12,999"
                status="awaiting"
              />
              <OrderRow
                orderNo="TY-987654321"
                customer="Ayşe Demir"
                date="11 Ekim 2025"
                products="iPhone 13 Pro + 2 ürün"
                amount="₺24,567"
                status="approved"
              />
              <OrderRow
                orderNo="TY-456789123"
                customer="Mehmet Kaya"
                date="10 Ekim 2025"
                products="Xiaomi Redmi Note 11"
                amount="₺4,999"
                status="shipped"
              />
              <OrderRow
                orderNo="TY-789123456"
                customer="Fatma Şahin"
                date="10 Ekim 2025"
                products="Oppo A74"
                amount="₺3,799"
                status="delivered"
              />
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-700">
          <Text className="text-sm text-gray-500">
            1-10 arası gösteriliyor (Toplam 156)
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

function OrderStatCard({
  title,
  value,
  color = 'gray',
}: {
  title: string;
  value: string;
  color?: 'gray' | 'orange' | 'blue' | 'purple' | 'green';
}) {
  const colors = {
    gray: 'text-gray-600 dark:text-gray-400',
    orange: 'text-orange-600 dark:text-orange-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <Text className="mb-1 text-xs text-gray-500">{title}</Text>
      <Title as="h3" className={`text-xl ${colors[color]}`}>
        {value}
      </Title>
    </div>
  );
}

function OrderRow({
  orderNo,
  customer,
  date,
  products,
  amount,
  status,
}: {
  orderNo: string;
  customer: string;
  date: string;
  products: string;
  amount: string;
  status: 'awaiting' | 'approved' | 'shipped' | 'delivered';
}) {
  const statusConfig = {
    awaiting: {
      label: 'Onay Bekliyor',
      class:
        'bg-orange-100 text-orange-700 dark:bg-orange-600/20 dark:text-orange-400',
    },
    approved: {
      label: 'Onaylandı',
      class:
        'bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400',
    },
    shipped: {
      label: 'Kargoda',
      class:
        'bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-400',
    },
    delivered: {
      label: 'Teslim Edildi',
      class:
        'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400',
    },
  };

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-700/50">
      <td className="p-4">
        <Text className="font-mono text-sm font-medium">{orderNo}</Text>
      </td>
      <td className="p-4">
        <Text className="text-sm">{customer}</Text>
      </td>
      <td className="p-4">
        <Text className="text-sm text-gray-500">{date}</Text>
      </td>
      <td className="p-4">
        <Text className="text-sm">{products}</Text>
      </td>
      <td className="p-4">
        <Text className="font-semibold">{amount}</Text>
      </td>
      <td className="p-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[status].class}`}
        >
          {statusConfig[status].label}
        </span>
      </td>
      <td className="p-4 text-right">
        <Button variant="outline" size="sm">
          Detay
        </Button>
      </td>
    </tr>
  );
}

