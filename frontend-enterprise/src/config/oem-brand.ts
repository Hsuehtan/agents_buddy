export type OemBrandConfig = {
  productName: string;
  productShortName: string;
  companyName: string;
  descriptor: string;
  copyright: string;
  documentTitle: string;
  logoUrl: string;
  compactLogoUrl: string;
  faviconUrl: string;
  loginArtworkUrl: string;
  socialPreviewUrl: string;
  supportUrl: string;
  documentationUrl: string;
  releaseUrl: string;
};

export type OemShellTheme = {
  shellBackground: string;
  shellOutline: string;
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarMutedForeground: string;
  sidebarHoverBackground: string;
  sidebarActiveBackground: string;
  sidebarActiveForeground: string;
  sidebarBorder: string;
  sidebarFocusRing: string;
};

export const DEFAULT_OEM_BRAND: Readonly<OemBrandConfig> = Object.freeze({
  productName: 'StaffDeck',
  productShortName: 'StaffDeck',
  companyName: 'OpenBMB',
  descriptor: '数字员工运营平台',
  copyright: '© 2026 OpenBMB',
  documentTitle: 'StaffDeck 数字员工运营台',
  logoUrl: '',
  compactLogoUrl: '',
  faviconUrl: '',
  loginArtworkUrl: '',
  socialPreviewUrl: '',
  supportUrl: '',
  documentationUrl: '',
  releaseUrl: '',
});

/**
 * OEM application-shell palette. These values intentionally do not feed the
 * workspace theme, so changing them cannot recolor business pages.
 */
export const DEFAULT_OEM_SHELL_THEME: Readonly<OemShellTheme> = Object.freeze({
  shellBackground: '#071225',
  shellOutline: '#6f9ed6',
  sidebarBackground: '#071225',
  sidebarForeground: '#d7e0ef',
  sidebarMutedForeground: '#8fa0ba',
  sidebarHoverBackground: '#132542',
  sidebarActiveBackground: '#315fda',
  sidebarActiveForeground: '#ffffff',
  sidebarBorder: '#1c3150',
  sidebarFocusRing: '#8bb7ee',
});

/** Change this object for each OEM build; invalid colors fall back at runtime. */
export const OEM_SHELL_THEME: Readonly<OemShellTheme> = Object.freeze({
  ...DEFAULT_OEM_SHELL_THEME,
});

function normalizedText(value: string | undefined, fallback: string): string {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, 160) : fallback;
}

function normalizedAssetUrl(value: string | undefined, fallback: string): string {
  const normalized = value?.trim();
  if (!normalized) return fallback;
  if (normalized.startsWith('/') && !normalized.startsWith('//')) return normalized;
  try {
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

function normalizedExternalUrl(value: string | undefined, fallback: string): string {
  const normalized = value?.trim();
  if (!normalized) return fallback;
  try {
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function createOemBrandConfig(
  env: Record<string, string | boolean | undefined>,
  defaults: Readonly<OemBrandConfig> = DEFAULT_OEM_BRAND,
): Readonly<OemBrandConfig> {
  const productNameOverride = (env.VITE_OEM_PRODUCT_NAME as string | undefined)?.trim();
  const companyNameOverride = (env.VITE_OEM_COMPANY_NAME as string | undefined)?.trim();
  const productName = normalizedText(productNameOverride, defaults.productName);
  const companyName = normalizedText(companyNameOverride, defaults.companyName);

  return Object.freeze({
    ...defaults,
    productName,
    productShortName: productNameOverride ? productName : defaults.productShortName,
    companyName,
    copyright: companyNameOverride
      ? defaults.copyright.replace(defaults.companyName, companyName)
      : defaults.copyright,
    documentTitle: productNameOverride
      ? defaults.documentTitle.replace(defaults.productName, productName)
      : defaults.documentTitle,
    logoUrl: normalizedAssetUrl(env.VITE_OEM_LOGO_URL as string | undefined, defaults.logoUrl),
    faviconUrl: normalizedAssetUrl(env.VITE_OEM_FAVICON_URL as string | undefined, defaults.faviconUrl),
    supportUrl: normalizedExternalUrl(env.VITE_OEM_SUPPORT_URL as string | undefined, defaults.supportUrl),
    documentationUrl: normalizedExternalUrl(
      env.VITE_OEM_DOCUMENTATION_URL as string | undefined,
      defaults.documentationUrl,
    ),
    releaseUrl: normalizedExternalUrl(env.VITE_OEM_RELEASE_URL as string | undefined, defaults.releaseUrl),
  });
}

export const OEM_BRAND = createOemBrandConfig(import.meta.env);

export function oemFilenamePrefix(brand: Readonly<OemBrandConfig> = OEM_BRAND): string {
  const normalized = brand.productShortName
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'export';
}

function imageMimeType(url: string): string | undefined {
  const pathname = url.split(/[?#]/, 1)[0].toLowerCase();
  if (pathname.endsWith('.svg')) return 'image/svg+xml';
  if (pathname.endsWith('.png')) return 'image/png';
  if (pathname.endsWith('.ico')) return 'image/x-icon';
  if (pathname.endsWith('.webp')) return 'image/webp';
  return undefined;
}

function upsertMeta(property: string, content: string): void {
  if (!content) return;
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.append(element);
  }
  element.content = content;
}

export function applyOemBrandMetadata(brand: Readonly<OemBrandConfig> = OEM_BRAND): void {
  document.title = brand.documentTitle;
  document.documentElement.dataset.oemBrand = brand.productShortName;

  const description = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    ?? document.head.appendChild(document.createElement('meta'));
  description.name = 'description';
  description.content = brand.descriptor;

  upsertMeta('og:title', brand.documentTitle);
  upsertMeta('og:description', brand.descriptor);
  upsertMeta('og:image', brand.socialPreviewUrl);

  if (brand.faviconUrl) {
    const icons = document.head.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]');
    icons.forEach((icon) => {
      icon.href = brand.faviconUrl;
      const mimeType = imageMimeType(brand.faviconUrl);
      if (mimeType) icon.type = mimeType;
    });
  }

  if (brand.compactLogoUrl) {
    const appleTouchIcon = document.head.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    if (appleTouchIcon) appleTouchIcon.href = brand.compactLogoUrl;
  }
}
