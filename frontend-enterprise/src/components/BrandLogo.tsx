import { cn } from '@/lib/utils';
import { OEM_BRAND } from '@/config/oem-brand';
import logoMark from '../assets/LOGO.svg';

export type BrandLogoProps = {
  /** Hide the "OpenBMB / StaffDeck" wordmark and only render the logo mark. */
  markOnly?: boolean;
  /** Size of the square logo mark in pixels. */
  markSize?: number;
  className?: string;
  /** Extra classes applied to the wordmark wrapper (e.g. to hide it responsively). */
  wordmarkClassName?: string;
};

/** Configurable brand logo lockup. Figma node 504:7137. */
export default function BrandLogo({
  markOnly = false,
  markSize = 28,
  className,
  wordmarkClassName,
}: BrandLogoProps) {
  const logoUrl = markOnly
    ? OEM_BRAND.compactLogoUrl || OEM_BRAND.logoUrl || logoMark
    : OEM_BRAND.logoUrl || logoMark;

  return (
    <span className={cn('flex items-center gap-[8px] overflow-hidden p-[4px]', className)}>
      <img
        src={logoUrl}
        alt={OEM_BRAND.productShortName}
        className="shrink-0"
        style={{ width: markSize, height: markSize }}
      />
      {!markOnly && (
        <span className={cn('flex flex-col items-center gap-[2px] leading-none', wordmarkClassName)}>
          {/* <span className="text-[12px] font-semibold leading-none text-[#0f136c]">
            OpenBMB
          </span> */}
          <strong className="text-[17px] font-semibold leading-none text-sidebar-foreground">
            {OEM_BRAND.productShortName}
          </strong>
        </span>
      )}
    </span>
  );
}
