import React from 'react';
import { Stream } from "stream";
import SplitPane from "react-split-pane";

import * as utils from "./utils";
import MessageList from './MessageList';
import ControlBar from './ControlBar';
import FilterSideBar from './FilterSideBar';
import FilterEditor from './FilterEditor';

const Telnet = require('telnet-client')

export default class Home extends React.Component {
  state = {
    logs: [],
    creatingFilter: false,
  }
  public connection: any;
  public logEndRef: any;
  public scrollView: any;
  public unprocessedData: string = "";
  public uiRenderingInterval: any;
  componentDidMount() {
    //this.connectToDevice("192.168.2.251");
    this.startRenderingInterval();
  }
  handleSelectDevice = (device: string) => {
    this.connectToDevice(device);
  }
  startRenderingInterval = () => {
    if(this.uiRenderingInterval) {
      clearInterval(this.uiRenderingInterval);
    }
    this.uiRenderingInterval = setInterval(() => {
      if (this.state.creatingFilter) { return; }
      const shouldScrollToBottom = ((this.scrollView.scrollHeight - this.scrollView.clientHeight) - this.scrollView.scrollTop < 100)
      const newLogs = this.state.logs.concat(utils.parseMessageList(this.unprocessedData));
      this.unprocessedData = "";
      this.setState({ logs: newLogs }, () =>{
        shouldScrollToBottom && this.logEndRef?.scrollIntoView(false,{ behavior: "smooth" });
      }); 
    }, 200);
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
  handleNewFilterOpen = () => {
    this.setState({
      creatingFilter: true,
    })
  }
  render() {
    return (
      <div data-tid="container">
        <ControlBar
          clearMessages={() => {
            this.setState({logs: []})
          }}
          selectDevice={this.handleSelectDevice} />
        <SplitPane split="vertical" minSize={200} defaultSize={200}>
          <FilterSideBar
            onNewFilter={this.handleNewFilterOpen} />
          {this.state.creatingFilter ?
            <FilterEditor />
            :
            <MessageList
              logs={this.state.logs}
              onBottomRef={(ref: any) => (this.logEndRef = ref)}
              onContainerRef={(ref: any) => (this.scrollView = ref)} />}
        </SplitPane>
      </div>
    );
  }
}
