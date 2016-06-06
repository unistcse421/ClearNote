var gulp = require('gulp');

var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var config = require('./server/config/environment');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var stylus = require('gulp-stylus');
var es = require('event-stream');

gulp.task('lint', function() {
  gulp.src(['./server/**/*.js', './client/**/*.js', '!./client/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
    gulp.src('./client/js/bundled.js')
      .pipe(clean({force: true}));
});

gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./client/**/*.css', '!./client/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('minify-js', function() {
  gulp.src(['./client/**/*.js', '!./client/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('copy-bower-components', function () {
  gulp.src('./client/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', function () {
  gulp.src('./client/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
	proxy: "http://localhost:" + config.port,
	files: ["client/**/*.*"],
	browser: "google chrome",
	port: 7000
    });
});

gulp.task('nodemon', ['browser-sync'], function(cb) {
    livereload.listen();
    var started = false;
    return nodemon({
	script: 'server/app.js',
	ext: 'js'
    }).on('start', function() {
	if (!started) {
	    cb();
	    started = true;
	}
    }).on('restart', function() {
	gulp.src('server/app.js')
	.pipe(livereload())
	.pipe(notify('Reloading page, please wait...'));
    });
});

gulp.task('inject', function() {
    var cssFiles = gulp.src('./client/**/*.css')
	.pipe(stylus())
	.pipe(gulp.dest('./client'));

    gulp.src('./client/index.html')
	.pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', ignorePath: 'client/', addRootSlash: false}))
	.pipe(inject(es.merge(
	    cssFiles,
	    gulp.src('./client/js/**/*.js', {read: false})
	), {ignorePath: 'client/', addRootSlash: false}))
	.pipe(gulp.dest('./client'));
});

gulp.task('connect', ['nodemon'], function(cb) {

});

gulp.task('connectDist', ['nodemon'], function(cb) {

});

gulp.task('default', function() {
    runSequence(['clean'],
		['lint', 'inject'],
		['connect']);

});

gulp.task('serveprod', function() {
    connect.server({
	port: process.env.PORT || 5000,
	livereload: false
    });
});

// gulp.task('build', function() {
//   runSequence(
//       ['clean'],
//       ['lint', 'minify-css', 'minify-js', 'copy-html-files', 'copy-bower-components'],
//       ['connectDist']
//   );
// });
