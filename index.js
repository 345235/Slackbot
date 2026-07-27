const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

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
    + "\n/hackbot-github - Posts infos and a link for your github account"
     + "\n/hackbot-todo - makes a todo for you or other"
     + "\n /hackbot-todocomplete - marked the todo you complet as complete"
    + "\n/hackbot-tododelete - deletes the todo you created"
  });
});

app.command("/hackbot-repo", async ({ ack , respond}) => {
  await ack
  await respond ({
    text:"Thats the repo of this slackbot https://github.com/345235/Slackbot :"
  })

})



app.command ("/hackbot-github", async (command, ack, respond) => {
  await ack();
  const response = await axios.get(`https://api.github.com/users/${command.text}`);
  if (command.text === "") {
    await respond({
      text: "Please provide a GitHub username. Usage: /hackbot-github <username>",
    });
  }
  const user = response.data;
  await respond ({
    text: `Github User: ${user.login}\nName: ${user.name}\nPublic Repos: ${user.public_repos}\nProfile Link ${user.html_url}` 
  })

  
})


app.command("/hackbot-todo", async ({ command, ack, respond}) => {
  await ack();
  if (command.text === "") {
    await respond({
      text:"Please provide a todo title. Usage: /hackbot-todo <title>"
    })
  }
  const todo = await axios.post("https://jsonplaceholder.typicode.com/todos", {
  userId: 1,
  title: command.text,
  completed: false,
  });
  await respond({
    text: `Todo: ${todo.data.title} ID: ${todo.data.id} status: ${todo.data.completed ? "Completed" : "Not Completed"}` 
    
  });
});



app.command("/hackbot-todocomplete", async ({command, ack, respond}) => {
await ack();
if (command.text ==="") {
  await respond({
    text:"Please provide a todo id. Usage: /hackbot-todocomplete <id>"
  })
}
const todoId = command.text;
const todo = await axios.put(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
  completed: true,
});
await respond({
  text: `Todo: ${todo.data.title} ID: ${todo.data.id} status: ${todo.data.completed ? "Completed"}
})
})
