export default function handler(req, res) {
  console.log('Redirect handler called');
  console.log('Request URL:', req.url);
  console.log('Query:', req.query);

  const url = req.url || '';

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

  // Remove trailing slash if present
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  console.log('Clean URL:', cleanUrl);

  // Check if the URL is in our redirect map
  if (redirectMap.hasOwnProperty(cleanUrl)) {
    console.log('Redirecting to:', redirectMap[cleanUrl]);
    return res.redirect(308, redirectMap[cleanUrl]);
  }

  // Handle any other /work/ URLs not explicitly listed
  if (cleanUrl.startsWith('/work/')) {
    const projectId = cleanUrl.split('/').pop();
    console.log('Redirecting work URL to:', `/gallery/${projectId}`);
    return res.redirect(308, `/gallery/${projectId}`);
  }

  // If no specific redirect is matched, redirect to the homepage
  console.log('No match found, redirecting to homepage');
  return res.redirect(308, '/');
}
