// Requires
var fs = require('fs');
var path = require('path');
var UglifyJS = require("uglify-js");

// Helpers
var root = path.resolve(__dirname, '..');
var dist = path.join(root, 'dist');

// 
var source = fs.readFileSync(path.join(root, 'src/privy.js')).toString().replace(/\s+$/, '');
var config = require(path.join(root, 'package.json'));

var basename = config.name;

// Define the different environments
var environments = {
	browser: "if (typeof window.Privy !== 'undefined') {\n    console.error('Unable to load: another Privy already exists.');\n} else {\n    window.Privy = " + source + "();\n}\n",
	commonjs: "module.exports = " + source + "();\n",
	amd: "define" + source + ";\n"
};

Object.keys(environments).forEach(function (key) {
	var pathname = path.join(dist, basename + '-' + key);

	var fullcode = environments[key];
	var mincode = UglifyJS.minify(fullcode, { fromString: true }).code;

	fs.writeFileSync(pathname + '.js', fullcode);
	fs.writeFileSync(pathname + '.min.js', mincode);
});