import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import * as restify from "restify";
import notificationTemplate from "./adaptiveCards/notification-default.json";
import { notificationApp } from "./internal/initialize";
import { CardData } from "./cardModels";
import { TeamsBot } from "./teamsBot";

// Create HTTP server.
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

function extractChannelIdFromTeamsUrl(url) {
  const regex = /\/channel\/([^\/?]+)/;
  const match = url.match(regex);

  if (match && match[1]) {
    // Decode the extracted channel ID

    const channelId = decodeURIComponent(match[1]);
    return channelId;
  } else {
    // Return null or handle the case when the channel ID is not found
    return null;
  }
}
server.post(
  "/api/notification",
  restify.plugins.queryParser(),
  restify.plugins.bodyParser(), // Add more parsers if needed
  async (req, res) => {
    // By default this function will iterate all the installation points and send an Adaptive Card
    // to every installation.
    const pageSize = 100;
    let continuationToken: string | undefined = undefined;

    const link =
      "https://teams.microsoft.com/l/channel/19%3arThf8rXn9SuHW9HXa_7ubHpdlRtafFrcbn76rANtN681%40thread.tacv2/General?groupId=b21eba14-2733-4976-9e8e-9e046a9c340e&tenantId=58ccd57c-6495-4bc8-842a-c181885cea2b";

    const channelId = extractChannelIdFromTeamsUrl(link);

    // Have to add our own channel id here for testing
    const mockChannelID =
      "19%3arThf8rXn9SuHW9HXa_7ubHpdlRtafFrcbn76rANtN681%40thread.tacv2";

    const channelData = await notificationApp.notification.findChannel(
      async (channel) => channel.info.id === mockChannelID
    );

    channelData?.sendAdaptiveCard(req.body);

    // do {
    //   const pagedData =
    //     await notificationApp.notification.getPagedInstallations(
    //       pageSize,
    //       continuationToken
    //     );

    //   const installations = pagedData.data;

    //   continuationToken = pagedData.continuationToken;

    //   for (const target of installations) {
    //     await target.sendAdaptiveCard(
    //       req.body?.formattedCardPayload?.attachments?.[0]?.content
    //     );
    //   }
    // } while (continuationToken);

    res.json({});
  }
);

// Register an API endpoint with `restify`. Teams sends messages to your application
// through this endpoint.
//
// The Teams Toolkit bot registration configures the bot with `/api/messages` as the
// Bot Framework endpoint. If you customize this route, update the Bot registration
// in `/templates/provision/bot.bicep`.
const teamsBot = new TeamsBot();
server.post("/api/messages", async (req, res) => {
  await notificationApp.requestHandler(req, res, async (context) => {
    await teamsBot.run(context);
  });
});
