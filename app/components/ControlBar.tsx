import React, { Component } from 'react';
import { CONTROL_BAR_HEIGHT } from './constants';

import Client from 'roku-client';

export default class ControlBar extends Component<any, any> {
  state = {
    loading: false,
    devices: [],
  };

  handleChange = (event: any) => {
    this.props.selectDevice(event.target.value);
  }
  searchDevices() {
    this.setState({ loading: true }, () => {
      Client.discoverAll().then(clients => {
        const devices = clients.map(c => {
          return c.ip
            .replace('http://', '')
            .replace('https://', '')
            .split(':')[0];
        });
        if (devices.length > 0) {
          this.props.selectDevice((devices[0]));
        }
        this.setState({ devices, loading: false });
      }).catch((err) => {
        console.warn(err);
        console.warn("Searching again")
        this.searchDevices();
      });
    });
  }
  componentDidMount() {
    this.searchDevices();
  }

  renderDeviceSelector() {
    if(this.state.loading) {
      return(
        <div>
          Searching for Roku devices...
        </div>
      )
    }
    return (
      <div>
        <label style={{ marginRight: 10 }} htmlFor="cars">
          Device:{' '}
        </label>
        <select onChange={this.handleChange} style={{ color: 'grey' }} id="cars">
          {this.state.devices.map(device => (
            <option key={device}  value={device}>
              {device}
            </option>
          ))}
        </select>
      </div>
    );
  }
  render() {
    return (
      <div
        style={{
          height: `${CONTROL_BAR_HEIGHT}px`,
          backgroundColor: '#333',
          borderBottom: '1px solid #111',
          alignItems: 'center',
          display: 'flex',
          paddingLeft: 15
        }}>
        <div>
          {this.renderDeviceSelector()}
        </div>
        <div
        onClick={this.props.clearMessages}
        style={{
          marginLeft: 15,
          cursor: "pointer",
          border: "3px #111 grey",
          borderRadius: 3,
          padding: 5,
        }}>
            CLEAR
        </div>
      </div>
    );
  }
}
