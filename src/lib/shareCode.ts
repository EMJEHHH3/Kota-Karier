/**
 * Shareable Result Code Utility.
 * Encodes scores and recommendations into an 8-character uppercase code (Base32).
 * Works 100% locally on the device with zero server/network dependency.
 */

import type { RiasecType } from '../types';

const BASE32_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 chars, no 0/O/1/I

const RIASEC_INDEX: Record<RiasecType, number> = {
  Realistic: 0,
  Investigative: 1,
  Artistic: 2,
  Social: 3,
  Enterprising: 4,
  Conventional: 5,
};

const RIASEC_FROM_INDEX: RiasecType[] = [
  'Realistic',
  'Investigative',
  'Artistic',
  'Social',
  'Enterprising',
  'Conventional',
];

const PROF_INDEX: Record<string, number> = {
  'dokter': 0,
  'software-engineer': 1,
  'perawat': 2,
  'akuntan': 3,
};

const PROF_FROM_INDEX = ['dokter', 'software-engineer', 'perawat', 'akuntan'];

export interface DecodedResultCode {
  topRiasec: RiasecType[];
  topProfessions: string[];
  averageEnjoyment: number;
}

/**
 * Encodes summary results into an 8-character string.
 */
export function encodeResultCode(
  topRiasec: RiasecType[],
  topProfessions: string[],
  averageEnjoyment: number = 4
): string {
  const r1 = topRiasec[0] ? RIASEC_INDEX[topRiasec[0]] : 0;
  const r2 = topRiasec[1] ? RIASEC_INDEX[topRiasec[1]] : 1;
  const r3 = topRiasec[2] ? RIASEC_INDEX[topRiasec[2]] : 2;

  const p1 = topProfessions[0] ? (PROF_INDEX[topProfessions[0]] ?? 0) : 0;
  const p2 = topProfessions[1] ? (PROF_INDEX[topProfessions[1]] ?? 1) : 1;
  const p3 = topProfessions[2] ? (PROF_INDEX[topProfessions[2]] ?? 2) : 2;

  const enjoy = Math.min(Math.max(Math.round(averageEnjoyment), 1), 5);

  // Pack into 40 bits (5 bytes = 8 Base32 chars, 5 bits each)
  // Byte 0 (8 bits): r1 (3 bits) | r2 (3 bits) | p1 high (2 bits)
  const b0 = (r1 << 5) | (r2 << 2) | ((p1 >> 1) & 0x03);
  // Byte 1 (8 bits): p1 low (1 bit) | r3 (3 bits) | p2 (2 bits) | enjoy high (2 bits)
  const b1 = ((p1 & 0x01) << 7) | (r3 << 4) | ((p2 & 0x03) << 2) | ((enjoy >> 1) & 0x03);
  // Byte 2 (8 bits): enjoy low (1 bit) | p3 (2 bits) | padding (5 bits)
  const b2 = ((enjoy & 0x01) << 7) | ((p3 & 0x03) << 5) | 0x15;
  // Byte 3: Checksum
  const b3 = (b0 ^ b1 ^ b2) & 0xff;
  // Byte 4: Magic tag
  const b4 = ((b0 + b1 + b2 + b3) & 0x7f) | 0x80;

  const bytes = [b0, b1, b2, b3, b4];

  // Convert 5 bytes (40 bits) to 8 5-bit integers
  let code = '';
  let buffer = 0;
  let bitsLeft = 0;

  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bitsLeft += 8;

    while (bitsLeft >= 5) {
      bitsLeft -= 5;
      const index = (buffer >> bitsLeft) & 0x1f;
      code += BASE32_ALPHABET[index];
    }
  }

  return code;
}

/**
 * Decodes an 8-character string back into summary results.
 */
export function decodeResultCode(code: string): DecodedResultCode | null {
  const cleanCode = code.trim().toUpperCase().replace(/[^A-Z2-9]/g, '');
  if (cleanCode.length !== 8) return null;

  let buffer = 0;
  let bits = 0;
  const bytes: number[] = [];

  for (let i = 0; i < 8; i++) {
    const val = BASE32_ALPHABET.indexOf(cleanCode[i]);
    if (val === -1) return null;

    buffer = (buffer << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }

  if (bytes.length < 5) return null;

  const [b0, b1, b2, b3] = bytes;
  const expectedB3 = (b0 ^ b1 ^ b2) & 0xff;
  if (b3 !== expectedB3) return null; // Checksum fail

  const r1Idx = (b0 >> 5) & 0x07;
  const r2Idx = (b0 >> 2) & 0x07;
  const p1High = b0 & 0x03;
  const p1Low = (b1 >> 7) & 0x01;
  const p1Idx = (p1High << 1) | p1Low;

  const r3Idx = (b1 >> 4) & 0x07;
  const p2Idx = (b1 >> 2) & 0x03;
  const enjoyHigh = b1 & 0x03;
  const enjoyLow = (b2 >> 7) & 0x01;
  const enjoyment = (enjoyHigh << 1) | enjoyLow;
  const p3Idx = (b2 >> 5) & 0x03;

  const topRiasec: RiasecType[] = [
    RIASEC_FROM_INDEX[r1Idx % 6],
    RIASEC_FROM_INDEX[r2Idx % 6],
    RIASEC_FROM_INDEX[r3Idx % 6],
  ];

  const topProfessions: string[] = [
    PROF_FROM_INDEX[p1Idx % 4],
    PROF_FROM_INDEX[p2Idx % 4],
    PROF_FROM_INDEX[p3Idx % 4],
  ];

  return {
    topRiasec,
    topProfessions,
    averageEnjoyment: enjoyment || 4,
  };
}
