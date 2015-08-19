var gulp = require('gulp');
var less = require('gulp-less');

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });


gulp.task('less',function(){
	gulp.src('./css/**/*.less')
		.pipe(less({plugins: [autoprefix]}))
		.pipe(gulp.dest('./css'));	
})

gulp.task('watch',function(){
	gulp.watch('./css/**/*.less', ['less']);
})