import { deleteFromUploadcare } from './uploadcare';

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload image to Uploadcare CDN');
  }

  const data = await response.json();
  return data.fileUrl;
}

export async function deleteFile(url: string): Promise<void> {
  await deleteFromUploadcare(url);
}