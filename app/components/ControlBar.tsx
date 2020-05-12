import React, { Component } from 'react';
import { CONTROL_BAR_HEIGHT } from './constants';

export default class ControlBar extends Component<any,any> {
  render() {
    return(
      <div
        style={{
          height: `${CONTROL_BAR_HEIGHT}px`,
          backgroundColor: '#333',
          alignItems: "center",
          display: "flex",
          paddingLeft: 15,
        }}>
        <label style={{marginRight: 10}} htmlFor="cars">Device: </label>
        <select style={{color: 'grey'}} id="cars">
          <option value="volvo">Roku Streaming Stick+</option>
        </select>
      </div>
    )
  }
}