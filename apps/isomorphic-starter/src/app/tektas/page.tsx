'use client';

import Link from 'next/link';
import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  PiPackageDuotone,
  PiChartBarDuotone,
  PiCurrencyDollarDuotone,
  PiWarehouseDuotone,
} from 'react-icons/pi';

export default function TektasDashboard() {
  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center">
            <PiWarehouseDuotone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <Title as="h2" className="!text-2xl">
              Tektas Yönetim Paneli
            </Title>
            <Text className="text-gray-500">
              Stok ve ürün yönetim merkezi
            </Text>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="mb-8 grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-4">
        <StatCard
          title="Toplam Ürün"
          value="12,914"
          subtitle="Aktif stoklar"
          icon={<PiPackageDuotone className="h-6 w-6" />}
          iconBg="bg-blue-100 dark:bg-blue-600/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Raflı Ürün"
          value="9,234"
          subtitle="Raf yerleşimi var"
          icon={<PiWarehouseDuotone className="h-6 w-6" />}
          iconBg="bg-purple-100 dark:bg-purple-600/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Toplam Değer"
          value="₺2.5M"
          subtitle="Stok toplam değeri"
          icon={<PiCurrencyDollarDuotone className="h-6 w-6" />}
          iconBg="bg-green-100 dark:bg-green-600/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Kategori"
          value="45"
          subtitle="Farklı kategori"
          icon={<PiChartBarDuotone className="h-6 w-6" />}
          iconBg="bg-orange-100 dark:bg-orange-600/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Hızlı Erişim Modülleri */}
      <div className="mb-6">
        <Title as="h3" className="mb-4 text-lg">
          Hızlı Erişim Modülleri
        </Title>
        <div className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
          <ModuleCard
            href="/tektas/urunler"
            icon={<PiPackageDuotone className="h-8 w-8" />}
            title="Ürün Listesi"
            description="Tüm ürünleri görüntüle ve yönet (12,914 ürün)"
            color="blue"
          />
          <ModuleCard
            href="/tektas/urunler"
            icon={<PiChartBarDuotone className="h-8 w-8" />}
            title="Stok Raporları"
            description="Detaylı stok raporları ve analizler"
            color="purple"
          />
          <ModuleCard
            href="/tektas/urunler"
            icon={<PiWarehouseDuotone className="h-8 w-8" />}
            title="Raf Yönetimi"
            description="Raf ve depo yerleşim düzeni"
            color="orange"
          />
        </div>
      </div>

      {/* Kategorilere Göre Dağılım */}
      <div className="grid gap-6 @4xl:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <Title as="h3" className="mb-4 text-lg">
            Popüler Kategoriler
          </Title>
          <div className="space-y-3">
            <CategoryBar name="Motor" value={25} count="3,228" />
            <CategoryBar name="Fren Sistemi" value={18} count="2,324" />
            <CategoryBar name="Süspansiyon" value={15} count="1,937" />
            <CategoryBar name="Elektrik" value={12} count="1,549" />
            <CategoryBar name="Diğer" value={30} count="3,876" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <Title as="h3" className="mb-4 text-lg">
            Stok Durumu
          </Title>
          <div className="space-y-4">
            <StockStatus
              label="Normal Stok"
              value={85}
              count="10,977"
              color="bg-green-500"
            />
            <StockStatus
              label="Düşük Stok"
              value={10}
              count="1,291"
              color="bg-orange-500"
            />
            <StockStatus
              label="Stokta Yok"
              value={5}
              count="646"
              color="bg-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3">
        <div className={cn('inline-flex rounded-lg p-2.5', iconBg)}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <Title as="h4" className="mb-1 text-2xl">
        {value}
      </Title>
      <Text className="text-sm text-gray-500">{title}</Text>
      <Text className="text-xs text-gray-400">{subtitle}</Text>
    </div>
  );
}

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
  color: 'blue' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 group-hover:bg-blue-600 dark:group-hover:bg-blue-500',
    purple:
      'bg-purple-100 text-purple-600 dark:bg-purple-600/20 dark:text-purple-400 group-hover:bg-purple-600 dark:group-hover:bg-purple-500',
    orange:
      'bg-orange-100 text-orange-600 dark:bg-orange-600/20 dark:text-orange-400 group-hover:bg-orange-600 dark:group-hover:bg-orange-500',
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

function CategoryBar({
  name,
  value,
  count,
}: {
  name: string;
  value: number;
  count: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-gray-700 dark:text-gray-300">{name}</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {count} ürün
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-blue-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StockStatus({
  label,
  value,
  count,
  color,
}: {
  label: string;
  value: number;
  count: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Text className="text-sm text-gray-700 dark:text-gray-300">{label}</Text>
        <Text className="text-sm font-semibold">{count} ürün</Text>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className={cn('h-full rounded-full', color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
