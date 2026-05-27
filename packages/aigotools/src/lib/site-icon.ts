/**
 * Get the icon URL for a site
 * Supports:
 * - Direct URLs (http/https/data)
 * - Iconify format (logos:xxx, simple-icons:xxx)
 * - Fallback to favicon
 */
export function getSiteIconUrl(icon: string | undefined, siteUrl: string): string | null {
  if (!icon) {
    // Fallback to favicon
    try {
      const hostname = new URL(siteUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
      return null;
    }
  }

  if (icon.startsWith("http") || icon.startsWith("data:")) {
    return icon;
  }

  if (icon.startsWith("logos:")) {
    const iconName = icon.replace("logos:", "");
    return `https://api.iconify.design/logos/${iconName}.svg`;
  }

  if (icon.startsWith("simple-icons:")) {
    const iconName = icon.replace("simple-icons:", "");
    return `https://api.iconify.design/simple-icons/${iconName}.svg`;
  }

  // Unknown format, try to use as-is or fallback to favicon
  return icon;
}

/**
 * Get favicon URL from site URL
 */
export function getFaviconUrl(siteUrl: string, size: number = 64): string | null {
  try {
    const hostname = new URL(siteUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
  } catch {
    return null;
  }
}
