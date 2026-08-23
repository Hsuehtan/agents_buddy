// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/config/oem-brand', () => ({
  OEM_BRAND: {
    productShortName: 'Workspace',
    logoUrl: '/oem/logo.svg',
    compactLogoUrl: '/oem/logo-mark.svg',
  },
}));

import BrandLogo from './BrandLogo';

afterEach(cleanup);

describe('BrandLogo', () => {
  it('renders the configured full logo and product name', () => {
    render(<BrandLogo />);

    expect(screen.getByRole('img', { name: 'Workspace' }).getAttribute('src')).toBe('/oem/logo.svg');
    expect(screen.getByText('Workspace')).toBeTruthy();
  });

  it('uses the compact logo without a wordmark in mark-only mode', () => {
    render(<BrandLogo markOnly />);

    expect(screen.getByRole('img', { name: 'Workspace' }).getAttribute('src')).toBe('/oem/logo-mark.svg');
    expect(screen.queryByText('Workspace')).toBeNull();
  });
});
