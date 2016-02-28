var path = require('path');
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var uglify = require('gulp-uglify');
// var react = require('gulp-react');
var babel = require('gulp-babel');
var exec = require('child_process').exec;

var pkg = require('./package.json');
var clientRoot = 'client/'

function onError(err){
  console.log(err);
  this.emit('end');
}

gulp.task('js', function () {
  return gulp.src(clientRoot + 'src/**/*.js')
    .pipe(babel({
      presets: ['react']
    }))
    // .pipe(react())      // complie React JSX template
    .on('error', onError)
    .pipe(gulp.dest(clientRoot + 'build/'));
});

gulp.task('build', ['js'], function(){
  return gulp.src(clientRoot + 'build/**/*.js')
    // .pipe(uglify())
    .pipe(gulp.dest(clientRoot + 'build/'));
});

gulp.task('pack', ['build'], function(){
  return gulp.src(clientRoot + 'build/index.js')
    .pipe(webpack({
      output: {
        filename: 'main.js',
        libraryTarget: 'umd'
      }
    }))
    .on('error', onError)
    .pipe(gulp.dest(clientRoot + 'build/'));
  // exec('webpack ./build/index.js ./build/main.js;', function(err) {
  //   if (err) return console.log(err);
  // });
})

//注册资源构建任务
gulp.task('res', function () {
  return gulp.src(clientRoot + 'src/**/*.+(png|jpg|mp3|gif|swf)')
    .pipe(gulp.dest(clientRoot + 'build/'));
});

gulp.task('watch', function(){
  gulp.watch([clientRoot + 'src/**/*.js', clientRoot + 'src/**/*.css'], ['pack']);
});

//注册一个默认任务
gulp.task('default', ['pack', 'res', 'watch']);
