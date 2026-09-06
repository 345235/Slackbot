const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");
const { getGithubUsername, setGithubUsername } = require("./store");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});
// that is the code for the ping command
app.command("/hackbot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/simple-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: "Available Commands:"
    + "\n/hackbot-ping - Check bot latency"
    + "\n/hackbot-repo - Get the bot's repository link"
    + "\n/hackbot-github @someone - Posts github infos form the mentioned person"
    + "\n/hackbot-linkgithub <github-username> - Links your slack account to your github account "
     + "\n/hackbot-todo - makes a todo for you or other"
    
  });
});

app.command("/hackbot-repo", async ({ ack , respond}) => {
  await ack();
  await respond ({
    text:"Thats the repo of this slackbot https://github.com/345235/Slackbot"
  })
  
})

function extractMentionedUserId(text){
  const match = (text || "").trim().match(/^<@([A-Z0-9]+)(\|[^>]*)?>$/);
  return match ? match[1] : null;
}

app.command("/hackbot-github", async ({ command, ack, respond, client }) => {
  await ack();

  const slackUserId = extractMentionedUserId(command.text);
  if (!slackUserId) {
    await respond({
      text: "Please @-mention a Slack user . Usage: /hackbot-github @someone",
    });
    return;
  }
const githubUsername=getGithubUsername(slackUserId);
if (!githubUsername) {
  const { user } = await client.users.info ({ user: slackUserId});
await respond ({
  text:"${user.real_name || user.name} hasn't linked a Github account. Please ask them to run /hackbot-linkgithub "
});
return;
}


  try {
    const res = await axios.get(`https://api.github.com/users/${encodeURIComponent(githubUsername)}`);
    const user = res.data;
    await respond({
      text:
        `Github User: ${user.login}\n` +
        `Name: ${user.name || "N/A"}\n` +
        `Public Repos: ${user.public_repos}\n` +
        `Profile Link: ${user.html_url}`,
    });
  } catch (error) {
    await respond({
      text: `Could not fetch GitHub user "${githubUsername}". Please check the username and try again.`,
    });
  }
});

app.command("/hackbot-linkgithub", async ({command, ack, respond}) => {
await ack ();
const username = (command.text || "").trim().replace(/^@/,"");
if (!username){
  await respond ({
    text: "Please provide a Github username. How it should look: /hackbot-linkgithub <githubusername>"
  });
return
}
 setGithubUsername(command.user_id, username);
  await respond({
    text: `Linked your Slack account to GitHub user "${username}".`,
  });
});

app.command("/hackbot-todo", async ({ command, ack, respond}) => {
  await ack();
  if (!command.text) {
    await respond({
      text:"Please provide a todo title. Usage: /hackbot-todo <title>"
    })
    return;
  }

  try {
  const todo = await axios.post("https://jsonplaceholder.typicode.com/todos", {
  title: command.text,
  completed: false,
  });
  await respond({
    text: `
    Todo: ${todo.data.title} 
    

  ` 
   
  });
  }
  catch (error) {
    await respond({
      text: `Could not create your todo.`,
    });
  }
});