import React, {Component} from 'react';
import Modal from 'react-modal';
import {ModalHeader,  ModalBody, Button, 
  FormGroup, Label, Input} from 'reactstrap';

import MapModal from './MapModal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '30%',
    transform: 'translate(-50%, -50%)',
    padding: '5px 10px 10px'
  }
};

class ChatFormModal extends Component {
  constructor() {
    super();
    this.state = {
      name: undefined,
      startLocation : {
        address: undefined,
        lat: 0.0,
        lng: 0.0
      },
      endLocation : {
        address: undefined,
        lat: 0.0,
        lng: 0.0
      },
      mileage: undefined,
      showMapModal: false,
      locationType: undefined,
      mapModalHeading: undefined
    }
    this.toggle = this.toggle.bind(this);
    this.changeName = this.changeName.bind(this);
    this.showMapModal = this.showMapModal.bind(this);
    this.closeMapModal = this.closeMapModal.bind(this);
    this.onMapModalSubmit = this.onMapModalSubmit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  changeName(name){
    this.setState({
      name
    });
  }

  toggle() {
    this.props.onCancel();
  }

  showMapModal = (locationType) => {
    let mapModalHeading;
    if(locationType === "endLocation"){
      mapModalHeading = "End Location"
    }else {
      mapModalHeading = "Start Location"
    }
    this.setState({
      showMapModal: true,
      locationType,
      mapModalHeading
    });
  }

  onMapModalSubmit(locationType, position){
    this.setState({
      showMapModal: false,
      mapModalHeading: undefined,
      locationType: undefined
    });
    if(locationType === "endLocation"){
      this.setState({
        endLocation: position
      });
    }else {
      this.setState({
        startLocation: position
      });
    }
  }

  closeMapModal(){
    this.setState({
      showMapModal: false,
      mapModalHeading: undefined,
      locationType: undefined
    });
  }

  onSubmit(){
    let self = this;
    let { startLocation, endLocation } = this.state;
    if(!startLocation.lat || !startLocation.lng || !startLocation.address){
        alert('Please select a proper Start Location');
        return;
    } else if(!endLocation.lat || !endLocation.lng || !endLocation.address){
        alert('Please select a proper End Location');
        return;
    }
    let origins = [startLocation.lat+','+startLocation.lng];
    let destinations = [endLocation.lat+','+endLocation.lng];
    let service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins,
      destinations,
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    }, function(response, status) {
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        let data = {
          name: self.state.name,
          startLocation: self.state.startLocation.address,
          endLocation: self.state.endLocation.address,
          mileage: response.rows[0].elements[0].distance.value
        }
        self.props.onSubmit(data);
      }
    });
    
  }

  render() {
    return (
      <Modal
        isOpen={this.props.showChatFormModal}
        style={customStyles}
        ariaHideApp={false}
      >
      <ModalHeader>
          <span className="fa fa-map-marker"></span>{' '}
          Mileage
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="padding">
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" placeholder="Enter Your Name"
                    value={this.state.name}
                    onChange={(e) => {
                      this.changeName(e.target.value);
                    }}/>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="startLocation">Start Location</Label>
              <Input type="text" id="startLocation" placeholder="Select Start Location"
                    value={this.state.startLocation.address}
                    onClick={() => this.showMapModal("startLocation")}/>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="endLocation">End Location</Label>
              <Input type="text" id="endLocation" placeholder="Select Start Location"
                    value={this.state.endLocation.address}
                    onClick={() => this.showMapModal("endLocation")}/>
            </FormGroup>
          </div>
          <div className="chat-form-footer-button">
            <Button 
              className="btn btn-danger chat-form-button"
              onClick={this.toggle}>
                Close
            </Button>
            {' '}
            <Button 
              className="btn btn-primary chat-form-button"
              onClick={this.onSubmit}>
                Send
            </Button>
          </div>
        </ModalBody>
        {
          this.state.showMapModal ? 
          <MapModal 
            onCancel={this.closeMapModal}
            onSubmit = {this.onMapModalSubmit}
            {...this.state}
          />: undefined
        }
      </Modal>
    );
  }
}


export default ChatFormModal;