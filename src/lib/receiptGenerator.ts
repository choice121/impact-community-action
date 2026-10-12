import jsPDF from 'jspdf';
import { siteConfig } from '../config/siteConfig';
import { DonationRecord } from '../types';
import { formatCurrency, formatDate } from './format';

export function generateDonationReceipt(donation: DonationRecord): void {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const { settings } = siteConfig;
  const primaryColor = [11, 37, 69]; // #0B2545
  const tealColor = [19, 168, 158]; // #13A89E
  const grayText = [100, 116, 139];
  const darkText = [27, 31, 42];

  // Header banner bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 24, 'F');

  // Title in header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(settings.legalName.toUpperCase(), 15, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('OFFICIAL 501(c)(3) CHARITABLE TAX DEDUCTION RECEIPT', 210 - 15, 15, { align: 'right' });

  // Receipt meta box
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Donation Receipt', 15, 45);

  doc.setFontSize(10);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt #: ${donation.receiptNumber}`, 15, 52);
  doc.text(`Issue Date: ${formatDate(donation.createdAt)}`, 15, 57);

  // Organization Information (Right side)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text('Organization Details:', 130, 45);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text(settings.legalName, 130, 51);
  doc.text(`EIN / Tax ID: ${settings.ein}`, 130, 56);
  doc.text(settings.address.street, 130, 61);
  doc.text(`${settings.address.city}, ${settings.address.state} ${settings.address.zip}`, 130, 66);
  doc.text(`Email: ${settings.email}`, 130, 71);

  // Horizontal divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 78, 195, 78);

  // Donor Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text('Donor Acknowledgement', 15, 88);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${donation.donorName}`, 15, 96);
  doc.text(`Email: ${donation.donorEmail}`, 15, 102);
  if (donation.inHonorOf) {
    doc.text(`Gift Tribute: In honor of ${donation.inHonorOf}`, 15, 108);
  }

  // Donation Contribution Table
  const tableY = donation.inHonorOf ? 118 : 112;
  doc.setFillColor(248, 250, 252);
  doc.rect(15, tableY, 180, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('DESIGNATION / CAUSE', 20, tableY + 6.5);
  doc.text('FREQUENCY', 110, tableY + 6.5);
  doc.text('TAX-DEDUCTIBLE AMOUNT', 190, tableY + 6.5, { align: 'right' });

  // Table row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const pillarLabel = donation.pillarId === 'general' ? 'Where Most Needed Fund' : `${donation.pillarId.toUpperCase()} Cause Pillar`;
  doc.text(pillarLabel, 20, tableY + 18);
  doc.text(donation.frequency === 'once' ? 'One-time' : donation.frequency.toUpperCase(), 110, tableY + 18);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.text(formatCurrency(donation.amountCents, true), 190, tableY + 18, { align: 'right' });

  doc.line(15, tableY + 24, 195, tableY + 24);

  // Total summary block
  doc.setFillColor(241, 245, 249);
  doc.rect(120, tableY + 30, 75, 20, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text('Total Eligible Deduction:', 125, tableY + 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(formatCurrency(donation.amountCents, true), 190, tableY + 45, { align: 'right' });

  // IRS Statement (Required for 501(c)(3) tax deductions)
  const statementY = tableY + 65;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('IRS 501(c)(3) COMPLIANCE STATEMENT:', 15, statementY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  const irsText = `${settings.legalName} is an exempt 501(c)(3) public charity registered with the Internal Revenue Service under EIN ${settings.ein}. No goods or services were provided in exchange or partial exchange for this charitable contribution other than intangible religious or charitable benefits. Please retain this official receipt for federal and state income tax preparation purposes.`;
  const splitText = doc.splitTextToSize(irsText, 180);
  doc.text(splitText, 15, statementY + 6);

  // Signature Block
  const sigY = statementY + 32;
  doc.setDrawColor(203, 213, 225);
  doc.line(15, sigY + 12, 75, sigY + 12);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.text('Authorized Finance Officer', 15, sigY + 17);
  doc.text(settings.legalName, 15, sigY + 22);

  // Footer note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Thank you for partnering with ${settings.shortName}. Small acts create transformational community impact.`, 105, 280, { align: 'center' });

  // Download trigger
  doc.save(`ICA-Tax-Receipt-${donation.receiptNumber}.pdf`);
}
