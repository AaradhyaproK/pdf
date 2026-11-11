/**
 * Title normalisation.
 *
 * Google renders roughly the first 60-65 characters of a <title>. Anything
 * beyond that is truncated in the SERP, so a title that is already long gets
 * its most valuable keywords (which are always front-loaded) cut off — and the
 * brand suffix ends up being the only thing visible.
 *
 * `normalizeTitle` removes a duplicated brand suffix and, when the result is
 * still too long, trims it at a natural word boundary while keeping the
 * front-loaded keyword phrase intact.
 */

const BRAND_SUFFIX = '| FileZenith';

/** Maximum length of the final rendered <title>. */
export const MAX_TITLE_LENGTH = 65;

/**
 * Strips any trailing brand suffix so it is never duplicated.
 * "Edit PDF Online | FileZenith | FileZenith" -> "Edit PDF Online"
 */
export function stripBrandSuffix(title: string): string {
  let cleaned = title.trim();

  // Remove the brand suffix repeatedly, in case it was already duplicated.
  const suffixPattern = /\s*[|—–-]\s*FileZenith\s*$/i;
  while (suffixPattern.test(cleaned)) {
    cleaned = cleaned.replace(suffixPattern, '').trim();
  }

  return cleaned;
}

/**
 * Trims a title to `maxLength` on a word boundary.
 *
 * Prefers cutting at a clause separator (em dash, pipe, semicolon) because
 * that is where the descriptive tail usually starts. Falls back to a plain
 * word boundary when there is no separator.
 */
function trimToWordBoundary(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title;

  // 1. Prefer cutting at a clause separator.
  const separatorIndex = title.lastIndexOf(' — ', maxLength);
  if (separatorIndex > maxLength * 0.4) {
    return title.slice(0, separatorIndex).trim();
  }

  const pipeIndex = title.lastIndexOf(' | ', maxLength);
  if (pipeIndex > maxLength * 0.4) {
    return title.slice(0, pipeIndex).trim();
  }

  // 2. Drop a trailing parenthetical if that is enough.
  const parenIndex = title.lastIndexOf(' (', maxLength);
  if (parenIndex > maxLength * 0.4 && title.slice(0, parenIndex).trim().length <= maxLength) {
    return title.slice(0, parenIndex).trim();
  }

  // 3. Fall back to the last complete word.
  const sliced = title.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  const trimmed = lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced;

  // Remove any dangling punctuation left by the cut.
  return trimmed.replace(/[\s,;:–—-]+$/, '').trim();
}

/**
 * Produces the final <title> text.
 *
 * @param title    The raw title (may or may not already carry the brand).
 * @param template Whether to append the brand suffix.
 */
export function normalizeTitle(title: string, template = true): string {
  const cleaned = stripBrandSuffix(title);

  if (!template) return cleaned;

  // Reserve room for the suffix we are about to append.
  const budget = MAX_TITLE_LENGTH - BRAND_SUFFIX.length - 1;
  const trimmed = trimToWordBoundary(cleaned, budget);

  return `${trimmed} ${BRAND_SUFFIX}`;
}

/**
 * Normalises a title for use with Next.js `metadata.title`.
 *
 * The root layout applies the template '%s | FileZenith'. Passing a plain
 * string to `title` makes Next append the suffix itself, which is what we
 * want for short titles. For long titles we must trim first and then take
 * full control of the final string, which requires `absolute`.
 *
 * @returns Either a plain string (the root template applies) or an absolute title.
 */
export function metadataTitle(title: string): { absolute: string } | string {
  const cleaned = stripBrandSuffix(title);

  // Short enough that the root template produces a good result.
  if (`${cleaned} | FileZenith`.length <= MAX_TITLE_LENGTH) {
    return cleaned;
  }

  return { absolute: normalizeTitle(cleaned) };
}
