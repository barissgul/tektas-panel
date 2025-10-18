'use client';

import { useState, useEffect } from 'react';
import { Title, Text, Button, Input, Badge, Popover, ActionIcon } from 'rizzui';
import Pagination from '@core/ui/pagination';
import cn from '@core/utils/class-names';
import {
  PiMagnifyingGlassBold,
  PiPackage,
  PiPlus,
  PiPencilSimple,
  PiTrash,
  PiWarningCircle,
  PiCurrencyDollarDuotone,
  PiArchiveDuotone,
  PiSpinnerGapBold,
  PiDownloadSimple,
  PiFileXls,
  PiFilePdf,
} from 'react-icons/pi';
import { getUrunler, deleteUrun, type Urun } from '@/services/urun.service';
import { useTabloPagination } from '@/hooks/use-table-pagination';
import { useDosyaAktar, type KolonTanimi } from '@/hooks/use-dosya-aktar';
import toast from 'react-hot-toast';

export default function UrunYonetimiPage() {
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [filteredUrunler, setFilteredUrunler] = useState<Urun[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUrunler();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = urunler.filter(
        (urun) =>
          urun.urun_adi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          urun.urun_kodu.toLowerCase().includes(searchTerm.toLowerCase()) ||
          urun.barkod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          urun.kategori?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          urun.marka?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUrunler(filtered);
    } else {
      setFilteredUrunler(urunler);
    }
  }, [searchTerm, urunler]);

  // ✨ Sayfalama hook'u - tek satırda sayfalama!
  const {
    sayfaliVeri,
    sayfalamaProplari,
    baslangicIndex,
    bitisIndex,
    toplamKayit,
  } = useTabloPagination(filteredUrunler, { sayfaBoyutu: 20 });

  // ✨ Dosya aktarma hook'u (Excel & PDF)
  const { dosyaAktar } = useDosyaAktar<Urun>();

  // Kolonları tanımla
  const aktarKolonlari: KolonTanimi<Urun>[] = [
    { baslik: 'Ürün Kodu', alan: 'urun_kodu', genislik: 15 },
    { baslik: 'Ürün Adı', alan: 'urun_adi', genislik: 40 },
    { baslik: 'Mağaza', alan: (u) => u.sanal_magaza?.magaza_adi || '-', genislik: 20 },
    { baslik: 'Kategori', alan: (u) => u.kategori || '-', genislik: 20 },
    { baslik: 'Marka', alan: (u) => u.marka || '-', genislik: 20 },
    { baslik: 'Barkod', alan: (u) => u.barkod || '-', genislik: 15 },
    { baslik: 'Stok', alan: 'stok_miktari', genislik: 12 },
    { baslik: 'Min. Stok', alan: (u) => u.min_stok_miktari || 0, genislik: 12 },
    { baslik: 'Birim', alan: (u) => u.birim || 'Adet', genislik: 10 },
    { baslik: 'Fiyat', alan: (u) => `₺${Number(u.fiyat).toFixed(2)}`, genislik: 12 },
    { baslik: 'Maliyet', alan: (u) => u.maliyet ? `₺${Number(u.maliyet).toFixed(2)}` : '-', genislik: 12 },
    { baslik: 'Durum', alan: (u) => u.durum === 1 ? 'Aktif' : 'Pasif', genislik: 10 },
  ];

  const handleDosyaAktar = (tip: 'excel' | 'pdf') => {
    try {
      dosyaAktar(tip, filteredUrunler, aktarKolonlari, {
        dosyaAdi: 'urunler',
        sayfaAdi: 'Ürünler',
        baslik: 'Ürün Listesi',
        altBaslik: `Toplam ${filteredUrunler.length} ürün`,
      });
      
      const tipAdi = tip === 'excel' ? 'Excel' : 'PDF';
      toast.success(`${filteredUrunler.length} ürün ${tipAdi} dosyasına aktarıldı!`);
    } catch (error) {
      toast.error('Dosya aktarımı başarısız!');
    }
  };

  const loadUrunler = async () => {
    try {
      setLoading(true);
      const data = await getUrunler();
      setUrunler(data);
      setFilteredUrunler(data);
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
      toast.error('Ürünler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const success = await deleteUrun(id);
      if (success) {
        toast.success('Ürün başarıyla silindi');
        loadUrunler();
      } else {
        toast.error('Ürün silinemedi');
      }
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      toast.error('Ürün silinirken bir hata oluştu');
    }
  };

  // İstatistikler
  const stats = {
    toplam: urunler.length,
    toplamStok: urunler.reduce((sum, u) => sum + u.stok_miktari, 0),
    toplamDeger: urunler.reduce((sum, u) => sum + u.fiyat * u.stok_miktari, 0),
    dusukStok: urunler.filter(
      (u) => u.min_stok_miktari && u.stok_miktari <= u.min_stok_miktari
    ).length,
  };

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title className="mb-2">Ürün Yönetimi</Title>
          <Text className="text-sm text-gray-500">
            Tüm ürünlerinizi buradan yönetebilirsiniz
          </Text>
        </div>
        <div className="flex gap-3">
          {/* Dosya Aktarma Dropdown */}
          <Popover
            placement="bottom-end"
            shadow="sm"
          >
            <Popover.Trigger>
              <Button 
                variant="outline" 
                className="w-full @lg:w-auto"
                disabled={filteredUrunler.length === 0}
              >
                <PiDownloadSimple className="mr-2 h-4 w-4" />
                Dışa Aktar
              </Button>
            </Popover.Trigger>
            <Popover.Content className="z-50 p-0 dark:bg-gray-100 [&>svg]:dark:fill-gray-100">
              <div className="w-40">
                <button
                  onClick={() => handleDosyaAktar('excel')}
                  className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-50"
                >
                  <PiFileXls className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Excel</span>
                </button>
                <button
                  onClick={() => handleDosyaAktar('pdf')}
                  className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-50"
                >
                  <PiFilePdf className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium">PDF</span>
                </button>
              </div>
            </Popover.Content>
          </Popover>

          <Button className="w-full @lg:w-auto">
            <PiPlus className="mr-2 h-4 w-4" />
            Yeni Ürün Ekle
          </Button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="mb-6 grid gap-5 @lg:grid-cols-2 @3xl:grid-cols-4">
        <StatCard
          title="Toplam Ürün"
          value={stats.toplam.toLocaleString('tr-TR')}
          icon={<PiPackage className="h-6 w-6" />}
          iconBg="bg-blue-100 dark:bg-blue-600/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Toplam Stok"
          value={stats.toplamStok.toLocaleString('tr-TR')}
          icon={<PiArchiveDuotone className="h-6 w-6" />}
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
          title="Düşük Stok"
          value={stats.dusukStok.toString()}
          icon={<PiWarningCircle className="h-6 w-6" />}
          iconBg="bg-orange-100 dark:bg-orange-600/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Arama */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Ürün adı, kodu, barkod, kategori veya marka ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          clearable
          onClear={() => setSearchTerm('')}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-12 dark:border-gray-700 dark:bg-gray-800">
          <PiSpinnerGapBold className="h-8 w-8 animate-spin text-blue-600" />
          <Text className="ml-3">Ürünler yükleniyor...</Text>
        </div>
      )}

      {/* Tablo */}
      {!loading && (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-left text-sm font-semibold">Ürün Kodu</th>
                  <th className="p-4 text-left text-sm font-semibold">Ürün Adı</th>
                  <th className="p-4 text-left text-sm font-semibold">Mağaza</th>
                  <th className="p-4 text-left text-sm font-semibold">Kategori</th>
                  <th className="p-4 text-left text-sm font-semibold">Marka</th>
                  <th className="p-4 text-left text-sm font-semibold">Stok</th>
                  <th className="p-4 text-left text-sm font-semibold">Fiyat</th>
                  <th className="p-4 text-left text-sm font-semibold">Durum</th>
                  <th className="p-4 text-right text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredUrunler.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">
                      {searchTerm
                        ? 'Arama kriterlerinize uygun ürün bulunamadı'
                        : 'Henüz ürün eklenmemiş'}
                    </td>
                  </tr>
                ) : (
                  sayfaliVeri.map((urun) => (
                    <UrunRow
                      key={urun.id}
                      urun={urun}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredUrunler.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700">
              <div className="flex flex-col items-center justify-between gap-4 @md:flex-row">
                <Text className="text-sm text-gray-500">
                  {baslangicIndex}-{bitisIndex} arası gösteriliyor (Toplam {toplamKayit.toLocaleString('tr-TR')} ürün)
                </Text>

                {/* Sayfalama - Tek satır! */}
                {toplamKayit > sayfalamaProplari.pageSize && (
                  <Pagination {...sayfalamaProplari} />
                )}
              </div>
            </div>
          )}
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
      <div className="flex items-center justify-between">
        <div>
          <Text className="mb-1 text-sm text-gray-500">{title}</Text>
          <Text className="text-2xl font-bold">{value}</Text>
        </div>
        <div className={cn('rounded-lg p-3', iconBg)}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

function UrunRow({
  urun,
  onDelete,
}: {
  urun: Urun;
  onDelete: (id: number) => void;
}) {
  const isLowStock =
    urun.min_stok_miktari && urun.stok_miktari <= urun.min_stok_miktari;

  return (
    <tr className="border-b border-gray-100 last:border-0 dark:border-gray-700/50">
      <td className="p-4">
        <Text className="font-mono text-sm font-medium">{urun.urun_kodu}</Text>
        {urun.barkod && (
          <Text className="text-xs text-gray-500">{urun.barkod}</Text>
        )}
      </td>
      <td className="p-4">
        <Text className="font-medium">{urun.urun_adi}</Text>
      </td>
      <td className="p-4">
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400">
          {urun.sanal_magaza?.magaza_adi || '-'}
        </Badge>
      </td>
      <td className="p-4">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {urun.kategori || '-'}
        </Text>
      </td>
      <td className="p-4">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {urun.marka || '-'}
        </Text>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Text className={cn('font-medium', isLowStock && 'text-orange-600')}>
            {urun.stok_miktari}
          </Text>
          {isLowStock && (
            <PiWarningCircle className="h-4 w-4 text-orange-600" />
          )}
        </div>
        <Text className="text-xs text-gray-500">{urun.birim || 'Adet'}</Text>
      </td>
      <td className="p-4">
        <Text className="font-semibold">
          ₺{urun.fiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </Text>
        {urun.maliyet && (
          <Text className="text-xs text-gray-500">
            Maliyet: ₺
            {urun.maliyet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </Text>
        )}
      </td>
      <td className="p-4">
        <Badge
          className={cn(
            urun.durum === 1
              ? 'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-600/20 dark:text-gray-400'
          )}
        >
          {urun.durum === 1 ? 'Aktif' : 'Pasif'}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="hover:border-blue-600 hover:text-blue-600"
          >
            <PiPencilSimple className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="hover:border-red-600 hover:text-red-600"
            onClick={() => onDelete(urun.id)}
          >
            <PiTrash className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

