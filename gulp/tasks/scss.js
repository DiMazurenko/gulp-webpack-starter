import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // CSS File Compression
import webpcss from 'gulp-webpcss'; // Output of WEBP images
import autoprefixer from 'gulp-autoprefixer'; // Adding vendor prefixes
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Grouping media queries

const sass = gulpSass(dartSass);

export const scss = () => {
  return (
    app.gulp
      .src(app.path.src.scss, { sourcemaps: app.isDev }) // path to src
      // error processing
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'SCSS',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      // compiled css files
      .pipe(
        sass({
          outputStyle: 'expanded',
        })
      )
      .pipe(app.plugins.replace(/@img\//g, '../img/')) // replace '@img' to correct path
      .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries())) // Grouping media queries
      // Adding vendor prefixes
      .pipe(
        app.plugins.if(
          app.isBuild,
          autoprefixer({
            grid: true, // grid support
            overrideBrowserslist: ['last 3 versions'],
            cascade: true,
          })
        )
      )
      // Output of WEBP images
      .pipe(
        app.plugins.if(
          app.isBuild,
          webpcss({
            // if the browser supports webp and if not (need "webp-converter": "2.2.3", just that version)
            webpClass: '.webp',
            noWebpClass: '.no-webp',
          })
        )
      )
      .pipe(app.gulp.dest(app.path.build.css)) // comment if you not need an uncompressed duplicate css
      .pipe(app.plugins.if(app.isBuild, cleanCss()))
      // rename dest css
      .pipe(
        rename({
          extname: '.min.css',
        })
      )
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream())
  );
};
