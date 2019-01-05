import React, {Component} from 'react';
import Modal from 'react-modal';

import Styles from './constant';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '5px 10px 10px'
  }
};

class ChatFormModal extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    console.log('hey');
    this.props.onCancel();
  }

  render() {
    console.log(this.props.onCancel);
    return (
      <Modal
        isOpen={this.props.showChatFormModal}
        style={customStyles}
        ariaHideApp={false}
      >
      <button 
                type="button"
                className="btn btn--danger"
                onClick={this.props.onCancel}>Close</button>
      </Modal>
    );
  }
}


export default ChatFormModal;