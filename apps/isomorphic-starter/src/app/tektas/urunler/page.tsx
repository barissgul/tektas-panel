'use client';

import { useState, useEffect } from 'react';
import { Title, Text, Button, Input } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  PiMagnifyingGlassBold,
  PiPackageDuotone,
  PiDownloadBold,
  PiCurrencyDollarDuotone,
  PiChartBarDuotone,
} from 'react-icons/pi';
import { getTektasStoklar, type TektasStok } from '@/services/tektas.service';

export default function TektasPage() {
  const [stoklar, setStoklar] = useState<TektasStok[]>([]);
  const [filteredStoklar, setFilteredStoklar] = useState<TektasStok[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toplamKayit, setToplamKayit] = useState(0);

  useEffect(() => {
    loadStoklar();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = stoklar.filter(
        (stok) =>
          stok.KODU.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stok.STOK.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stok.OEM_KODU.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stok.PARCA_MARKA.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStoklar(filtered);
    } else {
      setFilteredStoklar(stoklar);
    }
  }, [searchTerm, stoklar]);

  const loadStoklar = async () => {
    try {
      setLoading(true);
      const data = await getTektasStoklar();
      if (!data.HATA) {
        setStoklar(data.DATA);
        setFilteredStoklar(data.DATA);
        setToplamKayit(data.TOPLAM_KAYIT);
      }
    } catch (error) {
      console.error('Stok yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // İstatistikler
  const stats = {
    toplam: toplamKayit,
    doluRaf: stoklar.filter(s => s.RAF_YER).length,
    toplamDeger: stoklar.reduce((sum, s) => {
      const fiyat = parseFloat(s.SATIS_FIYAT) || 0;
      const adet = parseFloat(s.KALAN_ADET) || 0;
      return sum + (fiyat * adet);
    }, 0),
    kategoriler: new Set(stoklar.map(s => s.KATEGORI)).size,
  };

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center">
            <PiPackageDuotone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <Title as="h2" className="!text-2xl">
              Tektas Stok Yönetimi
            </Title>
            <Text className="text-gray-500">
              Mevcut stok durumu ve ürün bilgileri
            </Text>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-4">
        <StatCard
          title="Toplam Ürün"
          value={stats.toplam.toLocaleString('tr-TR')}
          icon={<PiPackageDuotone className="h-6 w-6" />}
          iconBg="bg-blue-100 dark:bg-blue-600/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Raflı Ürün"
          value={stats.doluRaf.toLocaleString('tr-TR')}
          icon={<PiChartBarDuotone className="h-6 w-6" />}
          iconBg="bg-purple-100 dark:bg-purple-600/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Toplam Değer"
          value={`₺${stats.toplamDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<PiCurrencyDollarDuotone className="h-6 w-6" />}
          iconBg="bg-green-100 dark:bg-green-600/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Kategori"
          value={stats.kategoriler.toLocaleString('tr-TR')}
          icon={<PiChartBarDuotone className="h-6 w-6" />}
          iconBg="bg-orange-100 dark:bg-orange-600/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Search & Actions */}
      <div className="mb-6 flex flex-col gap-4 @xl:flex-row @xl:items-center @xl:justify-between">
        <div className="flex-1 @xl:max-w-md">
          <Input
            type="text"
            placeholder="Ürün kodu, OEM kodu, marka ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            className="w-full"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadStoklar}>
            <PiDownloadBold className="mr-2 h-4 w-4" />
            Yenile
          </Button>
          <Button>
            Excel İndir
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <Text className="mt-3 text-gray-500">Yükleniyor...</Text>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-left text-sm font-semibold">Stok Kodu</th>
                  <th className="p-4 text-left text-sm font-semibold">Ürün Adı</th>
                  <th className="p-4 text-left text-sm font-semibold">OEM Kodu</th>
                  <th className="p-4 text-left text-sm font-semibold">Marka</th>
                  <th className="p-4 text-left text-sm font-semibold">Kategori</th>
                  <th className="p-4 text-left text-sm font-semibold">Stok</th>
                  <th className="p-4 text-left text-sm font-semibold">Fiyat</th>
                  <th className="p-4 text-left text-sm font-semibold">Raf</th>
                </tr>
              </thead>
              <tbody>
                {filteredStoklar.slice(0, 50).map((stok) => (
                  <StokRow key={stok.ID} stok={stok} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Info Footer */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Text className="text-sm text-gray-500">
                {searchTerm
                  ? `${filteredStoklar.length} sonuç gösteriliyor`
                  : `İlk 50 ürün gösteriliyor (Toplam ${toplamKayit.toLocaleString('tr-TR')})`}
              </Text>
              {searchTerm && filteredStoklar.length > 50 && (
                <Text className="text-sm text-gray-500">
                  {filteredStoklar.length - 50} ürün daha var
                </Text>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
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
      </div>
      <Title as="h4" className="mb-1 text-2xl">
        {value}
      </Title>
      <Text className="text-sm text-gray-500">{title}</Text>
    </div>
  );
}

function StokRow({ stok }: { stok: TektasStok }) {
  const stokMiktari = parseFloat(stok.KALAN_ADET) || 0;
  const stokDurumu =
    stokMiktari === 0 ? 'out' : stokMiktari < 10 ? 'low' : 'ok';

  const stokColors = {
    ok: 'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400',
    low: 'bg-orange-100 text-orange-700 dark:bg-orange-600/20 dark:text-orange-400',
    out: 'bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400',
  };

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-700/50">
      <td className="p-4">
        <Text className="font-mono text-sm font-medium">{stok.KODU}</Text>
      </td>
      <td className="p-4">
        <Text className="text-sm">{stok.STOK}</Text>
        {stok.ACIKLAMA && (
          <Text className="text-xs text-gray-500">{stok.ACIKLAMA}</Text>
        )}
      </td>
      <td className="p-4">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {stok.OEM_KODU || '-'}
        </Text>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Text className="text-sm">{stok.PARCA_MARKA}</Text>
          {stok.MARKA && stok.MARKA !== stok.PARCA_MARKA && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
              {stok.MARKA}
            </span>
          )}
        </div>
      </td>
      <td className="p-4">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {stok.KATEGORI || '-'}
        </Text>
      </td>
      <td className="p-4">
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
            stokColors[stokDurumu]
          )}
        >
          {stok.KALAN_ADET}
        </span>
      </td>
      <td className="p-4">
        <Text className="font-semibold">
          {stok.SATIS_FIYAT && parseFloat(stok.SATIS_FIYAT) > 0
            ? `₺${parseFloat(stok.SATIS_FIYAT).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
            : '-'}
        </Text>
      </td>
      <td className="p-4">
        <Text className="text-sm font-mono text-gray-600 dark:text-gray-400">
          {stok.RAF_YER || '-'}
        </Text>
      </td>
    </tr>
  );
}

