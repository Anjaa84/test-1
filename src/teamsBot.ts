import { ActivityTypes, TeamsActivityHandler, TurnContext } from "botbuilder";

// An empty teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
export class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();
  }
  protected onTurnActivity(context: TurnContext): Promise<void> {
    // Add your custom logic here

    if (context.activity.type === ActivityTypes.ConversationUpdate) {
      if (
        context.activity.membersAdded.some(
          (member) => member.id === context.activity.recipient.id
        )
      ) {
        const teamId = context.activity.conversation.id;
        const channelData = context.activity.channelData;
        const channelId = channelData.channel.id;
        // Store or use the channelId as needed

        console.log(
          `Bot added to channel:
${channelId}
`
        );
      }
    }
    return;
  }
}
