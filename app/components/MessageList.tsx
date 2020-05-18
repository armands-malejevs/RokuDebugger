import React, { Component } from 'react';

import * as utils from "./utils";
import { CONTROL_BAR_HEIGHT } from './constants';
import ReactJson from 'react-json-view'

import HyperModal from 'react-hyper-modal';

const { BrowserWindow } = require('electron')

function IsJsonString(str: string) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

export default class MessageList extends Component<any,any> {
  state = {
    fullMessage: null,
    fullLogType: "i"
  }
  renderMessage = (message: string) => {
   return message;
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
            {log.message.length > 300 ? 
            <div>
              {this.renderMessage(log.message.substring(0, 300), log+index)}
              {" "}<a onClick={() => {
                this.setState({fullMessage: log.message, fullLogType: log.type})
              }}>
                (full message)
              </a>
            </div> : 
            this.renderMessage(log.message, log+index)}
            </div>
          ))}
        <div style={{marginTop: 15}} ref={(ref) => this.props.onBottomRef(ref)} />
        <HyperModal
          classes={{
            contentClassName: 'modal-content',
          }}
          renderCloseIcon={() => null}
          isOpen={!!this.state.fullMessage}
          requestClose={() => this.setState({fullMessage: null})}
        >
          <div style={{
            color: "#111",
            fontSize: 16,
            whiteSpace: "pre-wrap",
            overflowWrap: 'break-word',
            padding: 50,
          }}>
            {this.state.fullMessage}
          </div>
        </HyperModal>
      </div>
    )
  }
}