const fs = require("fs");
const path = require("path");
 
const FILE_PATH = path.join(__dirname, "github-links.json");
 
function readAll() {
  if (!fs.existsSync(FILE_PATH)) return {};
  return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
}
 
function writeAll(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}
 
function getGithubUsername(slackUserId) {
  const data = readAll();
  return data[slackUserId] || null;
}
 
function setGithubUsername(slackUserId, githubUsername) {
  const data = readAll();
  data[slackUserId] = githubUsername;
  writeAll(data);
}
 
module.exports = { getGithubUsername, setGithubUsername };