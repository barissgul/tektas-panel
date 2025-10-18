'use client';

import { useState, useEffect, useCallback } from 'react';
import { Title, Text, Button, Input, Badge, Modal } from 'rizzui';
import Pagination from '@core/ui/pagination';
import cn from '@core/utils/class-names';
import {
  PiMagnifyingGlassBold,
  PiPlusCircleDuotone,
  PiPencilSimpleDuotone,
  PiTrashDuotone,
  PiPackageDuotone,
} from 'react-icons/pi';
import {
  getParcaMarkalar,
  deleteParcaMarka,
  type ParcaMarka,
} from '@/services/urun-marka.service';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { useDebounce } from 'core/src/hooks/use-debounce';
import { useTabloPagination } from '@/hooks/use-table-pagination';

export default function ParcaMarkalarPage() {
  const [tumParcaMarkalar, setTumParcaMarkalar] = useState<ParcaMarka[]>([]);
  const [filteredParcaMarkalar, setFilteredParcaMarkalar] = useState<
    ParcaMarka[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    parcaMarka: ParcaMarka | null;
  }>({
    isOpen: false,
    parcaMarka: null,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Tüm parça markaları yükle
  const loadParcaMarkalar = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getParcaMarkalar();
      setTumParcaMarkalar(response.data);
      setFilteredParcaMarkalar(response.data);
    } catch (error) {
      console.error('Parça marka yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    loadParcaMarkalar();
  }, [loadParcaMarkalar]);

  // Arama filtresi
  useEffect(() => {
    if (debouncedSearch) {
      const filtered = tumParcaMarkalar.filter(
        (parcaMarka) =>
          parcaMarka.parca_marka
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          parcaMarka.mensei
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          parcaMarka.parca_turu
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase())
      );
      setFilteredParcaMarkalar(filtered);
    } else {
      setFilteredParcaMarkalar(tumParcaMarkalar);
    }
  }, [debouncedSearch, tumParcaMarkalar]);

  // Sayfalama hook'u
  const {
    sayfaliVeri,
    sayfalamaProplari,
    baslangicIndex,
    bitisIndex,
    toplamKayit,
  } = useTabloPagination(filteredParcaMarkalar, { sayfaBoyutu: 20 });

  const handleDelete = async () => {
    if (!deleteModal.parcaMarka) return;

    const success = await deleteParcaMarka(deleteModal.parcaMarka.id);
    if (success) {
      loadParcaMarkalar();
    }
    setDeleteModal({ isOpen: false, parcaMarka: null });
  };

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-600/20">
              <PiPackageDuotone className="h-7 w-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <Title as="h2" className="!text-2xl">
                Ürün Marka Yönetimi
              </Title>
              <Text className="text-gray-500">
                Tüm ürün markalarını yönetin
              </Text>
            </div>
          </div>
          <Link href={routes.tanimlama.createUrunMarka}>
            <Button>
              <PiPlusCircleDuotone className="mr-2 h-5 w-5" />
              Yeni Ürün Marka Ekle
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mb-6">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <Title as="h4" className="mb-1 text-2xl">
                {toplamKayit.toLocaleString('tr-TR')}
              </Title>
              <Text className="text-sm text-gray-500">
                {searchTerm ? 'Filtrelenmiş Ürün Marka' : 'Toplam Aktif Ürün Marka'}
              </Text>
            </div>
            <div className="text-right">
              <Text className="text-sm text-gray-500">
                {baslangicIndex}-{bitisIndex} arası gösteriliyor
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Ürün marka, menşei veya tür ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          className="w-full @xl:max-w-md"
        />
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
        <>
          {filteredParcaMarkalar.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <PiPackageDuotone className="mx-auto h-12 w-12 text-gray-400" />
                <Text className="mt-3 text-gray-500">
                  {searchTerm
                    ? 'Ürün marka bulunamadı'
                    : 'Henüz ürün marka eklenmemiş'}
                </Text>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4 text-left text-sm font-semibold">
                          Ürün Marka
                        </th>
                        <th className="p-4 text-left text-sm font-semibold">
                          Menşei
                        </th>
                        <th className="p-4 text-left text-sm font-semibold">
                          Ürün Türü
                        </th>
                        <th className="p-4 text-left text-sm font-semibold">
                          Durum
                        </th>
                        <th className="p-4 text-right text-sm font-semibold">
                          İşlem
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfaliVeri.map((parcaMarka) => (
                        <ParcaMarkaRow
                          key={parcaMarka.id}
                          parcaMarka={parcaMarka}
                          onDelete={(parcaMarka) =>
                            setDeleteModal({ isOpen: true, parcaMarka })
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                {toplamKayit > sayfalamaProplari.pageSize && (
                  <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700">
                    <div className="flex flex-col items-center justify-between gap-4 @md:flex-row">
                      <Text className="text-sm text-gray-500">
                        {baslangicIndex}-{bitisIndex} arası gösteriliyor
                        (Toplam {toplamKayit.toLocaleString('tr-TR')} ürün marka)
                      </Text>

                      <Pagination {...sayfalamaProplari} />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, parcaMarka: null })}
      >
        <div className="p-6">
          <Title as="h3" className="mb-4">
            Ürün Markayı Sil
          </Title>
          <Text className="mb-6">
            <strong>{deleteModal.parcaMarka?.parca_marka}</strong> ürün
            markasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </Text>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, parcaMarka: null })}
            >
              İptal
            </Button>
            <Button color="danger" onClick={handleDelete}>
              Sil
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ParcaMarkaRow({
  parcaMarka,
  onDelete,
}: {
  parcaMarka: ParcaMarka;
  onDelete: (parcaMarka: ParcaMarka) => void;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 dark:border-gray-700/50">
      <td className="p-4">
        <Text className="font-semibold">{parcaMarka.parca_marka}</Text>
      </td>
      <td className="p-4">
        <Text className="text-gray-600 dark:text-gray-400">
          {parcaMarka.mensei || '-'}
        </Text>
      </td>
      <td className="p-4">
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400">
          {parcaMarka.parca_turu || '-'}
        </Badge>
      </td>
      <td className="p-4">
        <Badge
          color={parcaMarka.durum == 1 ? 'success' : 'danger'}
          variant="flat"
          size="sm"
        >
          {parcaMarka.durum == 1 ? 'Aktif' : 'Pasif'}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={routes.tanimlama.editUrunMarka(parcaMarka.id.toString())}
          >
            <Button size="sm" variant="outline">
              <PiPencilSimpleDuotone className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="flat"
            color="danger"
            onClick={() => onDelete(parcaMarka)}
          >
            <PiTrashDuotone className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

