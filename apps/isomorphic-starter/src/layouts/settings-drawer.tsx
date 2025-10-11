'use client';

import AppDirection from '@/layouts/settings/app-direction';
import ColorOptions from '@/layouts/settings/color-options';
import ThemeSwitcher from '@/layouts/settings/theme-switcher';
import EnvatoIcon from '@core/components/icons/envato';
import { Button } from 'rizzui';

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
