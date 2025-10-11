import { routes } from "@core/config/routes";

// Note: do not add href in the label object, it is rendering as label
export const pageLinks = [
  // label start
  {
    name: "Ana Sayfa",
  },
  // label end
  {
    name: "Giriş",
    href: routes.signIn,
  },
  // label start
  {
    name: "Tektas",
  },
  // label end
  {
    name: "Tektas Ana Sayfa",
    href: routes.tektas.dashboard,
  },
  {
    name: "Tektas Ürünler",
    href: routes.tektas.products,
  },
  // label start
  {
    name: "Trendyol",
  },
  // label end
  {
    name: "Trendyol Ana Sayfa",
    href: routes.trendyol.dashboard,
  },
  {
    name: "Trendyol Siparişler",
    href: routes.trendyol.orders,
  },
  {
    name: "Trendyol Stok/Fiyat",
    href: routes.trendyol.stockPrice,
  },
  {
    name: "Trendyol Ürünler",
    href: routes.trendyol.products,
  },
  {
    name: "Trendyol Yapılandırma",
    href: routes.trendyol.config,
  },
  // label start
  {
    name: "Sanal Mağaza",
  },
  // label end
  {
    name: "Sanal Mağaza",
    href: routes.sanalMagaza.dashboard,
  },
];
