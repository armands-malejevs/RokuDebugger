import React, { Component } from 'react';

import * as utils from "./utils";
import { CONTROL_BAR_HEIGHT } from './constants';
import ReactJson from 'react-json-view'

function IsJsonString(str: string) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

export default class MessageList extends Component<any,any> {
  renderMessage = (message: string, key: string) => {
   return message;

   return message.split("\n").map((part, index) => {
    if(IsJsonString(part)) {
      console.warn(JSON.parse(part));
      return <ReactJson key={key+index} theme="monokai" src={JSON.parse(part)} />
    }
    return <div style={{
      fontSize: 14,
      whiteSpace: "pre-wrap"
    }} key={key+index}>{part}</div>
   })
   
  }
  render() {
    return(
      <div
        ref={(ref) => this.props.onContainerRef(ref)}
        style={{overflow: "scroll", height: `calc(100vh - ${CONTROL_BAR_HEIGHT}px)`}}>
          {this.props.logs.map((log: any, index: number) => (
            <div key={log+index} style={{
              padding:10,
              backgroundColor: index % 2 === 1 ? "#333" : "#222",
              color: utils.getMessageTypeColor(log.type),
              fontSize: 14,
              whiteSpace: "pre-wrap"
            }}>
              {this.renderMessage(log.message, log+index)}
            </div>
          ))}
        <div style={{marginTop: 15}} ref={(ref) => this.props.onBottomRef(ref)} />
      </div>
    )
  }
}