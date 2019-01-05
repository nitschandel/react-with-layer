import React, { Component, PropTypes } from 'react';
import UserListItem from './UserListItem';

/**
 * This Component renders a list of users,
 * currently provided by UserListItems which
 * allow the UI to provide a New Conversation panel.
 */
export default class UserList extends Component {
  /**
   * Render a UserListItem for this user
   */
  renderUserItem = (user) => {
    const {
      selectedUsers,
      onUserSelected,
      onUserUnselected
    } = this.props;
    const selected = Boolean(selectedUsers.filter(selectedUser => selectedUser.id === user.id).length);

    return (
      <UserListItem
        key={user.id}
        user={user}
        selected={selected}
        onUserSelected={onUserSelected}
        onUserUnselected={onUserUnselected}/>
    );
  }

  /**
   * Render the User List Dialog
   */
  render() {
    return (
      <div className="participant-list-container dialog-container">
        <div className="panel-header">
          <span className="title">Select Participants</span>
        </div>
        <div className="participant-list">
          {this.props.users.map(this.renderUserItem)}
        </div>
        <div className="button-panel">
          <button onClick={this.props.onSave} className="button-ok">OK</button>
        </div>
      </div>
    );
  }
}
