import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

const DEBUG = false;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      let options = {};

      if (DEBUG) {
        options.cacheControl = {
          bypassCache: true,
        };
      }

      const asset = await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        options
      );

      const response = new Response(asset, asset);
      response.headers.set('Cache-Control', 'public, max-age=3600');
      response.headers.set('Access-Control-Allow-Origin', '*');

      return response;
    } catch (e) {
      if (!DEBUG) {
        return new Response('Not Found', { status: 404 });
      }

      return new Response(e.message || 'error', { status: 500 });
    }
  },
};
