import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findHtmlFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

export default defineConfig({
  base: '/stylehome-wix-clone/',
  server: {
    host: '0.0.0.0', // Allow access from network
    port: 8000,
    strictPort: true,
    open: true
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    assetsInlineLimit: 0, // Don't inline assets - keep them as separate files for proper base path handling
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kitchen: resolve(__dirname, 'kitchen-renovation.html'),
        bathroom: resolve(__dirname, 'bathroom-renovation.html'),
        woodPanel: resolve(__dirname, 'wood-and-panel-wall-decor.html'),
        wholeHome: resolve(__dirname, 'whole-home-transformation.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@types': resolve(__dirname, 'src/types'),
      '@modules': resolve(__dirname, 'src/modules'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@components': resolve(__dirname, 'src/components')
    }
  },
  plugins: [
    {
      name: 'add-base-path',
      closeBundle() {
        // After build fix paths in HTML files
        const distDir = resolve(__dirname, 'dist');
        const htmlFiles = findHtmlFiles(distDir);
        console.log(`[add-base-path] Found ${htmlFiles.length} HTML files to process`);
        htmlFiles.forEach(file => {
          let content = readFileSync(file, 'utf-8');
          const originalContent = content;
          // Add base path to relative paths in script, link, and img tags
          // This regex matches src and href attributes in any tag
          content = content.replace(
            /(src|href)="(?!https?:\/\/|\/|#|tel:|mailto:|data:)([^"]+)"/g,
            (match, attr, path) => {
              // Skip paths that already have base path or are absolute
              if (path.startsWith('/stylehome-wix-clone/') || path.startsWith('http') || path.startsWith('tel:') || path.startsWith('mailto:') || path.startsWith('data:')) {
                return match;
              }
              return `${attr}="/stylehome-wix-clone/${path}"`;
            }
          );
          if (content !== originalContent) {
            writeFileSync(file, content, 'utf-8');
            console.log(`[add-base-path] Updated ${file}`);
          }
        });
        // Create .nojekyll file for GitHub Pages
        const nojekyllPath = join(distDir, '.nojekyll');
        writeFileSync(nojekyllPath, '', 'utf-8');
        console.log(`[add-base-path] Created .nojekyll file`);
        console.log(`[add-base-path] Plugin completed`);
      }
    }
  ]
});
