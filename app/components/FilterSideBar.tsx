import React, { Component } from 'react';

interface FilterItem {
  name: string;
  value: string;
  id: string;
}

const NEW_FILTER = 'NEW_FILTER';

export default class ControlBar extends Component<any, any> {
  state = {
    filters: []
  };

  handleSlectFilter = (filter: FilterItem, index: number) => {
    this.props.selectFilter(filter, index);
  };

  handleSelectCreate = () => {
    this.props.onNewFilter();
  };

  renderItem = (filter: FilterItem, index: number | null, onSelect: any) => {
    return (
      <div
        key={index ?? 'all-messages'}
        onDoubleClick={() => this.props.editFilter(filter, index)}
        style={{
          ...styles.filterItem,
          background:
            this.props.selectedIndex === index ? '#222' : 'transparent',
          color: filter?.id === NEW_FILTER ? '#008ae6' : '#EEE',
          textAlign: filter?.id === NEW_FILTER ? 'center' : 'left'
        }}
        onClick={() => onSelect(filter, index)}
      >
        {filter?.name ?? '(unnamed)'}
      </div>
    );
  };

  renderAllMessagesItem = () =>
    this.renderItem(
      {
        name: 'All Messages',
        value: '',
        id: 'all-messages'
      },
      null,
      this.handleSlectFilter
    );

  renderNewFilterButton = () =>
    this.renderItem(
      {
        name: 'New Filter',
        value: '',
        id: NEW_FILTER
      },
      -1,
      this.handleSelectCreate
    );

  render() {
    return (
      <div style={styles.container}>
        {this.renderAllMessagesItem()}
        {this.props.filters.map((filter: any, index: number) =>
          this.renderItem(filter, index, this.handleSlectFilter)
        )}
        {this.renderNewFilterButton()}
      </div>
    );
  }
}

const styles = {
  container: {
    width: 'calc(100%)',
    height: 'calc(100% - 60px)',
    backgroundColor: '#333'
  },
  filterItem: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    cursor: 'pointer'
  }
};
