const fs = require("fs");
const path = require("path");
const { Command } = require("commander");
const AdmZip = require("adm-zip");
const { Queue } = require("./lib/queue");
const sharp = require("sharp");

const program = new Command();

program
  .option("-s|--src <SRC>", "Azure architecture icons zip file path.")
  .option("-d|--dest <DEST", "Destination folder path.");

program.parse(process.argv);

const options = program.opts();

const src = options.src ?? "./Azure_Public_Service_Icons_V4.zip";
const dest = options.dest ?? "./dest";

// Unzip

if (!fs.existsSync(src)) {
  throw new Error(`'${src}' is not found.`);
}

const extractPath = "./svg/";
if (fs.existsSync(extractPath)) {
  console.log(
    "'svg' folder exists. If the SVG file is not extracted, delete 'svg' folder and try again."
  );
} else {
  const zip = new AdmZip(src);
  zip.extractAllTo(extractPath, true);
  console.log("Extracted to 'svg' folder.");
}

// find svg

function findSvgs(findDirPath) {
  const queue = new Queue();
  queue.enqueue(findDirPath);

  const svgs = [];

  while (true) {
    const item = queue.tryDequeue();
    if (item.error) {
      break;
    }
    const dirPath = item.value;
    const names = fs.readdirSync(dirPath);

    for (let i = 0; i < names.length; ++i) {
      const name = names[i];
      const p = path.join(dirPath, name);

      const stat = fs.lstatSync(p);
      if (stat.isDirectory()) {
        queue.enqueue(p);
      } else if (path.extname(name).toLowerCase() === ".svg") {
        svgs.push(p);
      }
    }
  }
  return svgs;
}
const svgs = findSvgs(extractPath);

// Convert to PNG
const newSize = 256;
const oldSize = 18;
const svgInnerReg = /<svg.+?>(.+)<\/svg>/s;
const extractFullPath = path.resolve(extractPath);
for (let i = 0; i < svgs.length; ++i) {
  const svgFullPath = path.resolve(svgs[i]);
  const relativePath = svgFullPath.substring(extractFullPath.length);
  const destPngPath = path.join(dest, relativePath).slice(0, -3) + "png";
  const destPngDir = path.dirname(destPngPath);

  fs.mkdirSync(destPngDir, { recursive: true });

  const content = fs.readFileSync(svgFullPath, { encoding: "utf-8" });

  const group = content.match(svgInnerReg);
  const inner = group[1];
  const matrixScale = newSize / oldSize;
  const newSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${newSize}" height="${newSize}" viewBox="0 0 ${newSize} ${newSize}"><g transform="matrix(${matrixScale},0,0,${matrixScale},0,0)">` +
    inner +
    "</g></svg>";

  fs.writeFileSync(destPngPath + ".svg", newSvg, { encoding: "utf-8" });
  const buffer = Buffer.from(newSvg, "utf-8");
  sharp(buffer)
    .png()
    .toFile(destPngPath, (err, info) => {
      if (err) {
        console.log(`Faild convert. (${path.basename(svgFullPath)})`);
        console.log(err);
      } else {
        console.log(
          `'${path.basename(svgFullPath)}' -> '${path.basename(destPngPath)}'`
        );
      }
    });
}

console.log("end");
