import React, { Component } from 'react';

import ChatFormModal from './modals/ChatFormModal'

const ENTER = 13;

export default class MessageComposer extends Component {

  constructor(props){
    super(props);
    this.state = {
      addButtonClass : "plus",
      showChatFormModal: false
    };
    this.changeToPlusSign = this.changeToPlusSign.bind(this);
    this.showChatFormModal = this.showChatFormModal.bind(this);
    this.closeChatFormModal = this.closeChatFormModal.bind(this);
  }

  changeToPlusSign(event){
    if(event.target.attributes[3].value === "true"){
      this.setState({
        addButtonClass: "cross"
      });
    }else{
      this.setState({
        addButtonClass: "plus"
      });
    }
  }

  showChatFormModal(){
    this.setState({
      showChatFormModal: true
    });
  }

  closeChatFormModal(){
    console.log("here");
    this.setState({
      showChatFormModal: false
    });
  }

  /**
   * Any time the input changes, we'll want to send a typing indicator
   * to other participants; this.props.onChange handles that.
   */
  handleChange = (event) => {
    this.props.onChange(event.target.value);
  }

  /**
   * onEnter, send the message using this.props.onSubmit()
   */
  handleKeyDown = (event) => {
    if (event.keyCode === ENTER && !event.shiftKey) {
      event.preventDefault();
      if (this.props.value.length) {
        this.props.onSubmit();
      }
    }
  }

  render() {
    return (
      <div className='message-composer'>
        <div className="dropup">
          <button className={"circle dropdown-toggle "+this.state.addButtonClass}
          data-toggle="dropdown"
          onClick={(e) => this.changeToPlusSign(e)}
          ></button>
          <ul className="dropdown-menu">
            <li onClick={this.showChatFormModal}>
              Mileage
            </li>
          </ul>
        </div>
        <textarea
          className='message-textarea'
          placeholder='Type message'
          rows='1'
          value={this.props.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}/>
        {this.state.showChatFormModal?
        <ChatFormModal 
          onCancel={() =>this.closeChatFormModal}
          {...this.state}
        />
        :undefined}
      </div>
    );
  }
}
