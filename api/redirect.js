export default function handler(request, response) {
  const { url } = request.query;

  // Add your dynamic redirect logic here
  if (url && url.startsWith('/work/')) {
    const projectId = url.split('/').pop();
    return response.redirect(308, `/gallery/${projectId}`);
  }

  // If no redirect is needed, you can pass the request to your main app
  return response.redirect(308, '/');
}
