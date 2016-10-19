var gulp = require('gulp'),
	runSequence = require('run-sequence'),
	uglify = require('gulp-uglify'),
	minifycss = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	sass = require('gulp-sass'),
	svgmin = require('gulp-svgmin');


gulp.task('build', function () {
	runSequence('sass', 'cssmin', 'compress', 'compressimages', 'copyhtml', 'svgmin', 'copyassets');
});

gulp.task('cssmin', function () {
	return gulp.src('dev/*.css')
		.pipe(minifycss())
		.pipe(gulp.dest('prod'));
});

gulp.task('sass', function () {
	return gulp.src('dev/*.scss')
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(gulp.dest('dev'));
});

gulp.task('compress', function () {
	return gulp.src('dev/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('prod'));
});

gulp.task('compressimages', function () {
	return gulp.src(['dev/*.jpg', 'dev/*.png'])
		.pipe(imagemin({
			progressive: false,
			use: [pngquant()]
		}))
		.pipe(gulp.dest('prod'));
});

gulp.task('copyhtml', function () {
	gulp.src('dev/index.html')
		.pipe(gulp.dest('prod'));
});

gulp.task('copyassets', function () {
	gulp.src(['dev/*.woff'])
		.pipe(gulp.dest('prod'));
});

gulp.task('svgmin', function () {
	return gulp.src('dev/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest('prod'));
});

gulp.task('sass:watch', function () {
	gulp.watch('dev/*.scss', ['sass']);
});
