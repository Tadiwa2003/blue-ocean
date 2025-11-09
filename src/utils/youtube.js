const YOUTUBE_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtu.be',
]);

const YOUTUBE_EMBED_BASE = 'https://www.youtube-nocookie.com/embed/';

const DEFAULT_PARAMS = {
  rel: '0',
  modestbranding: '1',
  playsinline: '1',
};

/**
 * Extract a YouTube video ID from a watch/embed/share URL.
 * Supports standard web share and shortened formats.
 */
export function getYouTubeVideoId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!YOUTUBE_HOSTS.has(parsed.hostname)) {
      return null;
    }

    // Handle youtu.be short links: https://youtu.be/<id>
    if (parsed.hostname === 'youtu.be' || parsed.hostname === 'www.youtu.be') {
      return parsed.pathname.replace('/', '') || null;
    }

    // Handle embed links: https://www.youtube.com/embed/<id>
    if (parsed.pathname.startsWith('/embed/')) {
      const [, , videoId] = parsed.pathname.split('/');
      return videoId || null;
    }

    // Handle watch links: https://www.youtube.com/watch?v=<id>
    const videoId = parsed.searchParams.get('v');
    if (videoId) {
      return videoId;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[YouTube utils] Failed to parse video URL', { url, error });
    return null;
  }

  return null;
}

/**
 * Build a privacy-focused embed URL for YouTube videos.
 * Adds sensible defaults and includes origin if available to reduce log_event errors.
 */
export function buildYouTubeEmbedUrl(sourceUrl, origin) {
  const videoId = getYouTubeVideoId(sourceUrl);
  if (!videoId) {
    return null;
  }

  const params = new URLSearchParams(DEFAULT_PARAMS);

  // Only include enablejsapi + origin when we have a valid origin (client-side)
  if (origin) {
    params.set('enablejsapi', '1');
    params.set('origin', origin);
  }

  return `${YOUTUBE_EMBED_BASE}${videoId}?${params.toString()}`;
}

/**
 * Get a thumbnail image URL for a given YouTube video ID.
 */
export function getYouTubeThumbnailUrl(videoId, quality = 'hqdefault') {
  if (!videoId) return null;
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}


