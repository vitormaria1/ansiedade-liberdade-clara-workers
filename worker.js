import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import html from './index.html';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Serve HTML at root
    if (url.pathname === '/') {
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Try to serve static assets (images, etc)
    try {
      const asset = await getAssetFromKV({
        request,
        waitUntil: ctx.waitUntil.bind(ctx),
      });

      const response = new Response(asset, asset);
      response.headers.set('Cache-Control', 'public, max-age=86400');
      return response;
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  },
};
