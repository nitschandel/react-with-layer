import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
import { QueryBuilder } from 'layer-websdk';
import { connectQuery } from 'layer-react';
import * as MessengerActions from '../actions/messenger';
import ConversationHeader from '../components/ConversationHeader';
import MessageList from '../components/messages/MessageList';
import MessageComposer from '../components/MessageComposer';
import TypingIndicatorContainer from './TypingIndicatorContainer';

/**
 * Copy data from reducers into our properties
 */
function mapStateToProps({ activeConversation, router }) {
  return {
    ...activeConversation,
    activeConversationId: `layer:///conversations/${router.params.conversationId}`
  };
}

/**
 * Copy all actions into this.props.actions
 */
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(MessengerActions, dispatch) };
}

/**
 * Setup the Messages Queriy; will set the query results to be
 * this.props.messages.
 */
function getQueries({ activeConversationId, messagePagination }) {
  return {
    messages: QueryBuilder
      .messages()
      .forConversation(activeConversationId)
      .paginationWindow(messagePagination)
  };
}

@connectRedux(mapStateToProps, mapDispatchToProps)
@connectQuery({}, getQueries)
export default class ActiveConversation extends Component {

  render() {
    const {
      editingTitle,
      title,
      composerMessage,
      activeConversationId,
      conversations,
      messages,
      actions
    } = this.props;

    const activeConversation = conversations.find((conversation) => {
      return conversation.id === activeConversationId;
    });

    // Render the ConversationHeader, MessageList,
    // TypingIndicatorContainer and MessageComposer
    return (
      <div className='right-panel'>
        <ConversationHeader
          title={title}
          activeConversation={activeConversation}
          editingTitle={editingTitle}
          onEditConversationTitle={actions.editConversationTitle}
          onChangeConversationTitle={actions.changeConversationTitle}
          onSaveConversationTitle={actions.saveConversationTitle}
          onCancelEditConversationTitle={actions.cancelEditConversationTitle}/>

        <MessageList
          messages={messages}
          onMarkMessageRead={actions.markMessageRead}
          onLoadMoreMessages={actions.loadMoreMessages}/>

        <TypingIndicatorContainer
          conversationId={activeConversationId}/>

        <MessageComposer
          value={composerMessage}
          onChange={actions.changeComposerMessage}
          onSubmit={actions.submitComposerMessage}/>
      </div>
    );
  }
}
