#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import ora from "ora";
const TGA = require("tga");

const program = new Command();

program.description(
  "Find non-square & size is not 2 to the nth power images in a specific folder."
);
program.name("oneoneeyes");
// program.option("-p, --path <char>", "folder path");

program.parse();

const folderPath = program.args[0];

if (fs.existsSync(folderPath)) {
  const spinner = ora("Processing...").start();
  const result: string[] = [];

  fs.readdirSync(path.resolve(folderPath)).forEach((fileName: string) => {
    const lowerCaseFileName = fileName.toLowerCase();
    const filePath = path.resolve(folderPath, fileName);

    if (
      lowerCaseFileName.endsWith(".png") ||
      lowerCaseFileName.endsWith(".tga")
    ) {
      try {
        const imageInfo = getImageInfo(lowerCaseFileName, filePath);

        if (imageInfo?.width !== imageInfo?.height) {
          result.push(`fileName: ${fileName}, reason: width != height.`);
        } else if (!check2(imageInfo?.width || 0)) {
          result.push(
            `fileName: ${fileName}, reason: size is not 2 to the nth power.`
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  if (result.length) {
    spinner.fail(`${result.length} IMAGES FAILED：`);
    console.log(result);
  } else {
    spinner.succeed("ALL PASSED, CONGRATULATIONS!");
  }
} else {
  console.log("ERROR: PATH IS NOT EXISTS.");
}

function getImageInfo(fileName: string, filePath: string) {
  let imageInfo: any;

  if (fileName.endsWith("png")) {
    imageInfo = sizeOf(filePath);
  } else {
    imageInfo = new TGA(fs.readFileSync(filePath));
  }

  return imageInfo;
}

// check num is '2 to the nth power'
function check2(num: number) {
  return num > 0 && (num & (num - 1)) === 0;
}
