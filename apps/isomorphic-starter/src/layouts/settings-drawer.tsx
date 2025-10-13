'use client';

import ColorOptions from '@/layouts/settings/color-options';
import ThemeSwitcher from '@/layouts/settings/theme-switcher';

export default function SettingsDrawer() {
  return (
    <>
      <div className="custom-scrollbar overflow-y-auto scroll-smooth h-[calc(100%-138px)]">
        <div className="px-5 py-6">
          <ThemeSwitcher />
          <ColorOptions />
        </div>
      </div>

    </>
  );
}
