import fileInclude from 'gulp-file-include';
import webpHtmlNosvg from 'gulp-webp-html-nosvg';
import versionNumber from 'gulp-version-number';

export const html = () => {
  return app.gulp
    .src(app.path.src.html) // get access to files
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'HTML',
          message: 'Error: <%= error.message %>',
        })
      )
    ) // error processing
    .pipe(fileInclude()) // copy file with attached content
    .pipe(app.plugins.replace(/@img\//g, 'img/')) // replace '@img' to correct path
    .pipe(app.plugins.if(app.isBuild, webpHtmlNosvg())) // conver images format to webp
    .pipe(
      app.plugins.if(
        app.isBuild,
        versionNumber({
          value: '%DT%',
          append: {
            key: '_v',
            cover: 0,
            to: ['css', 'js'],
          },
          output: {
            file: 'gulp/version.json',
          },
        })
      )
    ) // add version for cache
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browsersync.stream());
};
