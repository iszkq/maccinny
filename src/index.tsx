/* eslint-disable import/first */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { enableMapSet } from 'immer';
import '@fontsource/inter/variable.css';
import 'folds/dist/style.css';
import { configClass, varsClass } from 'folds';

enableMapSet();

import './index.css';

import App from './app/pages/App';
import { NativeImagePreviewWindow } from './app/components/image-viewer/NativeImagePreviewWindow';

// import i18n (needs to be bundled ;))
import './app/i18n';
import { getFallbackSession } from './app/state/sessions';
import { isDesktopUpdaterSupported } from './app/utils/desktopUpdater';
import { applyDesktopStartupPinLock } from './app/utils/pinLock';
import { isNativeImagePreviewWindow } from './app/utils/nativeImagePreview';

document.body.classList.add(configClass, varsClass);

const nativeImagePreviewWindow = isDesktopUpdaterSupported() && isNativeImagePreviewWindow();
const fallbackSession = nativeImagePreviewWindow ? undefined : getFallbackSession();

if (isDesktopUpdaterSupported() && !nativeImagePreviewWindow) {
  document.documentElement.dataset.cinnyDesktopApp = 'true';
  applyDesktopStartupPinLock(fallbackSession?.baseUrl, fallbackSession?.userId);
}

const mountApp = () => {
  const rootContainer = document.getElementById('root');

  if (rootContainer === null) {
    console.error('Root container element not found!');
    return;
  }

  const root = createRoot(rootContainer);
  root.render(nativeImagePreviewWindow ? <NativeImagePreviewWindow /> : <App />);
};

mountApp();
