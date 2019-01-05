import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import appReducer from './appReducer';
import activeConversationReducer from './activeConversationReducer';
import participantReducer from './participantReducer';
import announcementReducer from './announcementReducer';

const rootReducer = combineReducers({
  app: appReducer,
  router: routerStateReducer,
  activeConversation: activeConversationReducer,
  participantState: participantReducer,
  announcementState: announcementReducer,
});

export default rootReducer;
