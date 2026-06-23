export type DesktopUpdateReleaseInfo = {
  version: string;
  date?: string;
  body?: string;
  downloadUrl?: string;
};

export const DESKTOP_UPDATER_RELEASE_API_URL =
  'https://api.github.com/repos/iszkq/maccinny/releases/latest';

type TauriWindow = Window & {
  __TAURI__?: unknown;
  __TAURI_INTERNALS__?: unknown;
};

export const isDesktopUpdaterSupported = (): boolean =>
  typeof window !== 'undefined' &&
  (Boolean((window as TauriWindow).__TAURI__) ||
    Boolean((window as TauriWindow).__TAURI_INTERNALS__) ||
    /tauri/i.test(window.navigator.userAgent));

export const normalizeDesktopUpdateVersion = (version: string): string =>
  version.replace(/^v/i, '').trim();

const parseLatestDesktopRelease = (payload: {
  tag_name?: unknown;
  body?: unknown;
  published_at?: unknown;
  assets?: unknown;
}): DesktopUpdateReleaseInfo | undefined => {
  if (typeof payload.tag_name !== 'string' || payload.tag_name.trim() === '') {
    return undefined;
  }

  const assets = Array.isArray(payload.assets) ? payload.assets : [];
  const installerAsset = assets.find((asset) => {
    if (!asset || typeof asset !== 'object') return false;
    const name = 'name' in asset ? asset.name : undefined;

    return (
      typeof name === 'string' &&
      (/\.dmg$/i.test(name) || /\.app\.tar\.gz$/i.test(name) || /\.zip$/i.test(name))
    );
  }) as { browser_download_url?: unknown } | undefined;

  return {
    version: payload.tag_name.replace(/^v/i, ''),
    body: typeof payload.body === 'string' ? payload.body : undefined,
    date: typeof payload.published_at === 'string' ? payload.published_at : undefined,
    downloadUrl:
      installerAsset && typeof installerAsset.browser_download_url === 'string'
        ? installerAsset.browser_download_url
        : undefined,
  };
};

export const fetchLatestDesktopRelease = async (): Promise<
  DesktopUpdateReleaseInfo | undefined
> => {
  const response = await fetch(DESKTOP_UPDATER_RELEASE_API_URL, {
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch latest GitHub release: ${response.status}`);
  }

  const releasePayload = (await response.json()) as {
    tag_name?: unknown;
    body?: unknown;
    published_at?: unknown;
    assets?: unknown;
  };

  return parseLatestDesktopRelease(releasePayload);
};

export const openDesktopUpdateDownloadUrl = async (url: string): Promise<void> => {
  if (!url.trim()) return;

  if (isDesktopUpdaterSupported()) {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('open_external_url', { url });
    return;
  }

  if (typeof window === 'undefined') return;

  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (!popup) {
    window.location.assign(url);
  }
};
