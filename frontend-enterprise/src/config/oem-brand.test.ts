// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';

import {
  applyOemBrandMetadata,
  createOemBrandConfig,
  DEFAULT_OEM_BRAND,
  oemFilenamePrefix,
  type OemBrandConfig,
} from './oem-brand';

describe('OEM brand configuration', () => {
  beforeEach(() => {
    document.head.innerHTML = `
      <title>Initial title</title>
      <link rel="icon" type="image/x-icon" href="/favicon.ico?v=agentsbuddy-1" />
      <link rel="apple-touch-icon" href="/AgentsBuddy.png?v=agentsbuddy-1" />
    `;
    delete document.documentElement.dataset.oemBrand;
  });

  it('keeps the current product as the zero-configuration fallback', () => {
    expect(createOemBrandConfig({})).toEqual(DEFAULT_OEM_BRAND);
  });

  it('applies supported text, asset and external-link overrides', () => {
    const config = createOemBrandConfig({
      VITE_OEM_PRODUCT_NAME: 'Workspace',
      VITE_OEM_COMPANY_NAME: 'Example Company',
      VITE_OEM_LOGO_URL: '/oem/logo.svg',
      VITE_OEM_FAVICON_URL: 'https://cdn.example.com/favicon.svg',
      VITE_OEM_SUPPORT_URL: 'https://example.com/support',
      VITE_OEM_DOCUMENTATION_URL: 'https://example.com/docs',
      VITE_OEM_RELEASE_URL: 'https://example.com/releases',
    });

    expect(config.productName).toBe('Workspace');
    expect(config.productShortName).toBe('Workspace');
    expect(config.companyName).toBe('Example Company');
    expect(config.copyright)
      .toBe(DEFAULT_OEM_BRAND.copyright.replace(DEFAULT_OEM_BRAND.companyName, 'Example Company'));
    expect(config.documentTitle)
      .toBe(DEFAULT_OEM_BRAND.documentTitle.replace(DEFAULT_OEM_BRAND.productName, 'Workspace'));
    expect(config.logoUrl).toBe('/oem/logo.svg');
    expect(config.faviconUrl).toBe('https://cdn.example.com/favicon.svg');
    expect(config.supportUrl).toBe('https://example.com/support');
    expect(config.documentationUrl).toBe('https://example.com/docs');
    expect(config.releaseUrl).toBe('https://example.com/releases');
  });

  it('rejects unsafe or malformed URLs and falls back safely', () => {
    const defaults: OemBrandConfig = {
      ...DEFAULT_OEM_BRAND,
      logoUrl: '/current/logo.svg',
      faviconUrl: '/current/favicon.png',
      supportUrl: 'https://current.example.com/support',
    };
    const config = createOemBrandConfig({
      VITE_OEM_LOGO_URL: 'javascript:alert(1)',
      VITE_OEM_FAVICON_URL: '//untrusted.example/favicon.svg',
      VITE_OEM_SUPPORT_URL: '/relative-support',
    }, defaults);

    expect(config.logoUrl).toBe(defaults.logoUrl);
    expect(config.faviconUrl).toBe(defaults.faviconUrl);
    expect(config.supportUrl).toBe(defaults.supportUrl);
  });

  it('derives a safe visible export prefix from the configured product name', () => {
    expect(oemFilenamePrefix({ ...DEFAULT_OEM_BRAND, productShortName: 'Acme Workspace' }))
      .toBe('acme-workspace');
    expect(oemFilenamePrefix({ ...DEFAULT_OEM_BRAND, productShortName: '  ' }))
      .toBe('export');
  });

  it('updates browser metadata without changing page layout', () => {
    applyOemBrandMetadata({
      ...DEFAULT_OEM_BRAND,
      productShortName: 'Workspace',
      descriptor: '企业智能协作平台',
      documentTitle: 'Workspace 运营台',
      compactLogoUrl: '/oem/logo-mark.svg',
      faviconUrl: '/oem/favicon.svg',
      socialPreviewUrl: '/oem/social-preview.png',
    });

    expect(document.title).toBe('Workspace 运营台');
    expect(document.documentElement.dataset.oemBrand).toBe('Workspace');
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content)
      .toBe('企业智能协作平台');
    expect(document.head.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content)
      .toBe('/oem/social-preview.png');
    expect(document.head.querySelector<HTMLLinkElement>('link[rel~="icon"]')?.getAttribute('href'))
      .toBe('/oem/favicon.svg');
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')?.getAttribute('href'))
      .toBe('/oem/logo-mark.svg');
  });
});
