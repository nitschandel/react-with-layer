import React, { Component } from 'react';

export default class JSONMessagePart extends Component {

  isValidJSONString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }
  render() {
    let { messagePart } =this.props;
    if(this.isValidJSONString(messagePart.body)){
      messagePart = JSON.parse(messagePart.body);
    }
    return (
      <div className="chat-card">
        <div className="chat-form-header">
          <span className="fa fa-map-marker"></span>{' '}
          Mileage  
        </div>
        <div className="chat-form-content">
          <div className="chat-form-content-item">
            <div className="chat-form-content-item-title">
              Name
            </div>
            <div className="chat-form-content-item-subtitle">
              {messagePart.name}
            </div>
          </div>
          <div className="chat-form-content-item">
            <div className="chat-form-content-item-title">
              Start Location
            </div>
            <div className="chat-form-content-item-subtitle">
              {messagePart.startLocation}
            </div>
          </div>
          <div className="chat-form-content-item">
            <div className="chat-form-content-item-title">
              End Location
            </div>
            <div className="chat-form-content-item-subtitle">
              {messagePart.endLocation}
            </div>
          </div>
      
        </div>
        <div className="chat-form-footer">
          <div className="chat-form-footer-item-text">
            MILEAGE
          </div>
          <div className="chat-form-footer-item-subtext">
            {(messagePart.mileage ? 
            parseFloat(messagePart.mileage/1600).toFixed(2):0)+" miles"}
          </div>
        </div> 
      </div>
    );
  }
}
