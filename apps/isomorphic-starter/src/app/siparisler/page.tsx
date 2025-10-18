'use client';

import { useState, useEffect } from 'react';
import { Title, Text, Button, Input, Badge, Popover } from 'rizzui';
import Pagination from '@core/ui/pagination';
import cn from '@core/utils/class-names';
import {
  PiMagnifyingGlassBold,
  PiShoppingCart,
  PiPlus,
  PiEye,
  PiTruck,
  PiCurrencyDollar,
  PiPackage,
  PiCheckCircle,
  PiClock,
  PiSpinnerGapBold,
  PiDownloadSimple,
  PiFileXls,
  PiFilePdf,
} from 'react-icons/pi';
import {
  getSiparisler,
  getSiparisIstatistikleri,
  deleteSiparis,
  updateSiparisDurum,
  type Siparis,
} from '@/services/siparis.service';
import { useTabloPagination } from '@/hooks/use-table-pagination';
import { useDosyaAktar, type KolonTanimi } from '@/hooks/use-dosya-aktar';
import toast from 'react-hot-toast';

export default function SiparisYonetimiPage() {
  const [siparisler, setSiparisler] = useState<Siparis[]>([]);
  const [filteredSiparisler, setFilteredSiparisler] = useState<Siparis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [istatistikler, setIstatistikler] = useState<any>(null);

  useEffect(() => {
    loadSiparisler();
    loadIstatistikler();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = siparisler.filter(
        (siparis) =>
          siparis.siparis_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          siparis.musteri_adi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          siparis.musteri_soyadi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          siparis.musteri_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          siparis.kargo_takip_no?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSiparisler(filtered);
    } else {
      setFilteredSiparisler(siparisler);
    }
  }, [searchTerm, siparisler]);

  // Sayfalama
  const {
    sayfaliVeri,
    sayfalamaProplari,
    baslangicIndex,
    bitisIndex,
    toplamKayit,
  } = useTabloPagination(filteredSiparisler, { sayfaBoyutu: 20 });

  // Dosya aktarma
  const { dosyaAktar } = useDosyaAktar<Siparis>();

  const aktarKolonlari: KolonTanimi<Siparis>[] = [
    { baslik: 'Sipariş No', alan: 'siparis_no', genislik: 15 },
    { baslik: 'Müşteri', alan: (s) => `${s.musteri_adi || ''} ${s.musteri_soyadi || ''}`.trim() || '-', genislik: 25 },
    { baslik: 'Email', alan: (s) => s.musteri_email || '-', genislik: 30 },
    { baslik: 'Telefon', alan: (s) => s.musteri_telefon || '-', genislik: 15 },
    { baslik: 'Mağaza', alan: (s) => s.sanal_magaza?.magaza_adi || '-', genislik: 20 },
    { baslik: 'Toplam Tutar', alan: (s) => `₺${Number(s.toplam_tutar).toFixed(2)}`, genislik: 12 },
    { baslik: 'Durum', alan: 'durum', genislik: 15 },
    { baslik: 'Ödeme Durumu', alan: 'odeme_durumu', genislik: 15 },
    { baslik: 'Sipariş Tarihi', alan: (s) => new Date(s.siparis_tarihi).toLocaleDateString('tr-TR'), genislik: 15 },
  ];

  const handleDosyaAktar = (tip: 'excel' | 'pdf') => {
    try {
      dosyaAktar(tip, filteredSiparisler, aktarKolonlari, {
        dosyaAdi: 'siparisler',
        sayfaAdi: 'Siparişler',
        baslik: 'Sipariş Listesi',
        altBaslik: `Toplam ${filteredSiparisler.length} sipariş`,
      });

      const tipAdi = tip === 'excel' ? 'Excel' : 'PDF';
      toast.success(`${filteredSiparisler.length} sipariş ${tipAdi} dosyasına aktarıldı!`);
    } catch (error) {
      toast.error('Dosya aktarımı başarısız!');
    }
  };

  const loadSiparisler = async () => {
    try {
      setLoading(true);
      const data = await getSiparisler();
      setSiparisler(data);
      setFilteredSiparisler(data);
    } catch (error) {
      console.error('Sipariş yükleme hatası:', error);
      toast.error('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadIstatistikler = async () => {
    try {
      const data = await getSiparisIstatistikleri();
      setIstatistikler(data);
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  };

  const handleDurumDegistir = async (id: number, yeniDurum: string) => {
    try {
      await updateSiparisDurum(id, yeniDurum);
      toast.success('Sipariş durumu güncellendi');
      loadSiparisler();
    } catch (error) {
      toast.error('Durum güncellenemedi');
    }
  };

  // İstatistikler
  const stats = {
    toplamSiparis: siparisler.length,
    toplamCiro: siparisler.reduce((sum, s) => sum + Number(s.toplam_tutar), 0),
    beklemedeSiparis: siparisler.filter((s) => s.durum === 'Beklemede').length,
    teslimEdilen: siparisler.filter((s) => s.durum === 'Teslim Edildi').length,
  };

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title className="mb-2">Sipariş Yönetimi</Title>
          <Text className="text-sm text-gray-500">
            Tüm siparişlerinizi buradan yönetebilirsiniz
          </Text>
        </div>
        <div className="flex gap-3">
          {/* Dışa Aktar Dropdown */}
          <Popover placement="bottom-end" shadow="sm">
            <Popover.Trigger>
              <Button
                variant="outline"
                className="w-full @lg:w-auto"
                disabled={filteredSiparisler.length === 0}
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
            Yeni Sipariş
          </Button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="mb-6 grid gap-5 @lg:grid-cols-2 @3xl:grid-cols-4">
        <StatCard
          title="Toplam Sipariş"
          value={stats.toplamSiparis.toLocaleString('tr-TR')}
          icon={<PiShoppingCart className="h-6 w-6" />}
          iconBg="bg-blue-100 dark:bg-blue-600/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Toplam Ciro"
          value={`₺${stats.toplamCiro.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          icon={<PiCurrencyDollar className="h-6 w-6" />}
          iconBg="bg-green-100 dark:bg-green-600/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Bekleyen"
          value={stats.beklemedeSiparis.toString()}
          icon={<PiClock className="h-6 w-6" />}
          iconBg="bg-orange-100 dark:bg-orange-600/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          title="Teslim Edilen"
          value={stats.teslimEdilen.toString()}
          icon={<PiCheckCircle className="h-6 w-6" />}
          iconBg="bg-purple-100 dark:bg-purple-600/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Arama */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Sipariş no, müşteri adı, email veya kargo takip numarası ile ara..."
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
          <Text className="ml-3">Siparişler yükleniyor...</Text>
        </div>
      )}

      {/* Tablo */}
      {!loading && (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-left text-sm font-semibold">Sipariş No</th>
                  <th className="p-4 text-left text-sm font-semibold">Müşteri</th>
                  <th className="p-4 text-left text-sm font-semibold">Mağaza</th>
                  <th className="p-4 text-left text-sm font-semibold">Tutar</th>
                  <th className="p-4 text-left text-sm font-semibold">Durum</th>
                  <th className="p-4 text-left text-sm font-semibold">Ödeme</th>
                  <th className="p-4 text-left text-sm font-semibold">Tarih</th>
                  <th className="p-4 text-right text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredSiparisler.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      {searchTerm
                        ? 'Arama kriterlerinize uygun sipariş bulunamadı'
                        : 'Henüz sipariş bulunmuyor'}
                    </td>
                  </tr>
                ) : (
                  sayfaliVeri.map((siparis) => (
                    <SiparisRow
                      key={siparis.id}
                      siparis={siparis}
                      onDurumDegistir={handleDurumDegistir}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredSiparisler.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700">
              <div className="flex flex-col items-center justify-between gap-4 @md:flex-row">
                <Text className="text-sm text-gray-500">
                  {baslangicIndex}-{bitisIndex} arası gösteriliyor (Toplam{' '}
                  {toplamKayit.toLocaleString('tr-TR')} sipariş)
                </Text>

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

function SiparisRow({
  siparis,
  onDurumDegistir,
}: {
  siparis: Siparis;
  onDurumDegistir: (id: number, durum: string) => void;
}) {
  const getDurumBadge = (durum: string) => {
    const durumMap: Record<string, string> = {
      'Beklemede': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600/20 dark:text-yellow-400',
      'Onaylandı': 'bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400',
      'Hazırlanıyor': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-600/20 dark:text-cyan-400',
      'Kargoya Verildi': 'bg-orange-100 text-orange-700 dark:bg-orange-600/20 dark:text-orange-400',
      'Teslim Edildi': 'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400',
      'İptal': 'bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400',
    };
    return durumMap[durum] || 'bg-gray-100 text-gray-700';
  };

  const getOdemeBadge = (odeme: string) => {
    const odemeMap: Record<string, string> = {
      'Ödendi': 'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400',
      'Ödenmedi': 'bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400',
      'İade': 'bg-gray-100 text-gray-700 dark:bg-gray-600/20 dark:text-gray-400',
    };
    return odemeMap[odeme] || 'bg-gray-100 text-gray-700';
  };

  return (
    <tr className="border-b border-gray-100 last:border-0 dark:border-gray-700/50">
      <td className="p-4">
        <Text className="font-mono text-sm font-medium">{siparis.siparis_no}</Text>
        {siparis.kargo_takip_no && (
          <Text className="text-xs text-gray-500">
            <PiTruck className="mr-1 inline h-3 w-3" />
            {siparis.kargo_takip_no}
          </Text>
        )}
      </td>
      <td className="p-4">
        <Text className="font-medium">
          {siparis.musteri_adi} {siparis.musteri_soyadi}
        </Text>
        {siparis.musteri_email && (
          <Text className="text-xs text-gray-500">{siparis.musteri_email}</Text>
        )}
      </td>
      <td className="p-4">
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400">
          {siparis.sanal_magaza?.magaza_adi || '-'}
        </Badge>
      </td>
      <td className="p-4">
        <Text className="font-semibold">
          ₺{Number(siparis.toplam_tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </Text>
        <Text className="text-xs text-gray-500">
          {siparis.detaylar?.length || 0} ürün
        </Text>
      </td>
      <td className="p-4">
        <Badge className={cn(getDurumBadge(siparis.durum))}>
          {siparis.durum}
        </Badge>
      </td>
      <td className="p-4">
        <Badge className={cn(getOdemeBadge(siparis.odeme_durumu))}>
          {siparis.odeme_durumu}
        </Badge>
        {siparis.odeme_yontemi && (
          <Text className="text-xs text-gray-500">{siparis.odeme_yontemi}</Text>
        )}
      </td>
      <td className="p-4">
        <Text className="text-sm">
          {new Date(siparis.siparis_tarihi).toLocaleDateString('tr-TR')}
        </Text>
        <Text className="text-xs text-gray-500">
          {new Date(siparis.siparis_tarihi).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" className="hover:border-blue-600 hover:text-blue-600">
            <PiEye className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

