'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  PiShoppingCartDuotone,
  PiCurrencyDollarDuotone,
  PiPackageDuotone,
  PiUsersDuotone,
  PiTrendUpDuotone,
  PiTrendDownDuotone,
  PiChartLineUpDuotone,
} from 'react-icons/pi';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/giris');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Title>Yükleniyor...</Title>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6">
        <Title as="h2" className="mb-2">
          E-Ticaret Dashboard
        </Title>
        <Text className="text-gray-500">
          Hoş geldiniz! İşte güncel istatistikleriniz
        </Text>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-4">
        <StatCard
          title="Toplam Satış"
          value="₺124,563"
          change="+12.5%"
          isPositive={true}
          icon={<PiCurrencyDollarDuotone className="h-7 w-7" />}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-600/20"
        />
        <StatCard
          title="Siparişler"
          value="1,234"
          change="+8.2%"
          isPositive={true}
          icon={<PiShoppingCartDuotone className="h-7 w-7" />}
          iconClassName="bg-green-100 text-green-600 dark:bg-green-600/20"
        />
        <StatCard
          title="Ürünler"
          value="856"
          change="-2.4%"
          isPositive={false}
          icon={<PiPackageDuotone className="h-7 w-7" />}
          iconClassName="bg-orange-100 text-orange-600 dark:bg-orange-600/20"
        />
        <StatCard
          title="Müşteriler"
          value="3,456"
          change="+15.3%"
          isPositive={true}
          icon={<PiUsersDuotone className="h-7 w-7" />}
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-600/20"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 @container @4xl:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Title as="h3" className="text-lg">
                Satış Performansı
              </Title>
              <Text className="text-sm text-gray-500">Son 7 gün</Text>
            </div>
            <PiChartLineUpDuotone className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex h-64 items-end justify-around gap-2">
            {[65, 80, 75, 90, 85, 95, 100].map((height, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${height}%` }}
                />
                <Text className="text-xs text-gray-500">
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][index]}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4">
            <Title as="h3" className="mb-1 text-lg">
              Sipariş Dağılımı
            </Title>
            <Text className="text-sm text-gray-500">Kategorilere göre</Text>
          </div>
          <div className="space-y-4">
            <OrderCategory
              name="Trendyol"
              value={45}
              color="bg-orange-500"
              count="234"
            />
            <OrderCategory
              name="Hepsiburada"
              value={30}
              color="bg-red-500"
              count="156"
            />
            <OrderCategory
              name="N11"
              value={15}
              color="bg-purple-500"
              count="78"
            />
            <OrderCategory
              name="Diğer"
              value={10}
              color="bg-gray-400"
              count="52"
            />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <Title as="h3" className="text-lg">
            Son Siparişler
          </Title>
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Tümünü Gör →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Sipariş No
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Müşteri
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Platform
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Tutar
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              <OrderRow
                orderNo="#TY-12345"
                customer="Ahmet Yılmaz"
                platform="Trendyol"
                amount="₺234.50"
                status="Onaylandı"
                statusColor="bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400"
              />
              <OrderRow
                orderNo="#HB-67890"
                customer="Ayşe Demir"
                platform="Hepsiburada"
                amount="₺456.00"
                status="Hazırlanıyor"
                statusColor="bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400"
              />
              <OrderRow
                orderNo="#N11-34567"
                customer="Mehmet Kaya"
                platform="N11"
                amount="₺189.90"
                status="Kargoda"
                statusColor="bg-orange-100 text-orange-700 dark:bg-orange-600/20 dark:text-orange-400"
              />
              <OrderRow
                orderNo="#TY-89012"
                customer="Fatma Şahin"
                platform="Trendyol"
                amount="₺567.80"
                status="Teslim Edildi"
                statusColor="bg-gray-100 text-gray-700 dark:bg-gray-600/20 dark:text-gray-400"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  isPositive,
  icon,
  iconClassName,
}: {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <div className={cn('rounded-lg p-3', iconClassName)}>{icon}</div>
        <div
          className={cn(
            'flex items-center gap-1 text-sm font-semibold',
            isPositive ? 'text-green-600' : 'text-red-600'
          )}
        >
          {isPositive ? (
            <PiTrendUpDuotone className="h-4 w-4" />
          ) : (
            <PiTrendDownDuotone className="h-4 w-4" />
          )}
          {change}
        </div>
      </div>
      <Text className="mb-1 text-sm text-gray-500">{title}</Text>
      <Title as="h3" className="text-2xl">
        {value}
      </Title>
    </div>
  );
}

// Order Category Component
function OrderCategory({
  name,
  value,
  color,
  count,
}: {
  name: string;
  value: number;
  color: string;
  count: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-gray-700 dark:text-gray-300">{name}</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {count} sipariş
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className={cn('h-full rounded-full', color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// Order Row Component
function OrderRow({
  orderNo,
  customer,
  platform,
  amount,
  status,
  statusColor,
}: {
  orderNo: string;
  customer: string;
  platform: string;
  amount: string;
  status: string;
  statusColor: string;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 dark:border-gray-700/50">
      <td className="py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
        {orderNo}
      </td>
      <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
        {customer}
      </td>
      <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
        {platform}
      </td>
      <td className="py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {amount}
      </td>
      <td className="py-4">
        <span
          className={cn(
            'inline-flex rounded-full px-3 py-1 text-xs font-medium',
            statusColor
          )}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}

