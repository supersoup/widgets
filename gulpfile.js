const path = require('path');
const { src, dest, series } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');

function buildScss() {
	return src('lib/commonStyle/widgets.scss')
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(rename({extname: '.css'}))
		.pipe(dest('lib/commonStyle/'))
}

exports.build = series(buildScss);