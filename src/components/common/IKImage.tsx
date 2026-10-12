import React, { useState } from 'react';
import { buildImageUrl, buildSrcSet, ImageKitTransformOptions } from '../../lib/imagekit';

interface IKImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path: string;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2' | '21/9' | '3/4';
  focalPoint?: 'auto' | 'face' | 'center';
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export const IKImage: React.FC<IKImageProps> = ({
  path,
  alt,
  aspectRatio,
  focalPoint = 'auto',
  className = '',
  priority = false,
  quality = 80,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate low-quality placeholder blurred image
  const lqipUrl = buildImageUrl(path, {
    width: 40,
    quality: 20,
    blur: 10,
    crop: 'maintain_ratio',
    focus: focalPoint,
  });

  const transformOpts: ImageKitTransformOptions = {
    quality,
    focus: focalPoint,
    format: 'auto',
  };

  const mainSrc = buildImageUrl(path, transformOpts);
  const srcSet = buildSrcSet(path);

  const aspectRatioClassMap: Record<string, string> = {
    '16/9': 'aspect-[16/9]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/2': 'aspect-[3/2]',
    '21/9': 'aspect-[21/9]',
    '3/4': 'aspect-[3/4]',
  };

  const containerAspectClass = aspectRatio ? aspectRatioClassMap[aspectRatio] || '' : '';

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${containerAspectClass} ${className}`}
    >
      {/* Blurred Low Quality Placeholder */}
      {!isLoaded && !hasError && (
        <img
          src={lqipUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105 transition-opacity duration-500"
        />
      )}

      {/* Main optimized image */}
      <img
        src={mainSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />

      {/* Graceful fallback if image completely fails */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400 text-xs text-center p-2">
          <span>Image preview unavailable</span>
        </div>
      )}
    </div>
  );
};
