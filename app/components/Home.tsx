import React from 'react';
import { Stream } from 'stream';
import SplitPane from 'react-split-pane';
import fs from 'fs';

import * as utils from './utils';
import * as storageUtils from './storageUtils';
import MessageList from './MessageList';
import ControlBar from './ControlBar';
import FilterSideBar from './FilterSideBar';
import FilterEditor from './FilterEditor';

const Telnet = require('telnet-client');

export default class Home extends React.Component {
  state = {
    logs: [],
    creatingFilter: false,
    filters: storageUtils.getFilters(),
    selectedFilterIndex: null,
    editingIndex: null,
    paused: false,
    quickFilter: ''
  };

  public connectionIp?: string;
  public connection: any;
  public logEndRef: any;
  public scrollView: any;
  public unprocessedData: string = '';
  public rawLog: string = '';
  public uiRenderingInterval: any;

  componentDidMount() {
    this.startRenderingInterval();
  }
  handleSelectDevice = (device: string) => {
    this.connectToDevice(device);
  };
  startRenderingInterval = () => {
    if (this.uiRenderingInterval) {
      clearInterval(this.uiRenderingInterval);
    }
    this.uiRenderingInterval = setInterval(() => {
      if (this.state.creatingFilter) {
        return;
      }
      const shouldScrollToBottom =
        this.scrollView.scrollHeight -
          this.scrollView.clientHeight -
          this.scrollView.scrollTop <
        100;
      const filter =
        this.state.selectedFilterIndex !== null
          ? this.state.filters[this.state.selectedFilterIndex ?? 0]
          : undefined;
      const newLogs = this.state.logs.concat(
        utils.parseMessageList(this.unprocessedData, filter)
      );
      this.unprocessedData = '';
      this.setState({ logs: newLogs }, () => {
        shouldScrollToBottom &&
          this.logEndRef?.scrollIntoView(false, { behavior: 'smooth' });
      });
    }, 100);
  };
  connectToDevice = async (ip: string) => {
    this.connectionIp = ip;
    this.connection = new Telnet();
    let params = {
      host: ip,
      port: 8085,
      negotiationMandatory: false,
      timeout: 120,
      maxBufferLength: 10000000
    };
    try {
      await this.connection.connect(params);
    } catch (error) {
      // handle the throw (timeout)
      console.error('ERROR', error);
      if (this.connectionIp === ip) {
        // User has not initiated a new connection so we can continue attempting to connect
        this.connectToDevice(ip);
      }
    }
    let shell = await this.connection.shell();
    shell.on('data', this.handleDataStream);
    shell.on('timeout', () => {
      console.log('Connection timed out, reconnecting.');
      if (this.connectionIp === ip) {
        // Lost connection - reconnect
        this.connectToDevice(ip);
      }
    });
  };
  handleDataStream = (data: Stream) => {
    if (this.state.paused) {
      return;
    }
    this.startRenderingInterval();
    this.unprocessedData += data.toString();
    this.rawLog += data.toString();
  };
  handleNewFilterOpen = () => {
    this.setState({
      creatingFilter: true
    });
  };
  handleHideEditor = (shouldResetSelection = false) => {
    this.setState({
      creatingFilter: false,
      filters: storageUtils.getFilters(),
      editingIndex: null,
      selectedFilterIndex: shouldResetSelection
        ? null
        : this.state.selectedFilterIndex
    });
  };
  clearMessages = () => {
    this.rawLog = '';
    this.unprocessedData = '';
    this.setState({ logs: [] });
  };
  handleSelectFilter = (f: any, i: number) => {
    this.setState({ logs: [], selectedFilterIndex: i }, () => {
      this.unprocessedData = this.rawLog;
    });
  };
  importMessages = async () => {
    const dialog = require('electron').remote.dialog;
    try {
      const result = await dialog.showOpenDialog({ properties: ['openFile'] });
      // fileNames is an array that contains all the selected
      if (result?.filePaths === undefined || result.filePaths.length < 1) {
        console.log('No file selected');
        return;
      }
      fs.readFile(result.filePaths[0], 'utf-8', (err: any, data: any) => {
        if (err) {
          alert('An error ocurred reading the file :' + err.message);
          return;
        }
        this.clearMessages();
        this.setState({ paused: true });
        this.unprocessedData += data;
        this.rawLog += data;
      });
    } catch (err) {
      alert('An error ocurred reading the file :' + err.message);
    }
  };
  togglePause = () => {
    this.setState({ paused: !this.state.paused });
  };

  onSearchChange = (evt: any) => {
    this.setState({ quickFilter: evt.target.value });
  };

  handleSaveMessages = async () => {
    const { remote } = require('electron'),
    dialog = remote.dialog,
    WIN = remote.getCurrentWindow();
    let options = {
      title: 'Roku Telnet Logs',
      buttonLabel: 'Save'
    };
    let result = await dialog.showSaveDialog(WIN, options);
    if (result.filePath) {
      fs.writeFile(result.filePath, this.rawLog, function(err) {
        if (err) return console.log(err);
      });
    }
  };

  handleEditFilter = (_filter: any, i: number) =>
    this.setState({
      editingIndex: i,
      creatingFilter: true
    });
  render() {
    return (
      <div data-tid="container">
        <ControlBar
          clearMessages={this.clearMessages}
          togglePause={this.togglePause}
          paused={this.state.paused}
          importMessages={this.importMessages}
          selectDevice={this.handleSelectDevice}
          onSearchChange={this.onSearchChange}
          saveMessages={this.handleSaveMessages}
        />
        <SplitPane
          split="vertical"
          minSize={200}
          defaultSize={200}
          pane2Style={{ overflow: 'scroll' }}
        >
          <FilterSideBar
            editFilter={this.handleEditFilter}
            selectedIndex={this.state.selectedFilterIndex}
            filters={this.state.filters ?? []}
            selectFilter={this.handleSelectFilter}
            onNewFilter={this.handleNewFilterOpen}
          />
          {this.state.creatingFilter ? (
            <FilterEditor
              editingIndex={this.state.editingIndex}
              onHideEditor={this.handleHideEditor}
            />
          ) : (
            <MessageList
              logs={this.state.logs}
              quickFilter={this.state.quickFilter}
              onBottomRef={(ref: any) => (this.logEndRef = ref)}
              onContainerRef={(ref: any) => (this.scrollView = ref)}
            />
          )}
        </SplitPane>
      </div>
    );
  }
}
