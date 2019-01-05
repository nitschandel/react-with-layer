import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

export default class Avatar extends Component {

  static propTypes = {
    user: PropTypes.object,
    users: PropTypes.array
  }

  renderUserItem = (user) => {
    return user.avatarUrl ?  <span key={'avatar-' + user.id}><img src={user.avatarUrl} /></span> : <span key={'avatar-' + user.id} className='no-avatar'>{user.displayName.substring(0,2)}</span>;
  }

  render() {
    const { user, users } = this.props;
    let usersToRender = user ? [user] : users.slice(-2);
    let styles = cx({
      'avatar-image': true,
      cluster: usersToRender && usersToRender.length > 1
    });

    return <div className={styles}>
      {usersToRender.length === 1 ? <div className={'layer-presence layer-presence-' + usersToRender[0].status.toLowerCase() } /> : <div className='layer-presence-hidden' />}
      {usersToRender.filter(item => item.id).map(this.renderUserItem)}
    </div>;
  }
}
