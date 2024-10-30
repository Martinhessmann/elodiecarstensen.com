export default function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `https://${req.headers.host}`).pathname;
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  console.log('Processing redirect for:', cleanUrl);

  // Mapping of old URLs to new URLs
  const redirectMap = {
    '/work/alluvial': '/gallery/alluvial',
    '/work/einhellig': '/',
    '/work/blauer-himmel-zuckerwatte': '/',
    '/work/des-nachtmahrs-schmetterlinge': '/gallery/des-nachtmahrs-schmetterlinge',
    '/work/bridal': '/',
    '/work/absence-of-promised-safety': '/gallery/absence-of-promised-safety',
    '/work/death-drive-in': '/about',
    '/welcome': '/',
    '/preview': '/',
    '/freelance-costume-designer-in-berlin': '/',
    '/newsletter': '/about',
    '/imprint': '/about',
    '/about': '/about',
    '/news': '/about',
    '/miss-ivanka-t-on-queerclub': '/',
    '/plastic-barock': '/',
    '/monja-morphing-muse': '/',
    '/miriam-for-crownsproject': '/',
    '/ari-emily': '/',
    '/lenaig-chatel-for-pump': '/',
    '/rebirth-for-kaltblut-magazine': '/',
    '/bassam-allam': '/',
    '/gaia': '/',
    '/runa-by-beto-ruiz-alonso': '/',
    '/elodie-carstensen-presents-des-nachtmahrs-schmetterlinge-an-immersive-experience': '/gallery/des-nachtmahrs-schmetterlinge',
    '/des-nachmahrs-schmetterlinge-chaussee36': '/gallery/des-nachtmahrs-schmetterlinge',
    '/the-severed-tail-piglet-dress': '/',
    '/berlin-showroom-bei-der-paris-fashion-week': '/',
    '/nikeata-thompson-on-greentech-festival': '/',
    '/twisted-vorn-berlin-fashion-hub-design-academy': '/',
    '/echoes-of-promised-safety': '/gallery/echoes-of-promised-safety'
  };

  // Add status code logging
  const redirectTo = redirectMap[cleanUrl] || (
    cleanUrl.startsWith('/work/')
      ? `/gallery/${cleanUrl.split('/').pop()}`
      : '/'
  );

  console.log(`Redirecting ${cleanUrl} to ${redirectTo}`);
  return res.redirect(308, redirectTo);
}
