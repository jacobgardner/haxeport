#!/usr/bin/env node

import * as program from "commander";
import {
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  mkdirSync
} from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";

let directory = "";
let output = "";

program.version("0.1.0").option("<dir> [output]").action((dir, out) => {
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

function walk(root: string, cb: (path: string) => void) {
  const entries = readdirSync(root);

  for (const entry of entries) {
    const filePath = path.join(root, entry);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      walk(filePath, cb);
    } else {
      cb(filePath);
    }
  }
}

const classFinder = /^class /gm;

walk(directory, filePath => {
  const contents = readFileSync(filePath).toString();
  const replacement = contents.replace(classFinder, "@:expose\nclass ");

  try {
    console.log('Path: ', path.dirname(filePath));
    mkdirp.sync(path.join(output, path.dirname(filePath)));
  } catch (err) {
      console.log(err);
  }

  writeFileSync(path.join(output, filePath), replacement);
});
