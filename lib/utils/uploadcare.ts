/**
 * Uploadcare Helper Utilities
 * Automatic File Deletion, Purging & Orphan Cleanup from Uploadcare CDN
 */

const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY || '58e60a300a0570589035';
const UPLOADCARE_SECRET_KEY = process.env.UPLOADCARE_SECRET_KEY || 'b6a9fe9ff99422f2cc01';

/**
 * Extracts Uploadcare UUID from a CDN URL or raw UUID string.
 * Example: https://ucarecdn.com/c4660fe3-444e-49d9-88e5-a4dfd34658d4/steel.jpeg -> c4660fe3-444e-49d9-88e5-a4dfd34658d4
 */
export function extractUploadcareUuid(urlOrUuid: string): string | null {
  if (!urlOrUuid || typeof urlOrUuid !== 'string') return null;

  const uuidMatch = urlOrUuid.match(/ucarecdn\.com\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  if (uuidMatch && uuidMatch[1]) {
    return uuidMatch[1];
  }

  const directMatch = urlOrUuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  if (directMatch) {
    return directMatch[0];
  }

  return null;
}

/**
 * Permanently deletes a single file from Uploadcare CDN storage.
 */
export async function deleteFromUploadcare(fileUrlOrUuid: string): Promise<boolean> {
  const uuid = extractUploadcareUuid(fileUrlOrUuid);
  if (!uuid) return false;

  try {
    const res = await fetch(`https://api.uploadcare.com/files/${uuid}/storage/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
        'Accept': 'application/vnd.uploadcare-v0.7+json'
      }
    });

    if (res.ok) {
      console.log(`[Uploadcare] Permanently deleted file ${uuid} from Uploadcare CDN.`);
      return true;
    } else {
      const errText = await res.text();
      console.warn(`[Uploadcare] File delete response (${res.status}): ${errText}`);
      return false;
    }
  } catch (err: any) {
    console.error(`[Uploadcare] Failed to delete file ${uuid}:`, err.message);
    return false;
  }
}

/**
 * Batch deletes multiple files from Uploadcare CDN storage.
 */
export async function deleteMultipleFromUploadcare(urlsOrUuids: string[]): Promise<number> {
  if (!urlsOrUuids || urlsOrUuids.length === 0) return 0;

  const uuids = urlsOrUuids
    .map(u => extractUploadcareUuid(u))
    .filter((u): u is string => u !== null);

  if (uuids.length === 0) return 0;

  try {
    const res = await fetch(`https://api.uploadcare.com/files/storage/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
        'Accept': 'application/vnd.uploadcare-v0.7+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uuids)
    });

    if (res.ok) {
      const data = await res.json();
      const deletedCount = data?.result?.length || uuids.length;
      console.log(`[Uploadcare] Batch deleted ${deletedCount} files from Uploadcare CDN.`);
      return deletedCount;
    } else {
      const errText = await res.text();
      console.warn(`[Uploadcare] Batch delete response (${res.status}): ${errText}`);
      return 0;
    }
  } catch (err: any) {
    console.error(`[Uploadcare] Failed batch deleting files:`, err.message);
    return 0;
  }
}

/**
 * Lists stored files on Uploadcare.
 */
export async function listUploadcareFiles(): Promise<Array<{ uuid: string; original_filename: string }>> {
  try {
    const res = await fetch(`https://api.uploadcare.com/files/?stored=true&limit=100`, {
      headers: {
        'Authorization': `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
        'Accept': 'application/vnd.uploadcare-v0.7+json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      return data?.results || [];
    }
    return [];
  } catch (err: any) {
    console.error(`[Uploadcare] Failed to list files:`, err.message);
    return [];
  }
}

/**
 * Purges any Uploadcare file that is NOT linked to any active product in MongoDB.
 */
export async function purgeOrphanedUploadcareFiles(activeProductImageUrls: string[]): Promise<number> {
  const activeUuids = new Set<string>();
  activeProductImageUrls.forEach(url => {
    const uuid = extractUploadcareUuid(url);
    if (uuid) activeUuids.add(uuid);
  });

  const filesOnUploadcare = await listUploadcareFiles();
  const orphanUuids = filesOnUploadcare
    .map(f => f.uuid)
    .filter(uuid => !activeUuids.has(uuid));

  if (orphanUuids.length > 0) {
    console.log(`[Uploadcare] Found ${orphanUuids.length} orphan files on Uploadcare not attached to any product. Purging...`);
    return await deleteMultipleFromUploadcare(orphanUuids);
  }

  return 0;
}
