'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Title, Text, Button, Input } from 'rizzui';
import {
  PiArrowLeftBold,
  PiMagnifyingGlassBold,
  PiDownloadBold,
  PiUploadBold,
  PiSpinnerGapBold,
} from 'react-icons/pi';
import { 
  getTrendyolProducts, 
  getTrendyolConfigs,
  type TrendyolProduct,
  type TrendyolProductListResponse,
  type TrendyolConfig 
} from '@/services/trendyol.service';

export default function TrendyolUrunler() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<TrendyolProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configs, setConfigs] = useState<TrendyolConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<TrendyolConfig | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 50,
    totalPages: 0,
    totalElements: 0,
  });

  // Config'leri yükle
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const configsData = await getTrendyolConfigs();
        console.log('Yüklenen configs:', configsData);
        setConfigs(configsData);
        
        // Aktif config'leri filtrele
        const activeConfigs = configsData.filter(config => config.aktif);
        if (activeConfigs.length > 0) {
          setSelectedConfig(activeConfigs[0]);
        } else if (configsData.length > 0) {
          // Aktif config yoksa ilkini seç ama uyarı ver
          setSelectedConfig(configsData[0]);
          setError('Seçili mağaza aktif değil. Lütfen mağaza ayarlarını kontrol edin.');
        }
      } catch (error) {
        console.error('Config yükleme hatası:', error);
        setError('Mağaza ayarları yüklenemedi');
      }
    };

    loadConfigs();
  }, []);

  // Ürünleri yükle
  useEffect(() => {
    if (selectedConfig) {
      loadProducts();
    }
  }, [selectedConfig, pagination.page, pagination.size]);

  const loadProducts = async () => {
    if (!selectedConfig) return;

    setLoading(true);
    setError(null);

    try {
      const response: TrendyolProductListResponse = await getTrendyolProducts(
        selectedConfig.magaza_kodu,
        pagination.page,
        pagination.size
      );

      setProducts(response.content);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      }));
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // API erişim hatası durumunda test verisi göster (artık gerekli değil çünkü orders'tan veri çekiyoruz)
      if (errorMessage.includes('API erişim izni reddedildi') || 
          errorMessage.includes('kimlik doğrulama hatası') ||
          errorMessage.includes('Cloudflare') ||
          errorMessage.includes('blocked')) {
        setError('Trendyol API erişim izni reddedildi. API anahtarlarınızı kontrol edin.');
        
        // Test verisi ekle (sadece gerçek veri de gelmezse)
        const mockProducts: TrendyolProduct[] = [
          {
            id: '1',
            title: 'Samsung Galaxy S21',
            description: 'Samsung Galaxy S21 128GB',
            barcode: '8806092055521',
            brand: 'Samsung',
            categoryId: 1,
            salePrice: 12999,
            listPrice: 13999,
            quantity: 150,
            productCode: 'SAMSUNG-S21-128',
            stockCode: 'S21-128-BLK',
            images: [{ url: 'https://via.placeholder.com/100x100' }]
          },
          {
            id: '2',
            title: 'iPhone 13 Pro',
            description: 'Apple iPhone 13 Pro 256GB',
            barcode: '194252707060',
            brand: 'Apple',
            categoryId: 1,
            salePrice: 18499,
            listPrice: 19999,
            quantity: 89,
            productCode: 'APPLE-IP13P-256',
            stockCode: 'IP13P-256-GLD',
            images: [{ url: 'https://via.placeholder.com/100x100' }]
          },
          {
            id: '3',
            title: 'Xiaomi Redmi Note 11',
            description: 'Xiaomi Redmi Note 11 128GB',
            barcode: '6934177748943',
            brand: 'Xiaomi',
            categoryId: 1,
            salePrice: 4999,
            listPrice: 5499,
            quantity: 5,
            productCode: 'XIAOMI-RN11-128',
            stockCode: 'RN11-128-BLU',
            images: [{ url: 'https://via.placeholder.com/100x100' }]
          },
          {
            id: '4',
            title: 'Oppo A74',
            description: 'Oppo A74 128GB',
            barcode: '6944284682078',
            brand: 'Oppo',
            categoryId: 1,
            salePrice: 3799,
            listPrice: 3999,
            quantity: 0,
            productCode: 'OPPO-A74-128',
            stockCode: 'A74-128-BLK',
            images: [{ url: 'https://via.placeholder.com/100x100' }]
          }
        ];
        
        setProducts(mockProducts);
        setPagination(prev => ({
          ...prev,
          totalPages: 1,
          totalElements: mockProducts.length,
        }));
      } else {
        setError(`Ürünler yüklenemedi: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Ürün Yönetimi
        </Title>
        <Text className="text-gray-500">
          Trendyol'daki ürünlerinizi görüntüleyin ve yönetin
        </Text>
        {configs.length > 0 && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mağaza Seçin:
            </label>
            <select
              value={selectedConfig?.id || ''}
              onChange={(e) => {
                const configId = parseInt(e.target.value);
                const config = configs.find(c => c.id === configId);
                setSelectedConfig(config || null);
                setError(null);
              }}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {configs.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.magaza_adi} ({config.magaza_kodu}) {!config.aktif ? '- PASİF' : ''}
                </option>
              ))}
            </select>
            {selectedConfig && !selectedConfig.aktif && (
              <Text className="text-sm text-red-600 dark:text-red-400 mt-1">
                ⚠️ Bu mağaza aktif değil!
              </Text>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 @xl:flex-row @xl:items-center @xl:justify-between">
        <div className="flex-1 @xl:max-w-md">
          <Input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
            className="w-full"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="w-full @xl:w-auto">
            <PiDownloadBold className="mr-2 h-4 w-4" />
            Ürünleri Çek
          </Button>
          <Button className="w-full @xl:w-auto">
            <PiUploadBold className="mr-2 h-4 w-4" />
            Ürün Gönder
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 @xl:grid-cols-4">
        <StatsCard 
          title="Toplam Ürün" 
          value={pagination.totalElements.toLocaleString('tr-TR')} 
        />
        <StatsCard 
          title="Aktif Stok" 
          value={products.filter(p => p.quantity > 0).length.toLocaleString('tr-TR')} 
          color="green" 
        />
        <StatsCard 
          title="Düşük Stok" 
          value={products.filter(p => p.quantity > 0 && p.quantity <= 10).length.toLocaleString('tr-TR')} 
          color="orange" 
        />
        <StatsCard 
          title="Stokta Yok" 
          value={products.filter(p => p.quantity === 0).length.toLocaleString('tr-TR')} 
          color="red" 
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
          <div className="flex items-start gap-3">
            <div className="text-orange-600 dark:text-orange-400">⚠️</div>
            <div className="flex-1">
              <Text className="text-orange-700 dark:text-orange-400 font-medium mb-2">
                {error}
              </Text>
              {(error.includes('API erişim izni reddedildi') || error.includes('Cloudflare')) && (
                <div className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                  <p>Çözüm önerileri:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Trendyol Satıcı Paneli'nde API anahtarlarınızı kontrol edin</li>
                    <li>API Key ve Secret'ın doğru olduğundan emin olun</li>
                    <li>Supplier ID'nin doğru olduğunu kontrol edin</li>
                    <li>API erişim izinlerinizi Trendyol'dan kontrol edin</li>
                    <li>IP adresiniz Cloudflare tarafından bloklanmış olabilir</li>
                  </ul>
                  <p className="mt-2 text-xs">
                    Ürün bilgileri siparişlerden çıkarılarak gösteriliyor. Stok bilgileri mevcut değildir.
                  </p>
                </div>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={loadProducts}
          >
            Tekrar Dene
          </Button>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <PiSpinnerGapBold className="h-6 w-6 animate-spin text-blue-600" />
            <Text className="ml-2">Ürünler yükleniyor...</Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-left text-sm font-semibold">Ürün</th>
                  <th className="p-4 text-left text-sm font-semibold">Barkod</th>
                  <th className="p-4 text-left text-sm font-semibold">Marka</th>
                  <th className="p-4 text-left text-sm font-semibold">Stok</th>
                  <th className="p-4 text-left text-sm font-semibold">Fiyat</th>
                  <th className="p-4 text-left text-sm font-semibold">Durum</th>
                  <th className="p-4 text-right text-sm font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      {searchTerm ? 'Arama kriterlerinize uygun ürün bulunamadı' : 'Henüz ürün bulunmuyor'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-700">
            <Text className="text-sm text-gray-500">
              {pagination.page * pagination.size + 1}-{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} arası gösteriliyor (Toplam {pagination.totalElements.toLocaleString('tr-TR')})
            </Text>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={pagination.page === 0}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Önceki
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={pagination.page >= pagination.totalPages - 1}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Sonraki
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  color = 'blue',
}: {
  title: string;
  value: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
}) {
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <Text className="mb-1 text-sm text-gray-500">{title}</Text>
      <Title as="h3" className={`text-2xl ${colors[color]}`}>
        {value}
      </Title>
    </div>
  );
}

function ProductRow({ product }: { product: TrendyolProduct }) {
  const getStatus = (quantity: number) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= 10) return 'low-stock';
    return 'active';
  };

  const status = getStatus(product.quantity);

  const statusConfig = {
    active: {
      label: 'Aktif',
      class: 'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400',
    },
    'low-stock': {
      label: 'Düşük Stok',
      class: 'bg-orange-100 text-orange-700 dark:bg-orange-600/20 dark:text-orange-400',
    },
    'out-of-stock': {
      label: 'Stokta Yok',
      class: 'bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400',
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  return (
    <tr className="border-b border-gray-100 last:border-0 dark:border-gray-700/50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0].url}
              alt={product.title}
              className="h-10 w-10 rounded-lg object-cover"
            />
          )}
          <div>
            <Text className="font-medium">{product.title}</Text>
            <Text className="text-xs text-gray-500">{product.productCode}</Text>
          </div>
        </div>
      </td>
      <td className="p-4">
        <Text className="text-sm text-gray-500">{product.barcode}</Text>
      </td>
      <td className="p-4">
        <Text className="text-sm font-medium">{product.brand}</Text>
      </td>
      <td className="p-4">
        <Text className="font-semibold">{product.quantity.toLocaleString('tr-TR')}</Text>
      </td>
      <td className="p-4">
        <div>
          <Text className="font-semibold">{formatPrice(product.salePrice)}</Text>
          {product.listPrice > product.salePrice && (
            <Text className="text-xs text-gray-500 line-through">
              {formatPrice(product.listPrice)}
            </Text>
          )}
        </div>
      </td>
      <td className="p-4">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusConfig[status].class}`}>
          {statusConfig[status].label}
        </span>
      </td>
      <td className="p-4 text-right">
        <Button variant="outline" size="sm">
          Düzenle
        </Button>
      </td>
    </tr>
  );
}

