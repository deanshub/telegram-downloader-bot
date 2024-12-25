import { Telegraf } from "telegraf";
import { download } from "./download";

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set");
}

// Configure bot with local API server
const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {
    apiRoot: process.env.LOCAL_API_ROOT || "http://localhost:8081", // Adjust the URL according to your local Bot API server
    // apiMode: "user",
  },
});

bot.start((ctx) => ctx.reply("Welcome"));

bot.on("message", async (ctx) => {
  try {
    if ("video" in ctx.message) {
      const video = ctx.message.video;
      console.log(video.file_id);

      // Using local Bot API server for file download
      const file = await ctx.telegram.getFileLink(video.file_id);
      console.log("File URL:", file.href);
      await download(file.href, video.file_name ?? `${Date.now()}.mp4`);

      // You can now download larger files through your local server
      await ctx.reply("Video received successfully!");
    }
  } catch (error) {
    console.error("Error processing video:", error);
    await ctx.reply("Sorry, there was an error processing your video.");
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
