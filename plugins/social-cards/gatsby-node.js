// TODO only do this when in production mode ?
const puppeteer = require("puppeteer");
const { spawn, exec } = require("child_process");
const { promises: fs } = require("fs");
/*

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
*/

// TODO make all this configurable
const PORT = "9017";
const filePrefix = "social-card-";
const fileExt = ".png";
const selector = "#gatsby-social-card";
const publicDir = "./public/";
const staticDir = `${publicDir}static/`;
const search = "?generateSocialCard";

const hashCache = {};

// TODO do this in batches.
const takeScreenshot = async (page, hash) => {
  const { path } = hashCache[hash];
  const timer = new Date();
  const url = `http://localhost:${PORT}${path}${search}`;
  const imgPath = `${staticDir}${filePrefix}${hash}${fileExt}`;

  await page.goto(url);
  try {
    await page.waitForSelector(selector, { timeout: 4000 }); // wait up to 4 seconds (!)
  } catch (e) {
    console.log(
      `Page ${url}, did not have social image component, skipping...`
    );
    return;
  }
  // TODO option to take multiple sized shots
  await page.screenshot({
    path: imgPath,
    clip: {
      x: 0,
      y: 0,
      width: 1200,
      height: 632,
    },
  });

  console.log(`${new Date() - timer}ms - ${url} -> ${imgPath}`);
};

async function startPuppeteer() {
  // START WEB SERVER AND PUPPETEER
  // TODO set a different port
  // TODO find a better way to do this, don't start the server unless we need to.
  // TODO have some way of creating a random port and killing it aterwards
  exec(`fuser -k ${PORT}/tcp`);
  // start the server
  const server = spawn("./node_modules/.bin/gatsby", ["serve", "--port", PORT]);
  await new Promise((resolve, reject) => {
    server.stdout.on("data", async (data) => {
      if (`${data}`.includes("You can now view")) {
        // if there are files that need generting, start puppeteer
        // TODO replace with aws lambda functionm if available for use with netlify
        const browser = await puppeteer.launch({
          // TODO allow this option to be passed for use inside docker (like now)
          executablePath: "/usr/bin/google-chrome",
          args: ["--no-sandbox"],
        });
        // TODO parralelize this into a few pages...
        const page = await browser.newPage();
        for (const hash of Object.keys(hashCache)) {
          if (hashCache[hash].generated) {
            await takeScreenshot(page, hash);
          }
        }
        await browser.close();
        resolve();
      }
      if (`${data}`.includes("Something is already running at")) {
        reject(
          `Server is already running on port ${PORT}, please stop the server (pkill node)`
        );
      }
    });
    server.stderr.on("data", (data) => {
      reject(`stderr: ${data}`);
    });
    server.on("exit", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });

  server.kill();
}

async function takeScreenshots(graphql) {
  // check for existing images
  (await fs.readdir(staticDir)).forEach((file) => {
    if (file.startsWith(filePrefix)) {
      const hash = file.split(".")[0].replace(filePrefix, "");
      hashCache[hash] = {};
    }
  });
  // query all pages that need images
  const pages = await graphql(`
    query AllSitePage {
      allSitePage {
        edges {
          node {
            path
          }
        }
      }
    }
  `);
  // filter 404 pages
  const filteredPage = pages.data.allSitePage.edges.filter(
    (edge) => !edge.node.path.includes("/404")
  );

  let generated = 0;
  let cached = 0;

  // parse the raw HTML files to quickly check if there's an og:image hash,
  // we can skip pupeteer loading this page if we know there's a cached image
  for (const edge of filteredPage) {
    const htmlPath = `${publicDir}${edge.node.path}/index.html`;
    const data = await fs.readFile(htmlPath, "utf8");
    const match = data.match(
      /(.?!<meta.)*?property="og:image".*?content="(.*?)".*?>/
    );
    const fileName = match[2] && match[2].split("/").pop().split(".")[0];
    // ignore files that don't use our plugin
    if (fileName.startsWith(filePrefix)) {
      const hash = fileName.replace(filePrefix, "");
      const toGenerate = !hashCache[hash];
      if (toGenerate) {
        generated += 1;
      } else {
        cached += 1;
      }
      hashCache[hash] = {
        keep: true,
        generated: !hashCache[hash],
        path: edge.node.path,
      };
    }
  }
  // console.log(hashCache);

  // only run expensive server / pupeteer stuff if we need to
  if (generated > 0) {
    await startPuppeteer();
  }

  let deleted = 0;

  // remove unused files
  for (const hash of Object.keys(hashCache)) {
    if (!hashCache[hash].keep) {
      console.log("deleting", `${staticDir}${filePrefix}${hash}${fileExt}`);
      await fs.unlink(`${staticDir}${filePrefix}${hash}${fileExt}`);
      deleted += 1;
    }
  }

  return { generated, cached, deleted };
}

exports.onPostBuild = async ({ graphql, reporter }) => {
  reporter.info("Generating social cards...");
  const { generated, cached, deleted } = await takeScreenshots(graphql);
  reporter.info(
    `Created social cards: ${generated} new, ${cached} cached, ${deleted} removed.`
  );
};
