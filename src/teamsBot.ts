import { TeamsUserCredential } from "@microsoft/teamsfx";
import { ActivityEventNames, ActivityTypes, InstallationUpdateActionTypes, MessageFactory, TeamsActivityHandler, TeamsInfo, TurnContext, teamsGetChannelId } from "botbuilder";
import { debug } from "console";
import { debuglog } from "util";

// An empty teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
export class TeamsBot extends TeamsActivityHandler {

  constructor() {
    super();
     this.onMessage(async (context, next) => {
       const teamsChannelId = teamsGetChannelId(context.activity);
           const channelId =
             "19:m4dMACXOeQJChaNf8jCP0zkfQUKtvVMKaS5qL5mPllw1@thread.tacv2";

       const activity = {
         type: ActivityTypes.Message,
         teamsChannelId,
         text: "hey i'm working",
       };
      await context.sendActivity(activity);
       await next();
     });
  }
  protected async onInstallationUpdateActivity(
    context: TurnContext
  ): Promise<void> {
    console.log(context.activity.action);
    if (
      context.activity.type == ActivityTypes.InstallationUpdate &&
      context.activity.action === InstallationUpdateActionTypes.Add
    ) {
      console.log("added :", context.activity.channelData);
      console.log("added :", context.activity.channelId);
      // this.sendMessageToChannel(context.activity.channelId,'bla bla blaa',context);
    } else if (
      context.activity.type == ActivityTypes.InstallationUpdate &&
      context.activity.action === InstallationUpdateActionTypes.Remove
    ) {
      console.log("removed :", context.activity);
    }

    console.log("done");
  }

  async sendMessageToChannel(
    channelId: string,
    message: string,
    context
  ): Promise<void> {
    try {
      const activity = {
        type: ActivityTypes.Message,
        channelId,
        text: message,
      };
      await context.sendActivity(activity);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}
