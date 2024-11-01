import { minify } from 'html-minifier-terser';
import fs from 'fs/promises';

const promises = [
  Bun.$`bun tw:build`.quiet(),
  Bun.write('dist/app.yaml', 'runtime: php83'),
  Bun.write('dist/composer.json', '{\n\n}'),

  process.env.GCLOUD_BUCKET_NAME
    ? Promise.resolve()
    : Array.fromAsync(new Bun.Glob('**').scan({ cwd: './img', absolute: true })).then((files) => {
        return Promise.all(files.map((file) => fs.cp(file, file.replace('/img/', '/dist/img/'))));
      }),
];

const html = await Bun.file('src/index.html').text();
const minifiedHtml = await minify(html, {
  collapseWhitespace: true,
  collapseInlineTagWhitespace: true,
});

const urlPrefix = process.env.GCLOUD_BUCKET_NAME
  ? `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET_NAME}/`
  : './';

promises.push(
  Bun.write(
    'dist/index.php',
    minifiedHtml
      .replace('<!doctype html>', '<!DOCTYPE html>')
      .replaceAll('../dist/', urlPrefix)
      .replaceAll('../img/', urlPrefix + 'img/'),
  ),
);

await Promise.all(promises);

console.log(`Done in ${performance.now()}ms`);
