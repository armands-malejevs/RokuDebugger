import React, { Component } from 'react';
import { CONTROL_BAR_HEIGHT } from './constants';

import CircleLoader from "react-spinners/HashLoader";
import FeatherIcon from 'feather-icons-react';

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
          <CircleLoader
          size={30}
          color={"#663399"}
          loading={this.state.loading}
        />
        </div>
      )
    }
    return (
      <div>
        <label style={{ marginRight: 10 }} htmlFor="cars">
        </label>
        <select onChange={this.handleChange} style={{
            color: '#008ae6',
            fontWeight: 600,
            background: '#111',
            fontSize: 14,
            borderWidth: 0,
            textAlign: 'center',
            height: 40,
          }} id="cars">
          {this.state.devices.map(device => (
            <option style={{marginLeft: 10, marginRight: 10}} key={device}  value={device}>
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
          paddingLeft: 10
        }}>
        <div>
          {this.renderDeviceSelector()}
        </div>
        <div
        onClick={this.props.togglePause}
        className="controlButton"
        style={{
          marginLeft: 10,
          cursor: "pointer",
          border: "3px #111 grey",
          borderRadius: 3,
          color: '#008ae6',
          fontWeight: 600,
          paddingLeft: 10,
          fontSize: 30,
          paddingTop: 5,
          paddingBottom: 5,
          width: 35,
        }}>
            {this.props.paused ? <FeatherIcon icon="play" /> : <FeatherIcon icon="pause" />}
        </div>
        <div
        onClick={this.props.clearMessages}
        className="controlButton"
        style={{
          marginLeft: 10,
          cursor: "pointer",
          border: "3px #111 grey",
          borderRadius: 3,
          color: '#008ae6',
          fontWeight: 600,
          paddingLeft: 10,
          fontSize: 30,
          paddingTop: 5,
          paddingBottom: 5,
          width: 35,
        }}>
            <FeatherIcon icon="trash" />
        </div>
        <div
        onClick={this.props.importMessages}
        className="controlButton"
        style={{
          marginLeft: 10,
          cursor: "pointer",
          border: "3px #111 grey",
          borderRadius: 3,
          color: '#008ae6',
          fontWeight: 600,
          paddingLeft: 10,
          fontSize: 30,
          paddingTop: 5,
          paddingBottom: 5,
          width: 35,
        }}>
           <FeatherIcon icon="download" />
        </div>
        <div
        onClick={this.props.saveMessages}
        className="controlButton"
        style={{
          marginLeft: 10,
          cursor: "pointer",
          border: "3px #111 grey",
          borderRadius: 3,
          color: '#008ae6',
          fontWeight: 600,
          paddingLeft: 10,
          fontSize: 30,
          paddingTop: 5,
          paddingBottom: 5,
          width: 35,
        }}>
            <FeatherIcon icon="save" />
        </div>
        <div style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: 30,
        }}>
          <input
            placeholder="Search..."
            style={{
              width: 200,
              height: 30,
              backgroundColor: '#111',
              borderWidth: 0,
              borderRadius: 3,
              paddingLeft: 10,
              paddingRight: 10,
              color: 'white',
            }}
            onChange={this.props.onSearchChange} type="text" />
        </div>
      </div>
    );
  }
}
