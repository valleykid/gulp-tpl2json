'use strict';
var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');
var File = gutil.File;
var Concat = require('concat-with-sourcemaps');

module.exports = function(name, opt){
	if(!name){
		throw new gutil.PluginError('gulp-tpl2json', 'Missing fileName option for gulp-tpl2sjon');
	}

	opt = opt || {};
	opt.expression = opt.expression || '';
	opt.newLine = opt.newLine || '';

	var latestFile;
	var latestMod;
	var fileName;
	var concat;
	var arr = [];

	if(typeof name === 'string'){
		fileName = name;
	} else if(typeof name.path === 'string'){
		fileName = path.basename(name.path);
	} else {
		throw new gutil.PluginError('gulp-tpl2json', 'Missing fileName option for gulp-tpl2sjon');
	}

	function getstring(file, enc, cb){
		if(file.isNull()){
			cb(null, file);
			return;
		}

		if(file.isStream()){
			cb(new gutil.PluginError('gulp-tpl2json', 'Streaming not supported'));
			return;
		}

		try {
			var tpl = '"'+(file.contents.toString() || '').replace(/(\f|\n|\r|\t|\v)+/g, '').replace(/"/g, '\\"')+'"';
			var key = '"'+path.basename(file.path)+'"';
			arr.push(key + ':' + tpl);
			file.contents = new Buffer(opt.expression + '{' + arr.join(','+opt.newLine) + '}');
			//this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-tpl2json', err, {fileName:file.path}));
		}

		if(!latestMod || file.stat && file.stat.mtime>latestMod){
			latestFile = file;
			latestMod = file.stat && file.stat.mtime;
		}

		if(!concat) concat = new Concat(false, fileName);

		concat.add(file.relative, file.contents, file.sourceMap);
		//concat.content = file.contents;
		cb();
	}

	function endStream(cb){
		if(!latestFile || !concat){
			cb();
			return;
		}

		var joinedFile;

		if(typeof name==='string'){
			joinedFile = latestFile.clone({contents: false});
			joinedFile.path = path.join(latestFile.base, name);
		} else {
			joinedFile = new File(name);
		}

		//joinedFile.contents = concat.content;
		//console.log(concat.content.toString(), '/n');

		this.push(joinedFile);

		cb();
	}
	
	return through.obj(getstring, endStream);
};