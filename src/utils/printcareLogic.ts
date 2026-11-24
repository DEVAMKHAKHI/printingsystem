export interface CustomerRecord {
  customerId: string;
  name: string;
  phone: string;
  dob: string; // DD/MM/YYYY
  email: string;
  address: string;
  createdAt: string; // ISO-8601 timestamp string for display/JSON export
}

const INDIAN_PHONE_REGEX = /^[6-9][0-9]{9}$/;
const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]{1,99}$/;
const DOB_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)[0-9]{2}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email address is required';
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
}

export function validateStaffName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Full name is required';
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  return null;
}

export function validateCustomerName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Customer full name is required';
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (!NAME_REGEX.test(trimmed)) return 'Enter a valid name using letters and spaces';
  return null;
}

export function validateIndianPhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return 'Phone number is required';
  if (!INDIAN_PHONE_REGEX.test(trimmed)) {
    return 'Enter a valid 10-digit Indian mobile number starting with 6–9';
  }
  return null;
}

export function validateDob(dob: string): string | null {
  const trimmed = dob.trim();
  if (!trimmed) return 'Date of birth is required';
  if (!DOB_REGEX.test(trimmed)) return 'Select a valid date (DD/MM/YYYY)';
  return null;
}

export function validateAddress(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return 'Address is required';
  if (trimmed.length < 5) return 'Please enter a complete address (min 5 characters)';
  if (trimmed.length > 400) return 'Address cannot exceed 400 characters';
  return null;
}

export function filterCustomers(customers: CustomerRecord[], query: string): CustomerRecord[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return customers;
  return customers.filter(
    (c) => c.name.toLowerCase().includes(trimmed) || c.phone.includes(trimmed)
  );
}

export function extractInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'PC';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function isoDateToDisplay(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function displayDateToIso(displayDate: string): string {
  const parts = displayDate.split('/');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Pure TypeScript uncompressed (STORE) ZIP builder with CRC32
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function buildZipBytes(files: Array<{ path: string; content: string }>): Uint8Array {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const cleanPath = file.path.replace(/^\/+/, '');
    const nameBytes = encoder.encode(cleanPath);
    const dataBytes = encoder.encode(file.content);
    const crc = crc32(dataBytes);

    // Local file header (30 bytes + name + data)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true); // UTF-8 filename flag
    lv.setUint16(8, 0, true); // Store (no compression)
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataBytes.length, true);
    lv.setUint32(22, dataBytes.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, dataBytes);

    // Central directory header (46 bytes + name)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const endRecord = new Uint8Array(22);
  const ev = new DataView(endRecord.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const totalSize = offset + centralSize + endRecord.length;
  const output = new Uint8Array(totalSize);
  let cursor = 0;
  for (const part of localParts) {
    output.set(part, cursor);
    cursor += part.length;
  }
  for (const part of centralParts) {
    output.set(part, cursor);
    cursor += part.length;
  }
  output.set(endRecord, cursor);
  return output;
}
