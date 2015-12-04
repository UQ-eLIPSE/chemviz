var gulp = require('gulp');
var download = require('gulp-download');
var webserver = require('gulp-webserver');

// Build Dependencies
var clean = require('gulp-clean');
var qunit = require('node-qunit-phantomjs');
var documentation = require('gulp-documentation');
var jshint = require('gulp-jshint');

gulp.task('test', function() {
    gulp.src('test/*')
        .pipe(gulp.dest('build'));
});

gulp.task('testrunner', ['test'], function() {
    qunit('build/tests.html');
});

gulp.task('lint', function() {
    return gulp.src('app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', ['clean'], function() {
    gulp.src('app/js/*')
        .pipe(gulp.dest('build/js'));

    gulp.src("app/img/*")
        .pipe(gulp.dest('build/img'));

    gulp.src("app/index.html")
        .pipe(gulp.dest('build'));

});

gulp.task('docs', function() {
    gulp.src('app/js/*.js')
        .pipe(documentation({ format: 'html'}))
        .pipe(gulp.dest('doc'))
});

gulp.task('download', ['clean', 'build'], function() {
    // Download the threejs dependencies
    download("https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.min.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/controls/OrbitControls.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/utils/FontUtils.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/geometries/TextGeometry.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/src/extras/geometries/TorusGeometry.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/LICENSE")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/LICENSE")
        .pipe(gulp.dest('build/js/fonts'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.js")
        .pipe(gulp.dest('build/js/fonts'));
});

gulp.task('clean', function() {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('run', function() {
    gulp.src('build')
        .pipe(webserver({
            open: true
            }));
});

gulp.task('default', ['clean', 'build', 'download']);
