import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../../config/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  image?: string;
  jsonLd?: Record<string, unknown>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  image = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
  jsonLd,
}) => {
  const { settings } = siteConfig;
  const pageTitle = title ? `${title} | ${settings.shortName}` : `${settings.shortName} — ${settings.tagline}`;
  const pageDescription = description || settings.tagline + ' ' + settings.legalName + ' is a transparent US 501(c)(3) nonprofit creating tangible impact.';
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Default NGO Schema.org JSON-LD
  const defaultNgoSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: settings.legalName,
    alternateName: settings.shortName,
    description: pageDescription,
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    taxID: settings.ein,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      addressRegion: settings.address.state,
      postalCode: settings.address.zip,
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phone,
      contactType: 'donor support',
      email: settings.email,
    },
  };

  const schemaToInject = jsonLd || defaultNgoSchema;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={settings.legalName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />

      {/* Structured JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaToInject)}
      </script>
    </Helmet>
  );
};
