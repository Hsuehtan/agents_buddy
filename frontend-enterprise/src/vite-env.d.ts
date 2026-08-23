/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_OEM_PRODUCT_NAME?: string;
  readonly VITE_OEM_COMPANY_NAME?: string;
  readonly VITE_OEM_LOGO_URL?: string;
  readonly VITE_OEM_FAVICON_URL?: string;
  readonly VITE_OEM_SUPPORT_URL?: string;
  readonly VITE_OEM_DOCUMENTATION_URL?: string;
  readonly VITE_OEM_RELEASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
