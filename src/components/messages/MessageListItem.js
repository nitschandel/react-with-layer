import React, { Component, PropTypes } from 'react';
import TextMessagePart from './TextMessagePart';
import QuoteMessagePart from './QuoteMessagePart';
import JSONMessagePart from './JSONMessagePart';
import Avatar from '../Avatar';

/**
 * This Component renders a single Message in a Message List
 * which includes Avatar, sender name, message body,
 * timestamp and status.
 */
export default class MessageListItem extends Component {
  /**
   * At this time we are marking any Message that has been
   * rendered as read.  A more advanced implementation
   * would test if was scrolled into view.
   */
  componentDidMount() {
    this.markMessageRead();
  }

  componentWillReceiveProps() {
    this.markMessageRead();
  }

  markMessageRead() {
    const { onMarkMessageRead, message } = this.props;
    if (message.isUnread) {
      onMarkMessageRead(message.id);
    }
  }

  getMessageStatus(message) {
    switch (message.readStatus) {
      case 'NONE':
        return 'unread';
      case 'SOME':
        return 'read by some';
      case 'ALL':
        return 'read';
    }
  }

  renderPart(messagePart) {
    switch(messagePart.mimeType) {
      case 'text/plain':
        return (
          <TextMessagePart
            key={messagePart.id}
            messagePart={messagePart}/>);
      case 'text/quote':
        return (
          <QuoteMessagePart
            key={messagePart.id}
            messagePart={messagePart}/>);
      case 'text/json':
            return (
              <JSONMessagePart
                key={messagePart.id}
                messagePart={messagePart}/>);
      default:
        return (<div key={messagePart.id} />);
    }
  }


  render() {
    const { message } = this.props;
    const user = message.sender;
    const messageStatus = this.getMessageStatus(message);
    console.log(message);

    return (
      <div className='message-item'>
        <Avatar user={user}/>
        <div className='main'>
          <span className='name'>{user.displayName}</span>

          <div className='message-parts'>
            {message.parts.map(messagePart => this.renderPart(messagePart))}
          </div>
        </div>
        <span className='timestamp'>
          {window.layerSample.dateFormat(message.sentAt)}
          <span className='message-status'>{messageStatus}</span>
        </span>
      </div>
    );
  }
}
