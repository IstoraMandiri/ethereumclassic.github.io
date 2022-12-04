// TODO only do this when in production mode
const puppeteer = require("puppeteer");
const { spawn, exec } = require("child_process");
// const { join } = require('path');
const { promises: fs } = require("fs");
const { info } = require("console");

// const readdir = util.promisify(fs.readdir);

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

const filePrefix = "social-card-";
const fileExt = ".jpg";
const selector = "#gatsby-social-card";
const publicDir = "./public/";
const staticDir = `${publicDir}static/`;

const hashCache = {};

const takeScreenshot = async (page, path) => {
  const url = `http://localhost:9000${path}generateSocialCard`;
  // parse the raw HTML for speed
  await page.goto(url);
  try {
    await page.waitForSelector(selector, { timeout: 1000 }); // wait up to 1 second
  } catch (e) {
    console.log(
      `Page ${url}, did not have social image component, skipping...`
    );
    return;
  }
  const imgPath = `${staticDir}${filePrefix}${hash}${fileExt}`;
  console.log("screenshotting", url, imgPath);
  await page.screenshot({
    path: imgPath,
    clip: {
      x: 0,
      y: 0,
      width: 1200,
      height: 632,
    },
  });
  hashCache[hash] = { keep: true, generated: true };
};

async function takeScreenshots(graphql) {
  // TODO populate the hash cache.
  // TODO parse the raw HTML for speed
  // read static to check for hashes
  (await fs.readdir(staticDir)).forEach((file) => {
    if (file.startsWith(filePrefix)) {
      const hash = file.split(".")[0].replace(filePrefix, "");
      hashCache[hash] = {};
    }
  });

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

  // parse the raw HTML files to quickly check if there's an og:image hash
  for (const edge of pages.data.allSitePage.edges) {
    const htmlPath = `${publicDir}${edge.node.path}index.html`;
    const data = await fs.readFile(htmlPath);
    console.log("got data", data);
  }
  return;
  // if there are no files that need generting, start puppeteer
  const browser = await puppeteer.launch({
    // TODO allow this option to be bassed
    // eg for use inside docker (like now)
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  // todo clean up the cache
  for (const edge of pages.data.allSitePage.edges) {
    // TODO figure out a good name name w/ caching
    // TODO take multiple shots if configured
    await takeScreenshot(page, edge.node.path);
  }
  let generated = 0;
  let cached = 0;
  for (const hash of Object.keys(hashCache)) {
    if (!hashCache[hash].keep) {
      await fs.unlink(`${staticDir}${filePrefix}${hash}${fileExt}`);
      return;
    }
    if (hashCache[hash].generated) {
      generated += 1;
    } else {
      cached += 1;
    }
  }
  await browser.close();
  return { generated, cached };
}

exports.onPostBuild = async (params) => {
  const { graphql, reporter } = params;
  reporter.info("Generating social cards...");
  // TODO find a better way to do this
  // TODO have some way of creating a random port and killing it aterwards
  exec("fuser -k 9000/tcp");
  // start the server
  const server = spawn("./node_modules/.bin/gatsby", ["serve"]);
  await new Promise((resolve, reject) => {
    server.stdout.on("data", async (data) => {
      if (`${data}`.includes("You can now view")) {
        const { generated, cached } = await takeScreenshots(graphql);
        reporter.info(
          `Created social cards: ${generated} new, ${cached} cached`
        );
        resolve();
      }
      if (`${data}`.includes("Something is already running at")) {
        reject(
          "Server is already running on port 9000, please stop the server (pkill node)"
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
};
