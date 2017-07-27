#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var fs_1 = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var directory = "";
var output = "";
program.version("0.1.0").option("<dir> [output]").action(function (dir, out) {
    directory = dir;
    if (typeof out !== "string") {
        throw new Error(typeof out);
    }
    output = out;
});
program.parse(process.argv);
// if (output === "") {
//   throw new Error("I dunno");
// }
console.log(directory, output);
// console.log(readdirSync(directory));
function walk(root, cb) {
    var entries = fs_1.readdirSync(root);
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var filePath = path.join(root, entry);
        var stats = fs_1.statSync(filePath);
        if (stats.isDirectory()) {
            walk(filePath, cb);
        }
        else {
            cb(filePath);
        }
    }
}
var classFinder = /^class /gm;
walk(directory, function (filePath) {
    var contents = fs_1.readFileSync(filePath).toString();
    var replacement = contents.replace(classFinder, "@:expose\nclass ");
    try {
        console.log('Path: ', path.dirname(filePath));
        mkdirp.sync(path.join(output, path.dirname(filePath)));
    }
    catch (err) {
        console.log(err);
    }
    fs_1.writeFileSync(path.join(output, filePath), replacement);
});
