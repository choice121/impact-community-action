import { jsPDF } from 'jspdf';
import { siteConfig } from '../config/siteConfig';

export interface VolunteerCertificateParams {
  volunteerName: string;
  hoursCompleted: number;
  programName: string;
  completionDate: string;
  coordinatorName?: string;
}

export function generateVolunteerCertificate(params: VolunteerCertificateParams) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4', // 297mm x 210mm
  });

  const { settings } = siteConfig;

  // Background frame
  doc.setDrawColor(11, 37, 69); // #0B2545
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190);

  doc.setDrawColor(19, 168, 158); // #13A89E
  doc.setLineWidth(1);
  doc.rect(13, 13, 271, 184);

  // Top header
  doc.setTextColor(11, 37, 69);
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.text('CERTIFICATE OF SERVICE & DIGNITY', 148.5, 38, { align: 'center' });

  doc.setTextColor(19, 168, 158);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('IMPACT COMMUNITY ACTION · 501(C)(3) CIVIC SERVICE AWARD', 148.5, 46, { align: 'center' });

  // Body
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text('This official certificate gratefully honors', 148.5, 66, { align: 'center' });

  // Volunteer Name
  doc.setTextColor(11, 37, 69);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(32);
  doc.text(params.volunteerName, 148.5, 85, { align: 'center' });

  doc.setDrawColor(244, 163, 64); // Gold divider
  doc.setLineWidth(0.8);
  doc.line(70, 90, 227, 90);

  // Description
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.text(
    `for faithfully contributing ${params.hoursCompleted} verified hours of community service`,
    148.5,
    102,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'bold');
  doc.text(`supporting the "${params.programName}" initiative.`, 148.5, 110, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(
    'Their selfless hands helped provide nutrition, shelter stability, and dignity to neighbors across Ohio & Appalachia.',
    148.5,
    124,
    { align: 'center' }
  );

  // Signatures
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);

  // Left signature: Coordinator
  doc.line(40, 162, 115, 162);
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(11, 37, 69);
  doc.text(params.coordinatorName || 'David Washington', 77.5, 158, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Volunteer Mobilization Director', 77.5, 168, { align: 'center' });

  // Right signature: Executive Director
  doc.line(182, 162, 257, 162);
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(11, 37, 69);
  doc.text('Dr. Marcus Holloway', 219.5, 158, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Executive Director, ICA', 219.5, 168, { align: 'center' });

  // Bottom footer info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Date Issued: ${params.completionDate}  ·  Verification EIN: ${settings.ein}  ·  ${settings.legalName}`,
    148.5,
    188,
    { align: 'center' }
  );

  const cleanName = params.volunteerName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  doc.save(`ICA-Volunteer-Certificate-${cleanName}.pdf`);
}
