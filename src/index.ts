import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import * as restify from "restify";
import notificationTemplate from "./adaptiveCards/notification-default.json";
import { notificationApp } from "./internal/initialize";
import { CardData } from "./cardModels";
import { TeamsBot } from "./teamsBot";
import { ActivityTypes, BotHandler, TeamsActivityHandler, TurnContext } from "botbuilder";

// Create HTTP server.
const teamsBot = new TeamsBot();


const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nApp Started, ${server.name} listening to ${server.url}`);
});

// Register an API endpoint with `restify`.
//
// This endpoint is provided by your application to listen to events. You can configure
// your IT processes, other applications, background tasks, etc - to POST events to this
// endpoint.
//
// In response to events, this function sends Adaptive Cards to Teams. You can update the logic in this function
// to suit your needs. You can enrich the event with additional data and send an Adaptive Card as required.
//
// You can add authentication / authorization for this API. Refer to
// https://aka.ms/teamsfx-notification for more details.

server.post(
  "/api/notification",
  restify.plugins.queryParser(),
  restify.plugins.bodyParser(), // Add more parsers if needed
  async (req, res) => {
   try {
     //await notificationApp.requestHandler(req, res, async (context) => {
        const channelId =
          "19:m4dMACXOeQJChaNf8jCP0zkfQUKtvVMKaS5qL5mPllw1@thread.tacv2";
    
    
       //  const adapter = notificationApp.adapter; // Assuming this is available
       //  const context = new TurnContext(adapter, req);

       //console.log("im running");
       //await teamsBot.sendMessageToChannel(channelId, "message", context);
    // });
   } catch (e) {
     console.log("noti :", e);
   }

    res.json({});
  }
);

server.post("/api/messages"  ,
restify.plugins.queryParser(),
restify.plugins.bodyParser(), // Add more parsers if needed, 
  async (req, res) => {
console.log('req :', req);
try{
  await notificationApp.requestHandler(req, res, async (context) => {
    console.log("context :", context);
    await teamsBot.run(context);
    console.log("im running");
    const channelId =
      "19:m4dMACXOeQJChaNf8jCP0zkfQUKtvVMKaS5qL5mPllw1@thread.tacv2";
    //  const adapter = notificationApp.adapter; // Assuming this is available
    //  const context = new TurnContext(adapter, req);

    //console.log("im running");
    //await teamsBot.sendMessageToChannel(channelId, "message", context);
  });
}
catch(e){
console.log('e :', e);

}
});
