import React, { Component } from 'react';

import * as utils from "./utils";
import { CONTROL_BAR_HEIGHT } from './constants';

export default class MessageList extends Component<any,any> {
  render() {
    return(
      <div
        ref={(ref) => this.props.onContainerRef(ref)}
        style={{overflow: "overlay", height: `calc(100vh - ${CONTROL_BAR_HEIGHT}px)`}}>
          {this.props.logs.map((log: any, index: number) => (
            <p key={log+index} style={{
              padding:10,
              backgroundColor: index % 2 === 1 ? "#333" : "#222",
              color: utils.getMessageTypeColor(log.type),
              fontSize: 14,
            }}>
              {log.message}
            </p>
          ))}
        <div style={{marginTop: 15}} ref={(ref) => this.props.onBottomRef(ref)} />
      </div>
    )
  }
}