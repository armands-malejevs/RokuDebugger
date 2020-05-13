import React, { Component } from 'react';

interface FilterItem {
  name: string;
  value: string;
  id: string;
}

const NEW_FILTER = "NEW_FILTER"

export default class ControlBar extends Component<any, any> {

  state = {
    filters: []
  }

  renderItem = (filter: FilterItem, onSelect: any) => {
    return (
      <div
        style={{
          padding: 15,
          cursor: "pointer",
          color: filter.id === NEW_FILTER ? "#008ae6" : "grey",
          textAlign: filter.id === NEW_FILTER ? "center" : "left",
        }}
        onClick={() => onSelect(filter)}>
        {filter.name}
      </div>
    )
  }

  handleSlectFilter = (filter: FilterItem) => {
    this.props.selectFilter(filter);
  }

  handleSelectCreate = () => {
    this.props.onNewFilter();
  }

  render() {
    return (
      <div
        style={{
          width: "calc(100%)",
          height: "100%",
          backgroundColor: '#333',
        }}>
          {this.state.filters.map((filter) => this.renderItem(filter, this.handleSlectFilter))}
          {this.renderItem({
            name: "New Filter",
            value: "",
            id: NEW_FILTER
          }, this.handleSelectCreate)}
      </div>
    );
  }
}
