import React, { Component } from 'react';

export default class HtmlMessagePart extends Component {
  render() {
    return (
        <div className='bubble text'>
            <div dangerouslySetInnerHTML={{ __html: this.props.messagePart.body }} />
        </div>
    );
  }
}
