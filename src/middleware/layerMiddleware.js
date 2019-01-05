import { TypingIndicators, Constants } from 'layer-websdk';
import {
  CREATE_CONVERSATION,
  SUBMIT_COMPOSER_MESSAGE,
  SUBMIT_COMPOSER_LOCATION,
  SAVE_CONVERSATION_TITLE,
  MARK_MESSAGE_READ,
  CHANGE_COMPOSER_MESSAGE,
  ROUTER_DID_CHANGE,
  DELETE_CONVERSATION,
  TOGGLE_PRESENCE,
  clientReady,
  selectConversation,
  ownerSet,
} from '../actions/messenger';

const {
  STARTED,
  FINISHED
} = TypingIndicators;

function handleAction(layerClient, typingPublisher, state, action, next) {
  const { type, payload } = action;

  switch(type) {
    case CREATE_CONVERSATION: {
      const { participants } = state.participantState;
      const distinct = participants.length === 1;
      const conversation = layerClient.createConversation({
        distinct,
        participants
      });
      const originalId = conversation.id;
      next(selectConversation(originalId));

      // If its a Distinct Conversation, and a matching Conversation is found on the server,
      // then we may need to select a new ID.
      conversation.once('conversations:sent', () => {
        if (originalId !== conversation.id) {
          next(selectConversation(conversation.id));
        }
      });
      return;
    }
    case SUBMIT_COMPOSER_MESSAGE: {
      typingPublisher.setState(FINISHED);

      const conversation = layerClient
          .getConversation(`layer:///conversations/${state.router.params.conversationId}`, true);
      const text = state.activeConversation.composerMessage;
      let message;

      if (text.indexOf('> ') === 0) {
        message = conversation.createMessage({
          parts: [{
            mimeType: 'text/quote',
            body: text.substring(2)
          }]
        });
      } else {
        message = conversation.createMessage(text);
      }
      message.send();

      return;
    }
    case SUBMIT_COMPOSER_LOCATION: {
      typingPublisher.setState(FINISHED);

      const conversation = layerClient
          .getConversation(`layer:///conversations/${state.router.params.conversationId}`, true);
      const text = state.activeConversation.composerMessage;
      let message;
      message = conversation.createMessage({
        parts: [{
          mimeType: 'text/html',
          body: "<a href='yo'>text</a>"
        }]
      });
      message.send();

      return;
    }
    case SAVE_CONVERSATION_TITLE:
      layerClient
        .getConversation(`layer:///conversations/${state.router.params.conversationId}`, true)
        .setMetadataProperties({
          conversationName: state.activeConversation.title
        });
      return;
    case MARK_MESSAGE_READ:
      layerClient
        .getMessage(payload.messageId).isRead = true;
      return;
    case CHANGE_COMPOSER_MESSAGE:
      if (state.router.location.pathname !== '/new') {
        const conversationId = `layer:///conversations/${state.router.params.conversationId}`;
        const composerMessage = state.activeConversation.composerMessage;
        const typingState = composerMessage.length > 0 ? STARTED : FINISHED;

        if (!typingPublisher.conversation || typingPublisher.conversation.id !== conversationId) {
          typingPublisher.setConversation({ id: conversationId });
        }
        typingPublisher.setState(typingState);
      }
      return;
    case DELETE_CONVERSATION:
      const conversation = layerClient
        .getConversation(payload.conversationId);

      if (confirm('Are you sure you want to delete this conversation?')) {
        conversation.delete(layer.Constants.DELETION_MODE.ALL);
      }
      return;

    case TOGGLE_PRESENCE:
      if (layerClient.user.status === layer.Identity.STATUS.BUSY) {
        layerClient.user.setStatus(layer.Identity.STATUS.AVAILABLE);
      } else {
        layerClient.user.setStatus(layer.Identity.STATUS.BUSY);
      }
      return;
    default:
      return;
  }
}

const layerMiddleware = layerClient => store => {

  const typingPublisher = layerClient.createTypingPublisher();

  layerClient.on('ready', () => {
    store.dispatch(ownerSet(layerClient.user.toObject()));
    store.dispatch(clientReady());

    layerClient.user.on('identities:change', function(evt) {
      store.dispatch(ownerSet(layerClient.user.toObject()));
    });
  });

  return next => action => {
    const state = store.getState();

    handleAction(layerClient, typingPublisher, state, action, next);

    const nextState = next(action);

    return nextState;
  };
};

export default layerMiddleware;
