import fs from 'fs';
import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';

// convert .otf to .ttf
export const otfToTtf = () => {
  return (
    app.gulp
      .src(`${app.path.srcFolder}/fonts/*.otf`, {}) // looking for .otf font files
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'FONTS',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      // convert to .ttf
      .pipe(
        fonter({
          formats: ['ttf'],
        })
      )
      .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`)) // upload back to src folder
  );
};

// convert .ttf to .woff and .woff2
export const ttfToWoff = () => {
  // looking for .ttf fonts
  return (
    app.gulp
      .src(`${app.path.srcFolder}/fonts/*.ttf`, {})
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'FONTS',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      // convert to .woff
      .pipe(
        fonter({
          formats: ['woff'],
        })
      )
      // upload to result
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
      // looking for .ttf fonts
      .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
      // convert to .woff2
      .pipe(ttf2woff2())
      // upload to result
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
      // looking for .woff и woff2
      .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.{woff,woff2}`))
      // upload to result
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
  );
};

// add fonts to stylesheet
export const fontsStyle = () => {
  // font connection style file
  let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
  // check if font files exist
  fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
    if (fontsFiles) {
      // checking if a style file exists for connecting fonts
      if (!fs.existsSync(fontsFile)) {
        // if the file does not exist, create it
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (var i = 0; i < fontsFiles.length; i++) {
          // writing font connections to a style file
          let fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            let fontName = fontFileName.split('-')[0]
              ? fontFileName.split('-')[0]
              : fontFileName;
            let fontWeight = fontFileName.split('-')[1]
              ? fontFileName.split('-')[1]
              : fontFileName;
            if (fontWeight.toLowerCase() === 'thin') {
              fontWeight = 100;
            } else if (fontWeight.toLowerCase() === 'extralight') {
              fontWeight = 200;
            } else if (fontWeight.toLowerCase() === 'light') {
              fontWeight = 300;
            } else if (fontWeight.toLowerCase() === 'medium') {
              fontWeight = 500;
            } else if (fontWeight.toLowerCase() === 'semibold') {
              fontWeight = 600;
            } else if (fontWeight.toLowerCase() === 'bold') {
              fontWeight = 700;
            } else if (
              fontWeight.toLowerCase() === 'extrabold' ||
              fontWeight.toLowerCase() === 'heavy'
            ) {
              fontWeight = 800;
            } else if (fontWeight.toLowerCase() === 'black') {
              fontWeight = 900;
            } else {
              fontWeight = 400;
            }
            fs.appendFile(
              fontsFile,
              `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
              cb
            );
            newFileOnly = fontFileName;
          }
        }
      } else {
        // if file exists, display a message
        console.log(
          'Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить!'
        );
      }
    }
  });

  return app.gulp.src(`${app.path.srcFolder}`);
  function cb() {}
};
