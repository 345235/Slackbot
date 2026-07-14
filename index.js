const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

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
    text: "Available Commands:/hackbot-ping - Check bot latency"
  });
});

app.command("/hackbot-ask", async ({ command, ack, respond }) => {
  await ack();
  const question = command.text;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    await respond({ text: answer });
  }
  catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    await respond({ text: "Sorry, I couldn't get an answer from OpenAI." });
  }
});


