#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import sizeOf from "image-size";
const TGA = require("tga");

const program = new Command();

program.description("Find non-square images in folder.");
program.name("find-images");
// program.option("-p, --path <char>", "folder path");

program.parse();

const folderPath = program.args[0];

if (fs.existsSync(folderPath)) {
  const result: string[] = [];
  fs.readdirSync(path.resolve(folderPath)).forEach((fileName: string) => {
    const lowerCaseFileName = fileName.toLowerCase();
    const fielPath = path.resolve(folderPath, fileName);
    if (lowerCaseFileName.endsWith(".png")) {
      try {
        const imageInfo = sizeOf(fielPath);

        if (
          imageInfo?.width !== imageInfo?.height ||
          check2(imageInfo?.width || 0)
        ) {
          result.push(fileName);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (lowerCaseFileName.endsWith(".tga")) {
      const tgaImage = new TGA(fs.readFileSync(fielPath));

      if (
        tgaImage?.width !== tgaImage?.height ||
        check2(tgaImage?.width || 0)
      ) {
        result.push(fileName);
      }
    }
  });
  console.log("INCORRECT FILES: ", result);
} else {
  console.log("ERROR: PATH IS NOT EXISTS.");
}

function check2(num: number) {
  return num > 0 && (num & (num - 1)) == 0;
}
