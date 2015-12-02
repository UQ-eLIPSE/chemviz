var gulp = require('gulp');
var download = require('gulp-download');
var webserver = require('gulp-webserver');

// Build Dependencies
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');

gulp.task('build', ['clean'], function() {
    gulp.src('app/js/*')
        .pipe(gulp.dest('build/js'));

    gulp.src("app/img/*")
        .pipe(gulp.dest('build/img'));

    gulp.src("app/index.html")
        .pipe(gulp.dest('build'));
    
});

gulp.task('download', ['clean', 'build'], function() {
    // Download the threejs dependencies
    download("https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.min.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/controls/OrbitControls.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/utils/FontUtils.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/js/geometries/TextGeometry.js")
        .pipe(gulp.dest('build/js/threejs'));
    
    download("https://raw.githubusercontent.com/mrdoob/three.js/master/src/extras/geometries/TorusGeometry.js")
        .pipe(gulp.dest('build/js/threejs'));

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
