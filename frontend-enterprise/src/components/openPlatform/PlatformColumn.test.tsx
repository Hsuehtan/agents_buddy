// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import PlatformColumn from './PlatformColumn';

afterEach(() => {
  cleanup();
});

function renderColumn(overrides?: {
  loading?: boolean;
  isEmpty?: boolean;
  onViewAll?: () => void;
}) {
  const onViewAll = overrides?.onViewAll ?? vi.fn();

  render(
    <PlatformColumn
      icon={<span aria-hidden="true">icon</span>}
      title="数字员工广场"
      count={5}
      countLabel="员工"
      filters={['聊天可用', '支持对话', '查看能力']}
      loading={overrides?.loading}
      isEmpty={overrides?.isEmpty}
      onViewAll={onViewAll}
    >
      {[1, 2, 3, 4, 5].map((item) => (
        <button key={item} type="button">
          预览 {item}
        </button>
      ))}
    </PlatformColumn>,
  );

  return { onViewAll };
}

describe('PlatformColumn home-page preview', () => {
  it('renders the first four items and hides the fourth below the desktop breakpoint', () => {
    renderColumn();

    const section = screen.getByRole('region', { name: '数字员工广场' });
    const preview = within(section).getByLabelText('数字员工广场');

    expect(within(preview).getByRole('button', { name: '预览 1' })).toBeTruthy();
    expect(within(preview).getByRole('button', { name: '预览 2' })).toBeTruthy();
    expect(within(preview).getByRole('button', { name: '预览 3' })).toBeTruthy();
    expect(within(preview).queryByRole('button', { name: '预览 5' })).toBeNull();

    const fourthItem = within(preview).getByRole('button', { name: '预览 4' }).parentElement;
    expect(fourthItem?.className).toContain('hidden');
    expect(fourthItem?.className).toContain('xl:block');
  });

  it('keeps the title, count, filters and existing view-all callback', async () => {
    const user = userEvent.setup();
    const onViewAll = vi.fn();
    renderColumn({ onViewAll });

    expect(screen.getByText('数字员工广场')).toBeTruthy();
    expect(screen.getByLabelText('5 员工')).toBeTruthy();
    expect(screen.getByText('聊天可用')).toBeTruthy();
    expect(screen.getByText('支持对话')).toBeTruthy();
    expect(screen.getByText('查看能力')).toBeTruthy();

    const section = screen.getByRole('region', { name: '数字员工广场' });
    await user.click(within(section).getByRole('button', { name: '查看全部' }));

    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  it('renders the empty state without a view-all action', () => {
    renderColumn({ isEmpty: true });

    const section = screen.getByRole('region', { name: '数字员工广场' });
    expect(screen.getByText('暂无开放内容')).toBeTruthy();
    expect(within(section).queryByRole('button', { name: '查看全部' })).toBeNull();
  });

  it('uses the same responsive grid while loading', () => {
    renderColumn({ loading: true });

    const section = screen.getByRole('region', { name: '数字员工广场' });
    const preview = within(section).getByLabelText('数字员工广场');
    const skeletons = preview.querySelectorAll('[aria-hidden="true"]');

    expect(section.getAttribute('aria-busy')).toBe('true');
    expect(preview.className).toContain('grid-cols-1');
    expect(preview.className).toContain('sm:grid-cols-2');
    expect(preview.className).toContain('lg:grid-cols-3');
    expect(preview.className).toContain('xl:grid-cols-4');
    expect(skeletons).toHaveLength(4);
    expect(skeletons[3]?.className).toContain('hidden');
    expect(skeletons[3]?.className).toContain('xl:block');
  });
});
