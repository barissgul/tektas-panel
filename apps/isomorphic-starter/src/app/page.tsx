'use client';

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
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Grafik verileri
const salesData = [
  { name: 'Pzt', satış: 12000, sipariş: 24, gelir: 15000 },
  { name: 'Sal', satış: 19000, sipariş: 38, gelir: 22000 },
  { name: 'Çar', satış: 15000, sipariş: 30, gelir: 18000 },
  { name: 'Per', satış: 25000, sipariş: 50, gelir: 28000 },
  { name: 'Cum', satış: 22000, sipariş: 44, gelir: 25000 },
  { name: 'Cmt', satış: 30000, sipariş: 60, gelir: 35000 },
  { name: 'Paz', satış: 28000, sipariş: 56, gelir: 32000 },
];

const ordersByPlatform = [
  { name: 'Trendyol', value: 234, color: '#E3BC20BA' },
  { name: 'Hepsiburada', value: 156, color: '#FF6000' },
  { name: 'N11', value: 78, color: '#8B5CF6' },
  { name: 'Diğer', value: 52, color: '#9CA3AF' },
];

const monthlyData = [
  { ay: 'Oca', gelir: 45000 },
  { ay: 'Şub', gelir: 52000 },
  { ay: 'Mar', gelir: 48000 },
  { ay: 'Nis', gelir: 61000 },
  { ay: 'May', gelir: 55000 },
  { ay: 'Haz', gelir: 67000 },
];

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Session yoksa otomatik olarak giriş sayfasına yönlendir
      window.location.href = '/giris';
    },
  });

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <Title className="text-gray-600">Yükleniyor...</Title>
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Title as="h2" className="mb-2 text-2xl font-bold">
              📊 E-Ticaret Dashboard
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">
              Merhaba! İşte güncel performans metriklerin
            </Text>
          </div>
          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 shadow-lg">
            <Text className="text-sm font-medium text-white">
              {new Date().toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </div>
        </div>
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
        {/* Sales Area Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Title as="h3" className="text-lg">
                Haftalık Satış Trendi
              </Title>
              <Text className="text-sm text-gray-500">Son 7 günün performansı</Text>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Satış</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Gelir</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSatış" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="satış" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fill="url(#colorSatış)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="gelir" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fill="url(#colorGelir)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6">
            <Title as="h3" className="mb-1 text-lg">
              Platform Bazlı Siparişler
            </Title>
            <Text className="text-sm text-gray-500">Toplam 520 sipariş</Text>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByPlatform} margin={{ top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                >
                  {ordersByPlatform.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Aylık Gelir Trendi */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Title as="h3" className="text-lg">
              Aylık Gelir Trendi
            </Title>
            <Text className="text-sm text-gray-500">Son 6 ayın performansı</Text>
          </div>
          <div className="rounded-lg bg-green-50 px-3 py-1.5 dark:bg-green-900/20">
            <Text className="text-sm font-semibold text-green-600 dark:text-green-400">
              +24.5% ↑
            </Text>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="ay" 
                className="text-xs text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="gelir" 
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Title as="h3" className="mb-1 text-lg font-semibold">
              Son Siparişler
            </Title>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              En son eklenen siparişleriniz
            </Text>
          </div>
          <button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
            Tümünü Gör →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100 dark:border-gray-700">
                <th className="pb-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Sipariş No
                </th>
                <th className="pb-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Müşteri
                </th>
                <th className="pb-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Platform
                </th>
                <th className="pb-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Tutar
                </th>
                <th className="pb-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
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
              <OrderRow
                orderNo="#HB-45678"
                customer="Can Öztürk"
                platform="Hepsiburada"
                amount="₺892.30"
                status="Onaylandı"
                statusColor="bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400"
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
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 opacity-50 transition-transform group-hover:scale-150 dark:from-blue-900/20 dark:to-purple-900/20"></div>
      
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className={cn('rounded-xl p-3 shadow-sm', iconClassName)}>
            {icon}
          </div>
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
              isPositive 
                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
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
        <Text className="mb-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</Text>
        <Title as="h3" className="font-lexend text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </Title>
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
  const platformColors: Record<string, string> = {
    'Trendyol': 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    'Hepsiburada': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    'N11': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  };

  return (
    <tr className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
      <td className="py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {orderNo}
      </td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs font-semibold text-white">
            {customer.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">{customer}</span>
        </div>
      </td>
      <td className="py-4">
        <span className={cn(
          'inline-flex rounded-lg px-2.5 py-1 text-xs font-medium',
          platformColors[platform] || 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
        )}>
          {platform}
        </span>
      </td>
      <td className="py-4 text-sm font-bold text-gray-900 dark:text-gray-100">
        {amount}
      </td>
      <td className="py-4">
        <span
          className={cn(
            'inline-flex rounded-full px-3 py-1.5 text-xs font-semibold',
            statusColor
          )}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}

