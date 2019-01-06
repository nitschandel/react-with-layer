import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { QueryBuilder } from 'layer-websdk';
import { connectQuery } from 'layer-react';
import * as MessengerActions from '../actions/messenger';
import ConversationList from '../components/ConversationList';
import ConversationListHeader from '../components/ConversationListHeader';
import UserListDialog from '../components/UserListDialog';

/**
 * Copy data from reducers into our properties
 */
function mapStateToProps({ app, announcementState, participantState, router }) {
  return {
    owner: app.owner,
    ready: app.ready,
    showAnnouncements: announcementState.showAnnouncements,
    participantState,
    activeConversationId: `layer:///conversations/${router.params.conversationId}`,
  };
}

/**
 * Copy all actions into this.props.actions
 */
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(MessengerActions, dispatch) };
}

/**
 * Setup all of the Queries; will set the query results to be
 * this.props.conversations, this.props.announcements, this.props.users.
 * Message query is setup elsewhere.
 */
function getQueries() {
  return {
    conversations: QueryBuilder.conversations(),
    announcements: QueryBuilder.announcements(),
    users: QueryBuilder.identities(),
  };
}


@connect(mapStateToProps, mapDispatchToProps)
@connectQuery({}, getQueries)
export default class Messenger extends Component {

  /**
   * Hide the Participants Dialog
   */
  hideParticipants = (event) => {
    const { actions } = this.props;
    const { hideParticipants } = actions;
    if (event.target.parentNode.classList.contains('participants-dialog')) {
      hideParticipants();
    }
  }

  /**
   * Render the left panel with the Conversation List and List Header
   */
  renderLeftPanel() {
    const {
      owner,
      conversations,
      announcements,
      activeConversationId,
      actions
    } = this.props;

    return (
      <div className='left-panel'>
        <ConversationListHeader
          owner={owner}
          unreadAnnouncements={Boolean(announcements.filter(item => item.isUnread).length)}
          onShowAnnouncements={actions.showAnnouncements}
          onShowParticipants={actions.showParticipants}
          onTogglePresence={actions.togglePresence}/>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onDeleteConversation={actions.deleteConversation}/>
      </div>
    );
  }

  /**
   * Render the Participants dialog.
   */
  renderParticipantDialog() {
    const { owner, users, participantState, actions } = this.props;
    const selectedParticipants = participantState.participants;

    return (
      <div
        onClick={this.hideParticipants}
        className="participants-dialog dialog">
        <div>
          <UserListDialog
            users={users.filter(user => user.id !== owner.id)}
            selectedUsers={selectedParticipants}
            onUserSelected={actions.addParticipant}
            onUserUnselected={actions.removeParticipant}
            onSave={actions.createConversation}/>
        </div>
      </div>
    );
  }

  /**
   * Render the Main UI
   */
  renderMessenger() {
    const {
      participantState,
      users,
      conversations
    } = this.props;
    const { showParticipants } = participantState;

    // Render the left-panel which contains the Conversation List
    // and the right-panel which consists of the child components
    // (currently IndexRoute and Route with ActiveConversation)
    return (
      <div className='messenger'>
        {this.renderLeftPanel()}
        {this.props.children && React.cloneElement(this.props.children, {
          conversations,
          users
        })}
        {showParticipants ? this.renderParticipantDialog() : <span />}
      </div>
    );
  }

  /**
   * Render every users favorite screen
   */
  renderEmptyScreen() {
    return (
      <div className='messenger'></div>
    );
  }

  /**
   * If we are ready, render the Messenger, else render a blank screen
   */
  render() {
    if (this.props.ready) {
      return this.renderMessenger();
    } else {
      return this.renderEmptyScreen();
    }
  }
}
