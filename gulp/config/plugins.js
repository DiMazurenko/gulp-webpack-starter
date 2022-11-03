import replace from 'gulp-replace'; // search and replace file
import plumber from 'gulp-plumber'; // Error processing
import notify from 'gulp-notify'; // notify (prompt)
import browsersync from 'browser-sync'; // localhost
import newer from 'gulp-newer'; // Проверка обновления
import ifPlugin from 'gulp-if'; // Условное ветвление

export const plugins = {
  replace: replace,
  plumber: plumber,
  notify: notify,
  browsersync: browsersync,
  newer: newer,
  if: ifPlugin,
};
