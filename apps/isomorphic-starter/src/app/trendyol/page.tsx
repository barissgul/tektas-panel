'use client';

import Link from 'next/link';
import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  PiGearSixDuotone,
  PiPackageDuotone,
  PiShoppingCartDuotone,
  PiCurrencyDollarDuotone,
  PiTrendUpDuotone,
  PiChartBarDuotone,
} from 'react-icons/pi';

export default function TrendyolDashboard() {
  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-600/20 flex items-center justify-center">
            <PiShoppingCartDuotone className="h-7 w-7 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <Title as="h2" className="!text-2xl">
              Trendyol Yönetim Paneli
            </Title>
            <Text className="text-gray-500">
              Trendyol entegrasyonu ve yönetim merkezi
            </Text>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="mb-8 grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-4">
        <StatCard
          title="Toplam Ürün"
          value="1,234"
          subtitle="Aktif ürünler"
          change="+12"
          icon={<PiPackageDuotone className="h-6 w-6" />}
          iconBg="bg-blue-100 dark:bg-blue-600/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Bekleyen Sipariş"
          value="45"
          subtitle="Onay bekliyor"
          change="+8"
          icon={<PiShoppingCartDuotone className="h-6 w-6" />}
          iconBg="bg-orange-100 dark:bg-orange-600/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          title="Bugünkü Satış"
          value="₺12,345"
          subtitle="Son 24 saat"
          change="+25%"
          icon={<PiCurrencyDollarDuotone className="h-6 w-6" />}
          iconBg="bg-green-100 dark:bg-green-600/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Stok Uyarısı"
          value="23"
          subtitle="Düşük stok"
          change="-5"
          icon={<PiChartBarDuotone className="h-6 w-6" />}
          iconBg="bg-red-100 dark:bg-red-600/20"
          iconColor="text-red-600 dark:text-red-400"
        />
      </div>

      {/* Hızlı Erişim Modülleri */}
      <div className="mb-6">
        <Title as="h3" className="mb-4 text-lg">
          Hızlı Erişim Modülleri
        </Title>
        <div className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-4">
          <ModuleCard
            href="/trendyol/yapilandirma"
            icon={<PiGearSixDuotone className="h-8 w-8" />}
            title="Yapılandırma"
            description="API ayarları ve bağlantı konfigürasyonu"
            color="blue"
          />
          <ModuleCard
            href="/trendyol/urunler"
            icon={<PiPackageDuotone className="h-8 w-8" />}
            title="Ürün Yönetimi"
            description="Ürün listeleme, ekleme ve güncelleme"
            color="purple"
          />
          <ModuleCard
            href="/trendyol/siparisler"
            icon={<PiShoppingCartDuotone className="h-8 w-8" />}
            title="Sipariş Yönetimi"
            description="Sipariş takibi ve kargo işlemleri"
            color="orange"
          />
          <ModuleCard
            href="/trendyol/stok-fiyat"
            icon={<PiCurrencyDollarDuotone className="h-8 w-8" />}
            title="Stok & Fiyat"
            description="Toplu stok ve fiyat güncelleme"
            color="green"
          />
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div className="grid gap-6 @4xl:grid-cols-2">
        {/* Son İşlemler */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <Title as="h3" className="text-lg">
              Son İşlemler
            </Title>
            <Text className="text-sm text-gray-500">Bugün</Text>
          </div>
          <div className="space-y-3">
            <ActivityItem
              icon={<PiPackageDuotone className="h-5 w-5" />}
              title="Ürün güncellendi"
              description="Samsung Galaxy S21 - Stok: 150"
              time="5 dk önce"
              color="blue"
            />
            <ActivityItem
              icon={<PiShoppingCartDuotone className="h-5 w-5" />}
              title="Yeni sipariş"
              description="Sipariş #TY-12345 - ₺234.50"
              time="15 dk önce"
              color="orange"
            />
            <ActivityItem
              icon={<PiTrendUpDuotone className="h-5 w-5" />}
              title="Fiyat güncellendi"
              description="10 ürün fiyatı güncellendi"
              time="1 saat önce"
              color="green"
            />
            <ActivityItem
              icon={<PiPackageDuotone className="h-5 w-5" />}
              title="Stok uyarısı"
              description="3 üründe stok azaldı"
              time="2 saat önce"
              color="red"
            />
          </div>
        </div>

        {/* Hızlı Bilgiler */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <Title as="h3" className="mb-4 text-lg">
            Hızlı Bilgiler
          </Title>
          <div className="space-y-4">
            <InfoItem
              label="API Durumu"
              value="Bağlı"
              valueColor="text-green-600 dark:text-green-400"
            />
            <InfoItem
              label="Son Senkronizasyon"
              value="5 dakika önce"
              valueColor="text-gray-900 dark:text-gray-100"
            />
            <InfoItem
              label="Toplam Kategori"
              value="45 kategori"
              valueColor="text-gray-900 dark:text-gray-100"
            />
            <InfoItem
              label="Ortalama Sipariş"
              value="₺345.67"
              valueColor="text-gray-900 dark:text-gray-100"
            />
            <InfoItem
              label="Onay Oranı"
              value="%95.2"
              valueColor="text-green-600 dark:text-green-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// İstatistik Kartı
function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  change: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <div className={cn('rounded-lg p-2.5', iconBg)}>
          <div className={iconColor}>{icon}</div>
        </div>
        <span className="text-xs font-medium text-gray-500">{change}</span>
      </div>
      <Title as="h4" className="mb-1 text-2xl">
        {value}
      </Title>
      <Text className="text-sm text-gray-500">{title}</Text>
      <Text className="text-xs text-gray-400">{subtitle}</Text>
    </div>
  );
}

// Modül Kartı
function ModuleCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'orange' | 'green';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 group-hover:bg-blue-600 dark:group-hover:bg-blue-500',
    purple:
      'bg-purple-100 text-purple-600 dark:bg-purple-600/20 dark:text-purple-400 group-hover:bg-purple-600 dark:group-hover:bg-purple-500',
    orange:
      'bg-orange-100 text-orange-600 dark:bg-orange-600/20 dark:text-orange-400 group-hover:bg-orange-600 dark:group-hover:bg-orange-500',
    green:
      'bg-green-100 text-green-600 dark:bg-green-600/20 dark:text-green-400 group-hover:bg-green-600 dark:group-hover:bg-green-500',
  };

  return (
    <Link
      href={href}
      className="group block rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
    >
      <div className="mb-3">
        <div
          className={cn(
            'inline-flex rounded-lg p-3 transition-all group-hover:text-white',
            colorClasses[color]
          )}
        >
          {icon}
        </div>
      </div>
      <Title as="h4" className="mb-1.5 text-base">
        {title}
      </Title>
      <Text className="text-sm text-gray-500">{description}</Text>
    </Link>
  );
}

// Aktivite Öğesi
function ActivityItem({
  icon,
  title,
  description,
  time,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color: 'blue' | 'orange' | 'green' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400',
    orange:
      'bg-orange-100 text-orange-600 dark:bg-orange-600/20 dark:text-orange-400',
    green:
      'bg-green-100 text-green-600 dark:bg-green-600/20 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-600/20 dark:text-red-400',
  };

  return (
    <div className="flex items-start gap-3">
      <div className={cn('rounded-lg p-2', colorClasses[color])}>{icon}</div>
      <div className="flex-1 min-w-0">
        <Text className="mb-0.5 font-medium text-gray-900 dark:text-gray-100">
          {title}
        </Text>
        <Text className="text-sm text-gray-500">{description}</Text>
        <Text className="text-xs text-gray-400">{time}</Text>
      </div>
    </div>
  );
}

// Bilgi Öğesi
function InfoItem({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className={cn('font-semibold', valueColor)}>{value}</Text>
    </div>
  );
}

