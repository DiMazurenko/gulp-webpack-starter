import gulp from 'gulp';
import { path } from './gulp/config/path.js';
import { plugins } from './gulp/config/plugins.js';

// Passing values to a global variable
global.app = {
  isBuild: process.argv.includes('--build'), // production mode
  isDev: !process.argv.includes('--build'), // developer mode
  path: path,
  gulp: gulp,
  plugins: plugins,
};

// import tasks
import { copy } from './gulp/tasks/copy.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js';
import { svgSpriteTask } from './gulp/tasks/svgSprite.js';
import { zip } from './gulp/tasks/zip.js';
import { ftp } from './gulp/tasks/ftp.js';

// File change watcher
function watcher() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html); //if need update on FTP 'html => gulp.series(html, ftp)'
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
}

// series fonts processing
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// main task
const mainTasks = gulp.series(
  fonts,
  gulp.parallel(copy, html, scss, js, images, svgSpriteTask)
);

// Building scenarios for executing tasks
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

// export scenarios
export { svgSpriteTask };
export { dev };
export { build };
export { deployZIP };
export { deployFTP };

// executing the default script
gulp.task('default', dev);
