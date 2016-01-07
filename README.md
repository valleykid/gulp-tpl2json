# gulp-tpl2json
Make template files into JSON

## Install

```
$ npm install --save-dev gulp-tpl2json
```


## Usage

### `src/test1.tpl`

```erb
<h1>Hello <%= name %></h1>
```

### `src/test2.tpl`

```erb
<header>template <%= path %></header>
```

### `gulpfile.js`

```js
var gulp = require('gulp');
var tpl2json = require('gulp-tpl2json');

gulp.task('default', function () {
	return gulp.src('src/greeting.html')
		.pipe(tpl2json('template.js'/*, {newLine:'\n', expression:'var a = '}*/))
		.pipe(gulp.dest('dist'));
});
```

### `dist/template.js`

```html
{"test1.tpl":"<h1>Hello Sindre</h1>","test2.tpl":"<header>template <%= path %></header>"}
```


## Notes


## License

MIT
