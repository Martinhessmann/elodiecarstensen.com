export default function handler(req, res) {
  const { url } = req.query;

  if (url && url.startsWith('/work/')) {
    const projectId = url.split('/').pop();
    return res.redirect(308, `/gallery/${projectId}`);
  }

  return res.redirect(308, '/');
}
