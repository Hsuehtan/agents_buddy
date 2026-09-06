import { Children, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import IconChevronDown from '../../assets/icons/chevron-down.svg?react';

export type PlatformColumnProps = {
  /** Small 14px glyph shown before the title. */
  icon: ReactNode;
  /** Column title, e.g. 数字员工广场. */
  title: ReactNode;
  /** Count shown beside the title. */
  count: number;
  /** Unit label rendered after the count, e.g. 员工 / 内容. */
  countLabel: string;
  /** Filter chips rendered under the title. */
  filters?: string[];
  /** Renders a skeleton-free muted list while data loads. */
  loading?: boolean;
  /** Whether the column has no content — shows the empty placeholder. */
  isEmpty?: boolean;
  /** Text for the empty placeholder. */
  emptyText?: string;
  /** Fired when the "查看全部" button is pressed. */
  onViewAll?: () => void;
  /** The plaza's cards. Only the first four are used for the home-page preview. */
  children?: ReactNode;
  className?: string;
};

/**
 * Shared shell for a single 开放广场 section. It captures the parts that repeat
 * across all five modules (数字员工 / 知识库 / 技能 / SOP / 工具): the icon+title
 * header with a count, the filter chip row, the divider, a responsive card
 * preview (or an empty placeholder) and the "查看全部" button. Each module only
 * supplies its own cards via `children`.
 */
export default function PlatformColumn({
  icon,
  title,
  count,
  countLabel,
  filters,
  loading = false,
  isEmpty = false,
  emptyText = '暂无开放内容',
  onViewAll,
  children,
  className,
}: PlatformColumnProps) {
  const previewItems = Children.toArray(children).slice(0, 4);
  const sectionLabel = typeof title === 'string' ? title : undefined;

  return (
    <section
      aria-label={sectionLabel}
      aria-busy={loading}
      className={cn(
        'flex w-full flex-col gap-[14px] rounded-[14px] border-[0.5px] border-[#e3e7f1] px-[14px] py-[14px]',
        className,
      )}
    >
      <div className="flex w-full flex-col gap-[10px]">
        <div className="flex w-full items-start justify-between gap-[16px]">
          <div className="flex min-w-0 items-center gap-[8px]">
            <div className="flex min-w-0 items-center gap-[4px]">
              <span className="flex size-[14px] shrink-0 items-center justify-center text-[#464c5e]">
                {icon}
              </span>
              <p className="truncate text-[12px] font-medium text-[#464c5e]">{title}</p>
            </div>
            <div className="flex shrink-0 items-center gap-[2px] text-[12px] text-[#464c5e]">
              <span aria-label={`${count} ${countLabel}`}>{count}</span>
            </div>
          </div>

          {!isEmpty && (
            <button
              type="button"
              onClick={onViewAll}
              className="flex shrink-0 items-center justify-center gap-[2px] rounded-[10px] border-[0.5px] border-[#e3e7f1] bg-white px-[14px] py-[6px] text-[12px] text-[#757f9c] transition-colors hover:text-[#18181a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9dd7cf]"
            >
              查看全部
              <IconChevronDown className="size-[14px] shrink-0 -rotate-90" />
            </button>
          )}
        </div>

        {filters && filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-[6px]">
            {filters.map((filter) => (
              <span
                key={filter}
                className="rounded-[20px] border-[0.5px] border-[#e3e7f1] px-[8px] py-[2px] text-[10px] leading-[normal] text-[#757f9c]"
              >
                {filter}
              </span>
            ))}
          </div>
        )}

        <div className="h-px w-full bg-[#e3e7f1]" />
      </div>

      <div
        aria-label={sectionLabel}
        className="grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {loading ? (
          <PlatformColumnSkeleton />
        ) : isEmpty ? (
          <div className="col-span-full flex min-h-[180px] w-full items-center justify-center rounded-[18px] border border-dashed border-[#e4e9f2] bg-[#fbfcfe] px-[18px] py-[28px] text-center">
            <div className="flex max-w-[180px] flex-col items-center">
              <span className="grid size-[34px] place-items-center rounded-[12px] bg-white text-[#98a2b3] shadow-[0_1px_8px_rgba(70,76,94,0.06)] ring-1 ring-[#edf1f6]">
                <IconChevronDown className="size-[16px] rotate-90" />
              </span>
              <p className="mt-[12px] text-[13px] font-medium leading-[19px] text-[#7f879a]">
                {emptyText}
              </p>
              <p className="mt-[4px] text-[10px] leading-[16px] text-[#a7adbb]">
                发布内容后会在这里展示
              </p>
            </div>
          </div>
        ) : (
          previewItems.map((item, index) => (
            <div
              key={`platform-preview-${index}`}
              className={cn('min-w-0', index === 3 && 'hidden xl:block')}
            >
              {item}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function PlatformColumnSkeleton() {
  return [0, 1, 2, 3].map((index) => (
    <div
      key={index}
      aria-hidden="true"
      className={cn(
        'h-[112px] w-full animate-pulse rounded-[20px] border-[0.5px] border-[#f0f1f5] bg-[#f6f6f6]',
        index === 3 && 'hidden xl:block',
      )}
    />
  ));
}
