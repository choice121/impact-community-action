/**
 * ImageKit transformation and URL builder helper
 */

const DEFAULT_ENDPOINT = 'https://ik.imagekit.io/Zillow';
const ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || DEFAULT_ENDPOINT;

export interface ImageKitTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  blur?: number;
  crop?: 'force' | 'at_max' | 'maintain_ratio' | 'focal';
  focus?: 'auto' | 'face' | 'center';
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
}

/**
 * Builds an optimized ImageKit or fallback responsive image URL
 */
export function buildImageUrl(pathOrUrl: string, options: ImageKitTransformOptions = {}): string {
  if (!pathOrUrl) return '';

  // If path is already a full remote URL (e.g. Unsplash or external CDN)
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    // If it's an Unsplash URL, apply direct width/quality params for speed
    if (pathOrUrl.includes('images.unsplash.com')) {
      const url = new URL(pathOrUrl);
      if (options.width) url.searchParams.set('w', options.width.toString());
      if (options.quality) url.searchParams.set('q', options.quality.toString());
      if (options.blur) url.searchParams.set('blur', options.blur.toString());
      url.searchParams.set('auto', 'format');
      return url.toString();
    }
    
    // If ImageKit endpoint is available, we can pass external URL through ImageKit proxy
    if (ENDPOINT) {
      const cleanEndpoint = ENDPOINT.replace(/\/$/, '');
      const transforms = buildTransformString(options);
      return `${cleanEndpoint}/${transforms ? `tr:${transforms}/` : ''}${pathOrUrl}`;
    }

    return pathOrUrl;
  }

  // If ImageKit endpoint is configured
  const cleanEndpoint = (ENDPOINT || DEFAULT_ENDPOINT).replace(/\/$/, '');
  const cleanPath = pathOrUrl.replace(/^\//, '');
  const transforms = buildTransformString(options);

  if (transforms) {
    return `${cleanEndpoint}/tr:${transforms}/${cleanPath}`;
  }
  return `${cleanEndpoint}/${cleanPath}`;
}

export function buildTransformString(options: ImageKitTransformOptions): string {
  const parts: string[] = [];
  if (options.width) parts.push(`w-${options.width}`);
  if (options.height) parts.push(`h-${options.height}`);
  if (options.quality) parts.push(`q-${options.quality}`);
  if (options.blur) parts.push(`bl-${options.blur}`);
  if (options.crop) parts.push(`c-${options.crop}`);
  if (options.focus) parts.push(`fo-${options.focus}`);
  parts.push(`f-${options.format || 'auto'}`);
  return parts.join(',');
}

export function buildSrcSet(pathOrUrl: string, widths = [320, 640, 960, 1280, 1920]): string {
  return widths
    .map((w) => `${buildImageUrl(pathOrUrl, { width: w, quality: 80, format: 'auto' })} ${w}w`)
    .join(', ');
}
