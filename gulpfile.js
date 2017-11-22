var gulp = require('gulp');
var download = require('gulp-download');
var webserver = require('gulp-webserver');

// Build Dependencies
var clean = require('gulp-clean');
var documentation = require('gulp-documentation');
var jshint = require('gulp-jshint');
var selenium = require('selenium-standalone');
var mocha = require('gulp-mocha');

var stream = null;

gulp.task('test', function() {
    gulp.src('test/*')
        .pipe(gulp.dest('build'));
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
        .pipe(documentation('html'))
        .pipe(gulp.dest('doc'))
});

gulp.task('download', ['clean', 'build'], function() {
    // Download the threejs dependencies
    download("https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.min.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/r73/examples/js/controls/OrbitControls.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/r73/examples/js/utils/FontUtils.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/r73/examples/js/geometries/TextGeometry.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/r73/src/extras/geometries/TorusGeometry.js")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/r73/LICENSE")
        .pipe(gulp.dest('build/js/threejs'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/r73/examples/fonts/LICENSE")
        .pipe(gulp.dest('build/js/fonts'));

    download("https://raw.githubusercontent.com/mrdoob/three.js/r73/examples/fonts/helvetiker_regular.typeface.js")
        .pipe(gulp.dest('build/js/fonts'));
});

gulp.task('clean', function() {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('run', function() {
    stream = gulp.src('build')
        .pipe(webserver({
            open: false
        }));
});

gulp.task('selenium', function(done) {
    selenium.install({
        logger: function(message) {}
    }, function(err) {
        if (err) {
            return done(err);
        }

        selenium.start(function(err, child) {
            if (err) {
                return done(err);
            }
            selenium.child = child;
            done();
        });
    });
});

gulp.task('sel-start', ['run', 'selenium'], function() {
    return gulp.src('test/ui_tests.js')
        .pipe(mocha());
});

gulp.task('sel-test', ['sel-start'], function() {
    selenium.child.kill();
    if (stream) {
        stream.emit('kill');
    }
})

gulp.task('default', ['clean', 'build', 'download']);
