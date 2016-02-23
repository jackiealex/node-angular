// include the required packages
import gulp from 'gulp'
import stylus from 'gulp-stylus'
import watch from 'gulp-watch'
import path from 'path'

// define global variables

const output = '../output';
const src = '../src';

gulp.task('stylus', ()=>{
	var fromDir = path.join(src, 'static/css/**/*');
	var toDir = path.join(output, 'static/css/');
	return gulp.src(fromDir)
	.pipe(stylus({
		compress: 1
	}))
	.pipe(gulp.dest(toDir));
});

gulp.task('watch-css', ()=>{
	var fromDir = path.join(src, 'static/css/**/*');
	watch(fromDir, ()=>{
		console.log(11);
	});
});





