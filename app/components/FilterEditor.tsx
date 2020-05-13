import React, { Component } from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/monokai';

export default class MessageList extends Component<any, any> {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <AceEditor
          mode="json"
          theme="monokai"
          onChange={() => {}}
          name="UNIQUE_ID_OF_DIV"
          fontSize={14}
          className="filter-editor"
          width="100%"
          value={`{
  "remove": {
    "contains": [],
    "exact": []
  }
}`}
          editorProps={{ $blockScrolling: true }}
        />
        <div style={{
          height: 60,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignSelf: "center" }}>
          <button style={{
            height: 30,
            fontSize: 18,
            fontWeight: 500,
            marginTop: 10,
            marginRight: 10,
            padding: 10,
            paddingTop: 0,
            paddingBottom: 0,
            background: "#008ae6",
            color: "white",
            border: 0,
            cursor: "pointer",
          }}>Save</button>
        </div>
      </div>
    );
  }
}
