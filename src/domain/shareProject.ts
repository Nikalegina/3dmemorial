import type { MemorialProject } from './memorialProject.ts'
import { parseProject, serializeProject } from './memorialProject.ts'

const SHARE_PARAM = 'project'

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function fromBase64Url(input: string): string {
  const padded = input.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (input.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function createShareUrl(project: MemorialProject, baseUrl: string): string {
  const url = new URL(baseUrl)
  url.searchParams.set(SHARE_PARAM, toBase64Url(serializeProject(project)))
  return url.toString()
}

export function readSharedProject(urlLike: string): MemorialProject | null {
  const url = new URL(urlLike)
  const encoded = url.searchParams.get(SHARE_PARAM)
  if (!encoded) return null
  try {
    return parseProject(fromBase64Url(encoded))
  } catch {
    return null
  }
}

export function clearSharedProjectFromUrl(urlLike: string): string {
  const url = new URL(urlLike)
  url.searchParams.delete(SHARE_PARAM)
  return url.toString()
}
