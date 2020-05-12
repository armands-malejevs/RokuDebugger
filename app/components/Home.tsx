import React from 'react';
import { Stream } from "stream";

import * as utils from "./utils";
import MessageList from './MessageList';
import ControlBar from './ControlBar';

const Telnet = require('telnet-client')

export default class Home extends React.Component {
  state = {
    logs: [],
  }
  public connection: any;
  public logEndRef: any;
  public scrollView: any;
  public unprocessedData: string = "";
  componentDidMount() {
    //this.connectToDevice("192.168.2.251");
    setInterval(() => {
      const shouldScrollToBottom = ((this.scrollView.scrollHeight - this.scrollView.clientHeight) - this.scrollView.scrollTop < 100)
      const newLogs = this.state.logs.concat(utils.parseMessageList(this.unprocessedData));
      this.unprocessedData = "";
      this.setState({ logs: newLogs }, () =>{
        shouldScrollToBottom && this.logEndRef?.scrollIntoView(false,{ behavior: "smooth" });
      }); 
    }, 200);
  }
  handleSelectDevice = (device: string) => {
    this.connectToDevice(device);
  }
  connectToDevice = async (ip: string) => {
    this.connection = new Telnet()
    // these parameters are just examples and most probably won't work for your use-case.
    let params = {
      host: ip, //'192.168.2.251',
      port: 8085,
      negotiationMandatory: false,
      timeout: 3000,
    }
    try {
      await this.connection.connect(params)
    } catch (error) {
      // handle the throw (timeout)
      console.error("ERROR", error);
    }
    let shell = await this.connection.shell();
    shell.on('data', this.handleDataStream);
  }
  handleDataStream = (data: Stream) => {
    this.unprocessedData += data.toString();
  }
  render() {
    return (
      <div data-tid="container">
        <ControlBar
          selectDevice={this.handleSelectDevice} />
        <MessageList
          logs={this.state.logs}
          onBottomRef={(ref: any) => (this.logEndRef = ref)}
          onContainerRef={(ref: any) => (this.scrollView = ref)} />
      </div>
    );
  }
}
