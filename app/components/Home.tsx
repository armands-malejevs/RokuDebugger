import React from 'react';
import styles from './Home.css';

import * as utils from "./utils";
import MessageList from './MessageList';
import ControlBar from './ControlBar';

const Telnet = require('telnet-client')
const filter = {
  remove: {
    contains: [
      /*
      'Sending {"event":"ping"} ',
      "Animation '",
      'persistentStore',
      'processCommand: ping',
      '*** Bandwidth report',
      'over TCP connection',
      'processCommand: updateNodeProperties',
      'updateNodePropertiesCommand',
      'processCommand: focusMap',
      'Replacing child of:',
      'setFocusMap',
      'Sending {"event":"listFocus",',
      'sceneInterface::setFocus: {"direction"',
      'DownloadedSegment - Info:',
      'Segment Type',
      'StreamingSegment - Info:',
      'Sending {"data":{"1',
      'Sending {"data":{"2":',
      'Sending {"data":{"segBitrateBps":',
      'Start Time: ',
      'Time to write:',
      'reportPosition',
      '"event":"bookmark"',
      */
    ],
    exact: [
      ' ',
    ]
  }
}
export default class Home extends React.Component {
  state = {
    logs: [],
  }
  public connection: any;
  public logEndRef: any;
  public scrollView: any;
  public latestLogs: any;
  public lastEvent: string = "";
  async componentDidMount() {
    this.connection = new Telnet()
    // these parameters are just examples and most probably won't work for your use-case.
    let params = {
      host: '192.168.2.251',
      port: 8085,
      negotiationMandatory: false,
      // shellPrompt: '/ # ', // or negotiationMandatory: false
      timeout: 1500
    }
   
    try {
      await this.connection.connect(params)
    } catch (error) {
      // handle the throw (timeout)
      console.error("ERROR", error);
    }
    let shell = await this.connection.shell();
    shell.on('data', (data) => {
      let logs = data.toString().split(/\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z\]/);
      const filteredLogs = logs.filter((log) => {
        // Contaisn filter value
        for (const search of filter.remove.contains) {
          if (log.includes(search)) {
            return false;
          }
        }
        // Exact match
        for (const search of filter.remove.exact) {
          if (log == search) {
            return false;
          }
        }
        if (log.length === 0) {
          return false;
        }
        // Keep
        return true;
      })
      const logsWithMetadata = filteredLogs.map((log: string) => {
        return {
          message: log,
          type: utils.getMessageType(log),
        }
      });
      console.warn(logsWithMetadata)
      let newLogs = this.state.logs.concat(logsWithMetadata);
      const shouldScrollToBottom = ((this.scrollView.scrollHeight - this.scrollView.clientHeight) - this.scrollView.scrollTop < 100)
      this.setState({ logs: newLogs }, () =>{
        shouldScrollToBottom && this.logEndRef?.scrollIntoView(false,{ behavior: "smooth" });
      });
      
    });
  }
  render() {
    return (
      <div data-tid="container">
        <ControlBar />
        <MessageList
          logs={this.state.logs}
          onBottomRef={(ref: any) => (this.logEndRef = ref)}
          onContainerRef={(ref: any) => (this.scrollView = ref)} />
      </div>
    );
  }
}
