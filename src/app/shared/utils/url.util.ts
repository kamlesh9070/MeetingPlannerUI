import { environment } from '../../../environments/environment';

export function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${environment.apiOrigin}${normalized}`;
}
