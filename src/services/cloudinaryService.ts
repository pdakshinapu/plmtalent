/**
 * Resume Upload Service
 * Handles direct unsigned uploads of candidate resume documents (PDF, DOCX)
 * and provides reliable download/view functionality.
 */

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
  original_filename: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  folder: string;
}

// Read configuration from Vite env variables or fallback values
export const getCloudinaryConfig = (): CloudinaryConfig => {
  return {
    cloudName: (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'otnym87w').trim(),
    uploadPreset: (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'plmspiders').trim(),
    folder: (import.meta.env.VITE_CLOUDINARY_FOLDER || 'plmspiders').trim(),
  };
};

/**
 * Uploads a resume document (PDF, DOCX) to Cloudinary using raw/upload.
 * The PDF is stored as-is in the plmspiders folder.
 */
export async function uploadResumeToCloudinary(
  file: File,
  customConfig?: Partial<CloudinaryConfig>
): Promise<CloudinaryUploadResponse> {
  const envConfig = getCloudinaryConfig();
  const cloudName = customConfig?.cloudName || envConfig.cloudName;
  const uploadPreset = customConfig?.uploadPreset || envConfig.uploadPreset;
  const folder = customConfig?.folder || envConfig.folder || 'plmspiders';

  if (!cloudName || cloudName === 'YOUR_CLOUD_NAME') {
    throw new Error('Upload service is not configured.');
  }

  if (!uploadPreset) {
    throw new Error('Upload preset is not configured.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  // Use raw/upload for PDFs
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errMsg = `Upload failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errMsg = errJson.error.message;
      }
    } catch {}
    throw new Error(errMsg);
  }

  const data: CloudinaryUploadResponse = await response.json();
  return data;
}

/**
 * Builds a valid standard PDF 1.4 document from JPEG bytes in pure browser JS.
 */
export function buildPdfFromJpeg(jpegBytes: Uint8Array, width = 595.28, height = 841.89): Blob {
  const header = '%PDF-1.4\n';
  const obj1 = '1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n';
  const obj2 = '2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n';
  const obj3 = `3 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R /Resources <</XObject <</Im1 5 0 R>>>>>>\nendobj\n`;
  const streamContent = `q\n${width} 0 0 ${height} 0 0 cm\n/Im1 Do\nQ\n`;
  const obj4 = `4 0 obj\n<</Length ${streamContent.length}>>\nstream\n${streamContent}endstream\nendobj\n`;
  const obj5Header = `5 0 obj\n<</Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length}>>\nstream\n`;
  const obj5Footer = '\nendstream\nendobj\n';

  const enc = new TextEncoder();
  const bHeader = enc.encode(header);
  const bObj1 = enc.encode(obj1);
  const bObj2 = enc.encode(obj2);
  const bObj3 = enc.encode(obj3);
  const bObj4 = enc.encode(obj4);
  const bObj5Header = enc.encode(obj5Header);
  const bObj5Footer = enc.encode(obj5Footer);

  const offsets = [
    0,
    bHeader.length,
    bHeader.length + bObj1.length,
    bHeader.length + bObj1.length + bObj2.length,
    bHeader.length + bObj1.length + bObj2.length + bObj3.length,
    bHeader.length + bObj1.length + bObj2.length + bObj3.length + bObj4.length,
  ];

  const totalBeforeXref =
    bHeader.length + bObj1.length + bObj2.length + bObj3.length +
    bObj4.length + bObj5Header.length + jpegBytes.length + bObj5Footer.length;

  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  const trailer = `trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n${totalBeforeXref}\n%%EOF\n`;
  const bXref = enc.encode(xref);
  const bTrailer = enc.encode(trailer);

  return new Blob([
    bHeader, bObj1, bObj2, bObj3, bObj4,
    bObj5Header, jpegBytes, bObj5Footer,
    bXref, bTrailer,
  ], { type: 'application/pdf' });
}

export async function downloadResumeFile(url: string, filename: string = 'Resume.pdf') {
  if (!url) return;

  const cleanBase = filename.replace(/\.[^/.]+$/, '');
  const pdfFilename = `${cleanBase}.pdf`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      triggerBlobDownload(blob, pdfFilename);
      return;
    }

    if (res.status === 401) {
      const pdfBlob = await fetchAndBuildPdf(url);
      if (pdfBlob) {
        triggerBlobDownload(pdfBlob, pdfFilename);
        return;
      }
    }
    throw new Error(`Server returned HTTP ${res.status}`);
  } catch (err) {
    const pdfBlob = await fetchAndBuildPdf(url);
    if (pdfBlob) {
      triggerBlobDownload(pdfBlob, pdfFilename);
      return;
    }
    window.open(url, '_blank');
  }
}

export async function getResumePdfBlobUrl(url: string): Promise<string | null> {
  if (!url) return null;

  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    }
    if (res.status === 401) {
      const pdfBlob = await fetchAndBuildPdf(url);
      if (pdfBlob) return URL.createObjectURL(pdfBlob);
    }
  } catch {
    const pdfBlob = await fetchAndBuildPdf(url);
    if (pdfBlob) return URL.createObjectURL(pdfBlob);
  }
  return null;
}

async function fetchAndBuildPdf(url: string): Promise<Blob | null> {
  try {
    const jpgUrl = url
      .replace('/raw/upload/', '/image/upload/')
      .replace(/\.[^/.]+$/, '') + '.jpg';
    const jpgRes = await fetch(jpgUrl);
    if (jpgRes.ok) {
      const arr = await jpgRes.arrayBuffer();
      return buildPdfFromJpeg(new Uint8Array(arr));
    }
  } catch {}
  return null;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}
