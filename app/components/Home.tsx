import React from 'react';
import { Stream } from "stream";
import SplitPane from "react-split-pane";

import * as utils from "./utils";
import * as storageUtils from "./storageUtils";
import MessageList from './MessageList';
import ControlBar from './ControlBar';
import FilterSideBar from './FilterSideBar';
import FilterEditor from './FilterEditor';

const Telnet = require('telnet-client')

export default class Home extends React.Component {
  state = {
    logs: [],
    creatingFilter: false,
    filters: storageUtils.getFilters(),
    selectedFilterIndex: null,
    editingIndex: null,
  }
  public connection: any;
  public logEndRef: any;
  public scrollView: any;
  public unprocessedData: string = "";
  public rawLog: string = "";
  public uiRenderingInterval: any;
  componentDidMount() {
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
      const filter = this.state.selectedFilterIndex !== null ? this.state.filters[this.state.selectedFilterIndex] : undefined;
      const newLogs = this.state.logs.concat(utils.parseMessageList(this.unprocessedData, filter));
      this.unprocessedData = "";
      this.setState({ logs: newLogs }, () =>{
        shouldScrollToBottom && this.logEndRef?.scrollIntoView(false,{ behavior: "smooth" });
      }); 
    }, 100);
  }
  connectToDevice = async (ip: string) => {
    this.connection = new Telnet()
    // these parameters are just examples and most probably won't work for your use-case.
    let params = {
      host: ip, //'192.168.2.251',
      port: 8085,
      negotiationMandatory: false,
      timeout: 120,
      maxBufferLength: 10000000,
    }
    try {
      await this.connection.connect(params)
    } catch (error) {
      // handle the throw (timeout)
      console.error("ERROR", error);
    }
    let shell = await this.connection.shell();
    shell.on('data', this.handleDataStream);
    shell.on('timeout', () => {
      console.log("Connection timed out, reconnecting.")
      this.connectToDevice(ip);
    });
  }
  handleDataStream = (data: Stream) => {
    this.startRenderingInterval();
    this.unprocessedData += data.toString();
    this.rawLog += data.toString();
  }
  handleNewFilterOpen = () => {
    this.setState({
      creatingFilter: true,
    })
  }
  handleHideEditor = (shouldResetSelection = false) => {
    this.setState({
      creatingFilter: false,
      filters: storageUtils.getFilters(),
      editingIndex: null,
      selectedFilterIndex: shouldResetSelection ? null : this.state.selectedFilterIndex,
    })
  }
  clearMessages = () => {
    this.rawLog = "";
    this.unprocessedData = "";
    this.setState({logs: []});
  }
  handleSelectFilter = (f: any, i: number) => {
    this.setState({logs: [], selectedFilterIndex: i}, () => {
      this.unprocessedData = this.rawLog;
    });
  }
  render() {
    return (
      <div data-tid="container">
        <ControlBar
          clearMessages={this.clearMessages}
          selectDevice={this.handleSelectDevice} />
        <SplitPane split="vertical" minSize={200} defaultSize={200}>
          <FilterSideBar
            editFilter={(f: any, i: number) => this.setState({
              editingIndex: i,
              creatingFilter: true,
            })}
            selectedIndex={this.state.selectedFilterIndex}
            filters={this.state.filters ?? []}
            selectFilter={this.handleSelectFilter}
            onNewFilter={this.handleNewFilterOpen} />
          {this.state.creatingFilter ?
            <FilterEditor editingIndex={this.state.editingIndex} onHideEditor={this.handleHideEditor} />
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
