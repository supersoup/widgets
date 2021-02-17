const path = require('path');
const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const ts = require('gulp-typescript');

function devEjs(cb) {
	return src('example/*/index.ejs')
		.pipe(ejs({
			ENV: 'dev',
		}))
		.pipe(rename({extname: '.html'}))
		.pipe(dest('example/'))
}

function devTypescript(cb) {
	return src('example/*/index.ts')
		.pipe(ts({
			"target": "es3",
			esModuleInterop: true,
			"module": "amd",
		}))
		.pipe(rename({extname: '.js'}))
		.pipe(dest('example/'))
}

function buildScss() {
	return src('lib/commonStyle/widgets.scss')
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(rename({extname: '.css'}))
		.pipe(dest('lib/commonStyle/'))
}

const devWatch = series(devEjs, function () {
	watch(['example/*/*.ejs'], devEjs);
	watch(['example/*/index.ts'], devTypescript);
});

exports.dev = devWatch;
exports.build = series(buildScss);