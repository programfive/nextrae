import { pdf } from '@react-pdf/renderer';
import { ReactElement } from 'react';

export async function convertBlobUrlToFile(blobUrl: string) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const fileName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type || 'application/octet-stream';
  const file = new File([blob], `${fileName}.${mimeType.split('/')[1]}`, {
    type: mimeType,
  });
  return file;
}

export async function exportToPdf(
  pdfComponent: ReactElement<any>,
  fileName: string
): Promise<void> {
  try {
    // Generar el PDF usando el componente proporcionado
    const blob = await pdf(pdfComponent).toBlob();

    // Crear un enlace para descargar el archivo
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw new Error('Error al generar el PDF');
  }
}
