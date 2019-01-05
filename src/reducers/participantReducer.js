import {
  CREATE_CONVERSATION,
  SHOW_PARTICIPANTS,
  HIDE_PARTICIPANTS,
  ADD_PARTICIPANT,
  REMOVE_PARTICIPANT,
} from '../actions/messenger';

const initialState = {
  participants: [],
  showParticipants: false,
};

export default function participantReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case CREATE_CONVERSATION:
    case HIDE_PARTICIPANTS:
      return {
        ...initialState,
        showParticipants: false
      };
    case SHOW_PARTICIPANTS:
      return {
        ...initialState,
        showParticipants: true
      };
    case ADD_PARTICIPANT:
      return {
        ...state,
        participants: [
          ...state.participants,
          payload.user
        ]
      };
    case REMOVE_PARTICIPANT:
      return {
        ...state,
        participants: state.participants.filter((participant) => {
          return participant.id !== payload.user.id;
        })
      };

    default:
      return state;
  }
}
