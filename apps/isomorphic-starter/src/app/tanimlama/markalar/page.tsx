'use client';

import { useState, useEffect, useCallback } from 'react';
import { Title, Text, Button, Input, Badge, Modal, ActionIcon } from 'rizzui';
import Pagination from '@core/ui/pagination';
import cn from '@core/utils/class-names';
import {
  PiMagnifyingGlassBold,
  PiPlusCircleDuotone,
  PiPencilSimpleDuotone,
  PiTrashDuotone,
  PiImageDuotone,
} from 'react-icons/pi';
import { getMarkalar, deleteMarka, type Marka } from '@/services/marka.service';
import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { useDebounce } from 'core/src/hooks/use-debounce';

export default function MarkalarPage() {
  const [markalar, setMarkalar] = useState<Marka[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; marka: Marka | null }>({
    isOpen: false,
    marka: null,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadMarkalar = useCallback(async (page: number, search?: string) => {
    try {
      setLoading(true);
      const response = await getMarkalar(page, pageSize, search);
      setMarkalar(response.data);
      setTotalItems(response.meta.total);
    } catch (error) {
      console.error('Marka yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    loadMarkalar(1, debouncedSearch);
    setCurrentPage(1);
  }, [debouncedSearch, loadMarkalar]);

  useEffect(() => {
    if (currentPage > 1) {
      loadMarkalar(currentPage, debouncedSearch);
    }
  }, [currentPage, debouncedSearch, loadMarkalar]);

  const handleDelete = async () => {
    if (!deleteModal.marka) return;
    
    const success = await deleteMarka(deleteModal.marka.id);
    if (success) {
      loadMarkalar(currentPage, debouncedSearch);
    }
    setDeleteModal({ isOpen: false, marka: null });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-600/20 flex items-center justify-center">
              <PiImageDuotone className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <Title as="h2" className="!text-2xl">
                Marka Yönetimi
              </Title>
              <Text className="text-gray-500">
                Markalar ve logoları
              </Text>
            </div>
          </div>
          <Link href={routes.tanimlama.createMarka}>
            <Button>
              <PiPlusCircleDuotone className="mr-2 h-5 w-5" />
              Yeni Marka Ekle
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
                {totalItems.toLocaleString('tr-TR')}
              </Title>
              <Text className="text-sm text-gray-500">Toplam Aktif Marka</Text>
            </div>
            <div className="text-right">
              <Text className="text-sm text-gray-500">
                Sayfa {currentPage} / {Math.ceil(totalItems / pageSize)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Marka ara..."
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

      {/* Grid */}
      {!loading && (
        <>
          {markalar.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <PiImageDuotone className="mx-auto h-12 w-12 text-gray-400" />
                <Text className="mt-3 text-gray-500">
                  {searchTerm ? 'Marka bulunamadı' : 'Henüz marka eklenmemiş'}
                </Text>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 @xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4">
                {markalar.map((marka) => (
                  <MarkaCard
                    key={marka.id}
                    marka={marka}
                    onDelete={(marka) => setDeleteModal({ isOpen: true, marka })}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalItems > pageSize && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    total={totalItems}
                    pageSize={pageSize}
                    current={currentPage}
                    onChange={handlePageChange}
                    showLessItems={true}
                    prevIconClassName="py-0 text-gray-500 !leading-[26px]"
                    nextIconClassName="py-0 text-gray-500 !leading-[26px]"
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, marka: null })}>
        <div className="p-6">
          <Title as="h3" className="mb-4">
            Markayı Sil
          </Title>
          <Text className="mb-6">
            <strong>{deleteModal.marka?.marka}</strong> markasını silmek istediğinize emin misiniz?
            Bu işlem geri alınamaz.
          </Text>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, marka: null })}
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

function MarkaCard({
  marka,
  onDelete,
}: {
  marka: Marka;
  onDelete: (marka: Marka) => void;
}) {
  // URL geçerliliğini kontrol et
  const isValidUrl = (url: string | undefined) => {
    if (!url || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const hasValidImage = isValidUrl(marka.resim_url);

  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-5 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* Badge */}
      <div className="absolute top-3 right-3">
        <Badge
          color={marka.durum == 1 ? 'success' : 'danger'}
          variant="flat"
          size="sm"
        >
          {marka.durum == 1 ? 'Aktif' : 'Pasif'}
        </Badge>
      </div>

      {/* Logo */}
      <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700/50">
        {hasValidImage ? (
          <div className="relative h-full w-full p-4">
            <Image
              src={marka.resim_url!}
              alt={marka.marka}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <PiImageDuotone className="h-12 w-12 text-gray-400" />
        )}
      </div>

      {/* İsim */}
      <Title as="h4" className="mb-4 text-center text-lg">
        {marka.marka}
      </Title>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={routes.tanimlama.editMarka(marka.id.toString())} className="flex-1">
          <Button variant="outline" className="w-full">
            <PiPencilSimpleDuotone className="mr-2 h-4 w-4" />
            Düzenle
          </Button>
        </Link>
        <Button
          variant="flat"
          color="danger"
          onClick={() => onDelete(marka)}
          className="px-3"
        >
          <PiTrashDuotone className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

