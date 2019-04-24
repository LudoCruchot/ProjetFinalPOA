import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
// import ReactAccelerometer from 'react-accelerometer';
import axios from 'axios';

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
})

const DEFAULT_STATE = {
  x: 0,
  y: 0,
  z: 0,
  isHidden: true,
  name: 'device',
}

const apiURL = 'http://35.180.234.29/'

var handleInterval = null;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ...DEFAULT_STATE
    }
    this.getData = this.getData.bind(this);
    // this.toggleHidden = this.toggleHidden.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.connect = this.connect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  handleSubmit = (event) => {
    console.log(event);
  }

  connect = () => {

  }

  // toggleHidden = () => {
  //   this.setState({
  //     isHidden: !this.state.isHidden
  //   })

  //   this.getData();
  // }

  start = () => {
    this.setState({
      isHidden: false
    })

    handleInterval = setInterval(this.getData, 1000);
  }

  stop = () => {
    this.setState({
      isHidden: true
    })

    clearInterval(handleInterval);
  }

  getData = () => {
    window.addEventListener('devicemotion', (event) => {

      if (event.accelerationIncludingGravity.x != null)
        this.setState({
          x: event.accelerationIncludingGravity.x.toFixed(3),
          y: event.accelerationIncludingGravity.y.toFixed(3),
          z: event.accelerationIncludingGravity.z.toFixed(3)
        })
    })

    const json = {
      "name": this.state.name,
      "timestamp": Date.now(),
      "value": {
        "x": this.state.x,
        "y": this.state.y,
        "z": this.state.z
      }
    }

    this.sendData(json);
    console.log('json sent', json)
  }

  sendData = (json) => {
    const options = {
      method: "POST",
      url: apiURL + 'data',
      data: json
    }

    axios.request(options)
      .then(response => {
        console.log("utils response ", response.data);
      })
      .catch(error => {
        if (error.response) {
          console.log("error : ", error.response.data);
          console.log("error standard message : ", error.response.statusText);
          console.log("error code : ", error.response.status);
        }
      })
  }

  render() {

    return (
      <div className="App">

        <form>
          <label>
            <input type="text" placeholder="Device name" onChange={this.handleChange} />
          </label>
        </form>

        <div className="poaButton">
          <button onClick={this.connect}>Connect</button>
        </div>
        {/* {
          this.state.isHidden &&
          <div className="poaButton">
            <button onClick={this.toggleHidden}>Start</button>
          </div>
        }
        {
          !this.state.isHidden &&
          <div className="poaButton">
            <button onClick={this.toggleHidden}>Stop</button>
          </div>
        } */}
        <div className="poaButton">
          <button onClick={this.start}>Start</button>
        </div>
        <div className="poaButton">
          <button onClick={this.stop}>Stop</button>
        </div>
        {
          !this.state.isHidden &&
          <div>
            <h2>Device {this.state.name}</h2>
            <h2>X {this.state.x}</h2>
            <h2>Y {this.state.y}</h2>
            <h2>Z {this.state.z}</h2>
          </div>
        }
        {/* </header> */}
      </div >
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
