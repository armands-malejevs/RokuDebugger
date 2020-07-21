import React, { Component } from 'react';

import * as utils from './utils';
import { CONTROL_BAR_HEIGHT } from './constants';

import HyperModal from 'react-hyper-modal';

export default class MessageList extends Component<any, any> {
  state = {
    fullMessage: null,
    fullLogType: 'i'
  };
  renderMessage = (message: string) => {
    return message;
  };

  quickFilter = (logs: any[]) => {
    return logs.filter((itm: any) => {
      if (this.props.quickFilter.length === 0) {
        return true;
      }
      return itm.message.includes(this.props.quickFilter);
    });
  };

  handleExpandLog = (log: any) => () => {
    this.setState({
      fullMessage: log.message,
      fullLogType: log.type
    });
  };

  renderLog = (log: any, index: number) => {
    const logStyle = {
      padding: 10,
      backgroundColor: index % 2 === 1 ? '#333' : '#222',
      color: utils.getMessageTypeColor(log.type),
      fontSize: 14
    };
    const key = log + index;
    const isLongLog = log.message.length > 300;
    return (
      <div key={key} style={logStyle}>
        {isLongLog ? (
          <>
            {this.renderMessage(log.message.substring(0, 300))}{' '}
            <br />
            <br />
            <a style={{ color: '#999' }} onClick={this.handleExpandLog(log)}>
              (full message)
            </a>
            <br />
          </>
        ) : (
          this.renderMessage(log.message)
        )}
      </div>
    );
  };
  renderBottomDetectionElement = () => (
    <div style={{ marginTop: 15 }} ref={ref => this.props.onBottomRef(ref)} />
  );
  render() {
    const quickFilteredLogs = this.quickFilter(this.props.logs);
    return (
      <div ref={ref => this.props.onContainerRef(ref)} style={styles.container}>
        {quickFilteredLogs.map(this.renderLog)}
        {this.renderBottomDetectionElement()}
        <HyperModal
          classes={{ contentClassName: 'modal-content' }}
          renderCloseIcon={() => null}
          isOpen={!!this.state.fullMessage}
          requestClose={() => this.setState({ fullMessage: null })}
        >
          <div style={styles.fullMessageContainer}>
            {this.state.fullMessage}
          </div>
        </HyperModal>
      </div>
    );
  }
}

const styles = {
  container: {
    overflow: 'scroll',
    width: 'auto',
    height: `calc(100vh - ${CONTROL_BAR_HEIGHT}px)`
  },
  fullMessageContainer: {
    color: '#111',
    fontSize: 16,
    padding: 50
  }
};
