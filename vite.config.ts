import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {
  handleGetRoadmap,
  handleGetProfessionsList,
  handleGetPreference,
  handleSetPreference,
} from './server/api/roadmapRoutes.ts';

function roadmapApiPlugin(): Plugin {
  const attachMiddleware = (server: { middlewares: { use: Function } }) => {
    server.middlewares.use((req: any, res: any, next: any) => {
      const rawUrl = req.url ? req.url.split('?')[0] : '';

      // Preference endpoint
      if (rawUrl === '/roadmaps/preference') {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, professionId: handleGetPreference() }));
          return;
        }
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const saved = handleSetPreference(parsed.professionId);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, professionId: saved }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
          });
          return;
        }
      }

      // List professions endpoint: /roadmaps or /roadmaps/list
      if ((rawUrl === '/roadmaps' || rawUrl === '/roadmaps/list') && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: handleGetProfessionsList() }));
        return;
      }

      // Single roadmap endpoint: /roadmaps/:professionId
      const match = rawUrl.match(/^\/roadmaps\/([^/]+)$/);
      if (match && req.method === 'GET') {
        const profId = match[1];
        if (profId !== 'preference' && profId !== 'list') {
          const roadmap = handleGetRoadmap(profId);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, data: roadmap }));
          return;
        }
      }

      next();
    });
  };

  return {
    name: 'roadmap-api-plugin',
    configureServer(server) {
      attachMiddleware(server);
    },
    configurePreviewServer(server) {
      attachMiddleware(server);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    roadmapApiPlugin(),
  ],
});
