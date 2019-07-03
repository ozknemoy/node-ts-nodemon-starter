var browserSync = require('browser-sync');

browserSync({
  port: 3001,
  proxy: 'localhost:3000',
  files: [
    'views/**/*.hbs',
    'public/js/app.js',
    'public/css/index.css'
  ]
});