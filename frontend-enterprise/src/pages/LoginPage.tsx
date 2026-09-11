import { useState, type KeyboardEvent } from 'react';

import { api, TENANT_ID } from '../api/client';
import { setEnterpriseAuthSession, type EnterpriseAuthSession } from '../auth';
import AppHeader from '../components/AppHeader';
import BrandLogo from '../components/BrandLogo';
import IconFieldClear from '../assets/icons/field-clear.svg?react';
import IconFieldEye from '../assets/icons/field-eye.svg?react';
import IconFieldEyeOn from '../assets/icons/field-eye-on.svg?react';
import { OEM_BRAND } from '../config/oem-brand';

export type LoginPageProps = {
  onLogin: (session: EnterpriseAuthSession) => void;
};

/** Signed-out login page with OEM branding and the existing authentication flow. */
export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login() {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    setUsernameError(trimmedUsername ? '' : '请输入账号');
    setPasswordError(trimmedPassword ? '' : '请输入密码');
    if (!trimmedUsername || !trimmedPassword) return;

    setLoading(true);
    try {
      const session = await api.post<EnterpriseAuthSession>('/api/auth/login', {
        tenant_id: TENANT_ID,
        username: trimmedUsername,
        password: trimmedPassword,
      });
      setEnterpriseAuthSession(session);
      onLogin(session);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : '登录失败';
      setUsernameError('账号输入错误');
      setPasswordError(messageText || '密码输入错误');
    } finally {
      setLoading(false);
    }
  }

  function onFieldKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') void login();
  }

  const inputBaseClass =
    'flex h-[46px] w-full items-center gap-[8px] rounded-[12px] border bg-white px-[14px] transition-colors focus-within:border-[#7da7ee] focus-within:ring-4 focus-within:ring-[#dce9ff]';

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f4f7fc]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_50%_-20%,rgba(76,131,231,0.22),transparent_66%)]"
      />
      <AppHeader
        className="relative z-10 h-[72px] shrink-0 items-center px-[32px] max-[640px]:px-[20px]"
        left={<BrandLogo markSize={28} />}
        right={null}
      />

      <main className="relative z-10 flex flex-1 items-center justify-center px-[24px] pb-[72px] pt-[32px] max-[640px]:px-[16px]">
        <section
          aria-labelledby="login-title"
          className="w-full max-w-[420px] rounded-[24px] border border-[#e1e8f2] bg-white px-[40px] py-[38px] shadow-[0_24px_64px_rgba(38,65,112,0.13)] max-[480px]:rounded-[20px] max-[480px]:px-[24px]"
        >
          <div className="mb-[30px] text-center">
            <span className="mx-auto grid size-[52px] place-items-center rounded-[16px] bg-[#edf4ff] ring-1 ring-[#d8e6fc]">
              <BrandLogo markOnly markSize={34} />
            </span>
            <h1 id="login-title" className="mt-[18px] text-[26px] font-semibold tracking-[-0.3px] text-[#172033]">
              登录 {OEM_BRAND.productName}
            </h1>
            <p className="mt-[8px] text-[13px] leading-[20px] text-[#7a869c]">
              {OEM_BRAND.descriptor}
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void login();
            }}
          >
            <label htmlFor="login-username" className="mb-[8px] block text-[13px] font-medium text-[#3f4a5f]">
              账号
            </label>
            <div
              className={`${inputBaseClass} ${usernameError ? 'border-[#f54a45]' : username ? 'border-[#a9bbd5]' : 'border-[#dfe5ee]'}`}
            >
              <input
                id="login-username"
                value={username}
                autoComplete="username"
                autoFocus
                placeholder="请输入账号（首次使用请输入admin）"
                aria-label="账号"
                aria-invalid={Boolean(usernameError)}
                onChange={(event) => {
                  setUsername(event.target.value);
                  if (usernameError) setUsernameError('');
                }}
                onKeyDown={onFieldKeyDown}
                className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#172033] outline-none placeholder:text-[#98a2b3]"
              />
              {username && (
                <button
                  type="button"
                  aria-label="清空账号"
                  onClick={() => {
                    setUsername('');
                    setUsernameError('');
                  }}
                  className="grid size-[18px] shrink-0 place-items-center text-[#7a869c] outline-none transition-colors hover:text-[#3f4a5f]"
                >
                  <IconFieldClear className="size-[18px]" />
                </button>
              )}
            </div>
            <p className="mt-[6px] min-h-[18px] text-[12px] leading-[18px] text-[#d9363e]" aria-live="polite">
              {usernameError}
            </p>

            <label htmlFor="login-password" className="mb-[8px] mt-[10px] block text-[13px] font-medium text-[#3f4a5f]">
              密码
            </label>
            <div
              className={`${inputBaseClass} ${passwordError ? 'border-[#f54a45]' : password ? 'border-[#a9bbd5]' : 'border-[#dfe5ee]'}`}
            >
              <input
                id="login-password"
                value={password}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="请输入密码（首次使用请输入admin）"
                aria-label="密码"
                aria-invalid={Boolean(passwordError)}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (passwordError) setPasswordError('');
                }}
                onKeyDown={onFieldKeyDown}
                className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#172033] outline-none placeholder:text-[#98a2b3]"
              />
              <button
                type="button"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="grid size-[18px] shrink-0 place-items-center text-[#7a869c] outline-none transition-colors hover:text-[#3f4a5f]"
              >
                {showPassword ? (
                  <IconFieldEyeOn className="size-[18px]" />
                ) : (
                  <IconFieldEye className="size-[18px]" />
                )}
              </button>
            </div>
            <p className="mt-[6px] min-h-[18px] text-[12px] leading-[18px] text-[#d9363e]" aria-live="polite">
              {passwordError}
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-[18px] flex h-[46px] w-full items-center justify-center rounded-[12px] bg-[#3167d7] text-[15px] font-medium text-white shadow-[0_8px_18px_rgba(49,103,215,0.24)] transition-colors hover:bg-[#285bc3] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '登录中…' : '登录'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
