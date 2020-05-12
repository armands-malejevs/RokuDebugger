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
            <div key={log+index} style={{
              padding:10,
              borderBottomWidth: 1,
              borderBottomStyle: 'solid',
              borderBottomColor: "#666",
              color: utils.getMessageTypeColor(log.type)
            }}>
              {log.message}
            </div>
          ))}
        <div style={{marginTop: 15}} ref={(ref) => this.props.onBottomRef(ref)} />
      </div>
    )
  }
}