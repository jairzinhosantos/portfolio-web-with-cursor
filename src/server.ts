// ============================================
// Server Configuration - Patrón Modular
// ============================================
// Configuración optimizada para Angular 19 + SSR
// Soporte para Netlify y desarrollo local

import { CommonEngine } from '@angular/ssr/node'
import { render } from '@netlify/angular-runtime/common-engine.mjs'
import { APP_BASE_HREF } from '@angular/common'
import express from 'express'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import bootstrap from './main.server'

// ============================================
// Configuración del Motor Common Engine
// ============================================
const commonEngine = new CommonEngine()

// ============================================
// Configuración de Rutas y Directorios
// ============================================
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

// ============================================
// Handler para Netlify - Función Principal
// ============================================
export async function netlifyCommonEngineHandler(request: Request, context: any): Promise<Response> {
  try {
    // Configuración de API endpoints (si se necesitan en el futuro)
    const pathname = new URL(request.url).pathname;
    
    // Ejemplo de endpoint de API (descomentado si se necesita)
    // if (pathname.startsWith('/api/')) {
    //   return handleApiRequest(pathname, request);
    // }

    // Renderizado SSR usando @netlify/angular-runtime
    return await render(commonEngine);
  } catch (error) {
    console.error('Error in netlifyCommonEngineHandler:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// ============================================
// Servidor Express para Desarrollo Local
// ============================================
const app = express();

/**
 * Configuración de archivos estáticos
 * Optimizado para desarrollo y producción
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
    setHeaders: (res, path) => {
      // Configuración de headers para archivos estáticos
      if (path.endsWith('.js') || path.endsWith('.css')) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }),
);

/**
 * Manejo de rutas SPA
 * Renderizado SSR para todas las rutas
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => {
      console.error('Error rendering:', err);
      next(err);
    });
});

// ============================================
// Exportaciones
// ============================================
export default app;

// Exportar la función para Netlify
export { netlifyCommonEngineHandler as handler };
