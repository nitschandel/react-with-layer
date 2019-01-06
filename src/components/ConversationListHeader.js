import React, { Component } from 'react';

/**
 * This Component provides a title over the conversation list
 * and a button for creating a new Conversation.
 */
export default class ConversationListHeader extends Component {
  /**
   * Show the Participants Dialog
   */
  handleShowParticipants = (event) => {
    event.preventDefault();
    this.props.onShowParticipants();
  }
  /**
   * Toggle presence between BUSY and AVAILABLE
   */
  togglePresence = (event) => {
    event.preventDefault();
    this.props.onTogglePresence();
  }


  render() {
    const { unreadAnnouncements, owner } = this.props;
    const announcementClasses = ['announcements-button'];
    if (unreadAnnouncements) announcementClasses.push('unread-announcements');
    return (
      <div className='panel-header conversations-header'>
        <div className={'layer-presence layer-presence-' + owner.status.toLowerCase()} onClick={this.togglePresence}></div>
        <div className='title'>{owner.displayName}'s Conversations</div>
        <a href='#' onClick={this.handleShowParticipants}>
          <i className="icon fa fa-pencil-square-o"></i>
        </a>
      </div>
    );
  }
}
