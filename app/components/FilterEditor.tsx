import React, { Component } from 'react';
import AceEditor from 'react-ace';

import { remote } from 'electron';

import * as storageUtils from "./storageUtils";

import 'brace/mode/json';
import 'brace/theme/monokai';

export default class MessageList extends Component<any, any> {
  filterValue: string;
  constructor(props: any) {
    super(props);
    this.filterValue = props.editingIndex === null ? `{
      "name": "Custom Filter",
      "remove": {
        "contains": [],
        "exact": []
      }
    }` : JSON.stringify(storageUtils.getFilters()[props.editingIndex], null, 1);
  }
  
  handleCancel = () => {
    const options = {
      type: 'warning',
      title: 'Changes not saved!',
      message: 'Do you really want to cancel?',
      detail: 'All changes will be lost!',
      buttons: ['Yes', 'No']
    };
    const result = remote.dialog.showMessageBoxSync(options);
    if (result === 0) {
      this.props.onHideEditor(true);
    }
  };

  handleDelete = () => {
    const options = {
      type: 'warning',
      message: 'Are you sure you want to delete this filter?',
      detail: 'All changes will be lost!',
      buttons: ['Yes', 'No']
    };
    const result = remote.dialog.showMessageBoxSync(options);
    if (result === 0) {
      storageUtils.removeFilter(this.props.editingIndex);
      this.props.onHideEditor();
    }
  }

  handleSave = () => {
    try {
      JSON.parse(this.filterValue);
    } catch(err) {
      console.log(err);
      const options = {
        type: 'error',
        title: 'Error!',
        message: `This not a valid JSON!`,
        detail: err.toString(),
        buttons: ['OK']
      };
      remote.dialog.showMessageBoxSync(options);
      return;
    }

    if (this.props.editingIndex !== null) {
      // We're editing an existing filter
      console.warn(this.filterValue);
      storageUtils.updateFilter(this.filterValue, this.props.editingIndex);
    } else {
      // This is a new filter
      storageUtils.saveNewFilter(this.filterValue);
    }
    this.props.onHideEditor();
  }

  handleChange = (value: string) => {
    this.filterValue = value;
  }
  render() {
    const buttonWrapperStyle = {
      height: 60,
      display: 'flex',
      justifyContent: 'flex-end',
      alignSelf: 'center',
    };
    const buttonStyle = {
      height: 30,
      fontSize: 18,
      fontWeight: 500,
      marginTop: 10,
      marginRight: 10,
      padding: 10,
      paddingTop: 0,
      paddingBottom: 0,
      background: '#008ae6',
      color: 'white',
      border: 0,
      cursor: 'pointer'
    };
    return (
      <div style={{ height: '100%' }}>
        <AceEditor
          mode="json"
          theme="monokai"
          onChange={this.handleChange}
          name="UNIQUE_ID_OF_DIV"
          fontSize={14}
          className="filter-editor"
          width="100%"
          value={this.filterValue}
          editorProps={{ $blockScrolling: true }}
        />
        <div style={{
          display: "flex",
          flexDirection: "row",
        }}>
          <div style={{flex: 1, marginLeft: 5}}>
            {this.props.editingIndex !== null && <button onClick={this.handleDelete} style={{ ...buttonStyle, background: 'tomato' }}>Delete</button>}
          </div>
          <div style={buttonWrapperStyle}>
            <button
              onClick={this.handleCancel}
              style={{ ...buttonStyle, background: '#555' }}
            >
              Cancel
            </button>
            <button onClick={this.handleSave} style={buttonStyle}>Save</button>
          </div>
        </div>
      </div>
    );
  }
}
