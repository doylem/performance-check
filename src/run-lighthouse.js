const lighthouse = require("lighthouse")
const chromeLauncher = require("chrome-launcher")
const { reportResults } = require("./report-results")

const runEnvironment = "local"
const url =
  "https://s3.eu-west-1.amazonaws.com/static.zdassets.com/web_widget/c820e2a979b12246651aaad8d2a4001d35aee18d/messenger/performance-c820e2a979b12246651aaad8d2a4001d35aee18d.html?__zE_ac_version=c820e2a979b12246651aaad8d2a4001d35aee18d"
const lighthouseOptionsArray = [
  {
    extends: "lighthouse:default",
    settings: {
      onlyCategories: ["accessibility"],
      emulatedFormFactor: "desktop",
      output: ["html", "json"],
    },
  },
  {
    extends: "lighthouse:default",
    settings: {
      onlyCategories: ["accessibility"],
      emulatedFormFactor: "mobile",
      output: ["html", "json"],
    },
  },
]

function wait(val) {
  return new Promise((resolve) => setTimeout(resolve, val))
}

function launchLighthouse(optionSet, opts, results) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(async (chrome) => {
      opts.port = chrome.port
      try {
        results = await lighthouse(url, opts, optionSet)
      } catch (e) {
        console.error("lighthouse", e)
      }
      if (results) reportResults(results, runEnvironment, optionSet, chrome)
      await wait(500)
      chrome.kill()
    })
}

async function runLighthouseAnalysis() {
  let results
  const opts = {
    chromeFlags: ["--no-sandbox", "--headless"],
  }
  for (const optionSet of lighthouseOptionsArray) {
    console.log("****** Starting Lighthouse analysis ******")
    await launchLighthouse(optionSet, opts, results)
  }
}

runLighthouseAnalysis()
