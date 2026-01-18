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
    port: 8000,
    strictPort: true,
    open: true
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kitchen: resolve(__dirname, 'kitchen-renovation.html'),
        bathroom: resolve(__dirname, 'bathroom-renovation.html')
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
        // Після збірки виправляємо шляхи в HTML файлах
        const distDir = resolve(__dirname, 'dist');
        const htmlFiles = findHtmlFiles(distDir);
        htmlFiles.forEach(file => {
          let content = readFileSync(file, 'utf-8');
          // Додаємо base path до відносних шляхів у script та link тегах
          content = content.replace(
            /(src|href)="(?!https?:\/\/|\/|#|tel:|mailto:|data:)([^"]+)"/g,
            (match, attr, path) => {
              // Пропускаємо шляхи, які вже мають base path або абсолютні
              if (path.startsWith('/stylehome-wix-clone/') || path.startsWith('http') || path.startsWith('tel:') || path.startsWith('mailto:') || path.startsWith('data:')) {
                return match;
              }
              return `${attr}="/stylehome-wix-clone/${path}"`;
            }
          );
          writeFileSync(file, content, 'utf-8');
        });
      }
    }
  ]
});
