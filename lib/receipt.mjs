export const MAX_RECEIPT_BYTES = 4 * 1024 * 1024;
export const RECEIPT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateReceiptFile(file) {
  if (!file || typeof file.arrayBuffer !== "function" || !Number.isFinite(file.size) || file.size <= 0) {
    throw new Error("Choose a non-empty receipt image.");
  }
  if (!RECEIPT_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Use a JPEG, PNG or WebP receipt image.");
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    throw new Error("Receipt images must be 4 MiB or smaller.");
  }
}
