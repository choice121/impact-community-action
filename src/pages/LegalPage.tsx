import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { siteConfig } from '../config/siteConfig';

export const LegalPage: React.FC = () => {
  const { pathname } = useLocation();
  const { settings } = siteConfig;

  let title = 'Privacy Policy';
  if (pathname.includes('terms')) title = 'Terms of Use';
  if (pathname.includes('refunds')) title = 'Charitable Contribution Refund Policy';

  return (
    <>
      <SEO title={title} />
      <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#13A89E]">
            Legal & Governance Policy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B2545] dark:text-white">
            {title}
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: January 1, 2026 · {settings.legalName} (EIN: {settings.ein})
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-6">
          {pathname.includes('privacy') && (
            <>
              <p>
                {settings.legalName} ("ICA", "we", "us", or "our") is dedicated to protecting the privacy, safety, and personal dignity of all donors, program participants, volunteers, and website visitors.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">1. Donor Privacy Guarantee</h3>
              <p>
                We will never sell, share, rent, or trade donor personal contact information (including names, postal addresses, email addresses, and phone numbers) with any third party, commercial vendor, or independent charity. Nor will we send mailings on behalf of other organizations.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">2. Story Participant Protection</h3>
              <p>
                All photographs, names, and quotes featured across our Impact Stories gallery are published only with signed, revocable consent. For children and families in sensitive housing or health crises, pseudonyms or first names only are utilized, and precise geographic addresses are never disclosed.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">3. Payment & Security</h3>
              <p>
                This website does not store, transmit, or process credit card numbers or bank account credentials. All transactions are handled by PCI-DSS Level 1 compliant processing networks with 256-bit SSL encryption.
              </p>
            </>
          )}

          {pathname.includes('terms') && (
            <>
              <p>
                Welcome to {settings.legalName}. By accessing our websites, donor portal, and volunteer registries, you agree to comply with and be bound by these terms.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">1. Non-Profit Public Charity Mission</h3>
              <p>
                Impact Community Action is an exempt 501(c)(3) organization organized under the laws of the United States. Content provided on this platform is for educational, charitable, and community action purposes.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">2. Tax Deductions</h3>
              <p>
                Charitable gifts made to {settings.legalName} are tax-deductible to the fullest extent permitted by federal and state law. Official tax deduction letters are issued electronically upon contribution receipt.
              </p>
            </>
          )}

          {pathname.includes('refunds') && (
            <>
              <p>
                As a registered 501(c)(3) public charity, contributions made to {settings.legalName} represent irrevocable gifts under IRS regulations.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">1. Accidental or Duplicate Charges</h3>
              <p>
                If an error was made in the amount of your donation, or if an unauthorized transaction occurred, please contact us within 30 days of the contribution date at <strong>{settings.email}</strong> or by phone at <strong>{settings.phone}</strong>. We will promptly investigate and issue a full refund to the original payment method upon verification.
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">2. Recurring Gift Cancellations</h3>
              <p>
                Monthly or annual recurring contributions can be modified or canceled at any time through your donor portal link or by contacting our donor support team with zero penalty or administrative fee.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};
