import React, {Component} from 'react';
import Modal from 'react-modal';
import {ModalHeader,  ModalBody, ModalFooter} from 'reactstrap';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';

Geocode.setApiKey("AIzaSyAY2379Gqq5-zZPfNakTymQu5iNHroUYRc");

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '50%',
    minHeight: '500px',
    transform: 'translate(-50%, -50%)',
    padding: '5px 10px 10px'
  }
};

const mapStyles = {
    width: '95%',
    height: '350px'
};

const bodyStyle = {
    height: '400px'
}

const footerStyle = {
    height: '50px'
}

class MapModal extends Component {
  constructor() {
    super();
    this.state = {
        position: {
            lat: undefined,
            lng: undefined,
            address: undefined
        }
    }
    this.toggle = this.toggle.bind(this);
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.onPlaceSelected = this.onPlaceSelected.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.changeAutoComplete = this.changeAutoComplete.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onMarkerDragEnd(t, map,coord){
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.setState({
        position: {
            lat, lng
        }
    })
    Geocode.fromLatLng(lat, lng).then(
        response => {
          const address = response.results[0].formatted_address;
          this.setState({
            position: {
                lat, lng, address
            }
        })
        },
        error => {
          console.error(error);
        }
    );
  }

  onPlaceSelected(place){
      this.setState({
        position:{
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address
        }
      });
  }

  onSubmit(){
      let { position } = this.state;
      if(!position.lat || !position.lng || !position.address){
          alert('Please select a proper address');
          return;
      }
      this.props.onSubmit(this.props.locationType, position);
  }

  changeAutoComplete(e){
      let position = Object.assign({},this.state.position);
      position.address = e.target.value;
      this.setState({
          position
      });
  }


  toggle() {
    this.props.onCancel();
  }

  render() {
    const { position } = this.state;
    return (
      <Modal
        isOpen={this.props.showMapModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <ModalHeader>
          {this.props.mapModalHeading}
        </ModalHeader>
        <ModalBody style={bodyStyle}>
            <div>
                <Autocomplete
                    className="form-control"
                    style={{width: '90%', borderWidth: '1px'}}
                    value={this.state.position.address}
                    onPlaceSelected={this.onPlaceSelected}
                    types={['(regions)']}
                    onChange={this.changeAutoComplete}
                />
            </div>
            <br/>

            <div>
                <Map
                    {...this.props}
                    center={position}
                    centerAroundCurrentLocation={false}
                    containerStyle={{
                    height: '300px',
                    position: 'relative',
                    width: '100%'
                    }}>
                    <Marker position={position} 
                        draggable={true}
                        onDragend={(t, map, coord) => this.onMarkerDragEnd(t, map,coord)}
                    />
                </Map>
            </div>
      </ModalBody>
        <ModalFooter style={footerStyle}>
            <button 
                type="button"
                className="btn btn-danger chat-form-button"
                onClick={this.toggle}>Close</button>
                {' '}
            <button 
                type="button"
                className="btn btn-primary chat-form-button"
                onClick={this.onSubmit}>Submit</button>
        </ModalFooter>
      </Modal>
    );
  }
}


export default GoogleApiWrapper({
    apiKey: 'AIzaSyAY2379Gqq5-zZPfNakTymQu5iNHroUYRc'
  })(MapModal);