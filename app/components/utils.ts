import * as utils from "./utils";

enum MessageType {
  Warning = "w",
  Error = "e",
  Info = "i"
}

export function getMessageType(log: string): MessageType {
  if (!log) {
    return MessageType.Info;
  }
  if (log.includes("Warning") || log.includes("warning")) {
    return MessageType.Warning;
  }
  if (log.includes("Error") || log.includes("error") || log.includes(".err]") || log.includes("ERROR")) {
    return MessageType.Error;
  }
  return MessageType.Info;
}

export function getMessageTypeColor(type: MessageType): string {
  switch(type) {
    case MessageType.Warning:
      return "orange";
    case MessageType.Error:
      return "red";
    default:
      return "limegreen";
  }
}
/*
const filter = {
  remove: {
    contains: [
      'Sending {"event":"ping"} ',
      "Animation '",
      'persistentStore',
      'processCommand: ping',
      '*** Bandwidth report',
      'over TCP connection',
      'TCP CLIENT -',
      'processCommand: updateNodeProperties',
      'PersistentStoreCommand - updating local registry from server persistent store',
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
      '<vmap:VMAP version="1.0"',
      '<Tracking event',
      '<AdaptationSet',
      '<Impression'
    ],
    exact: [
      ' ',
      ''
    ]
  }
}*/

const emptyFilter = {
  name: "Empty",
  remove: {
    contains: [],
    exact: [],
  }
}

const separator = /\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z\]/g
export function parseMessageList(data: string, filter = emptyFilter): any {
  let logs = data.split(separator);
  
  const filteredLogs = logs.map((rawLog: string) => {
    const log = rawLog.split(/(^|[^\n])\n(?!\n)/g).filter((part) => {
      // Contains filter value
      for (const search of filter?.remove?.contains ?? []) {
        if (part?.includes(search)) {
          return false;
        }
      }
      // Exact match
      for (const search of filter?.remove?.exact ?? []) {
        if (part == search) {
          return false;
        }
      }
      return true;
    }).join("\n")
    if (!log || log.length === 0) {
      return null;
    }
    // Keep
    return log.replace(/(\r\n|\r|\n){2,}/g, '$1\n').trim();
  })
  const filteredLogsData = filteredLogs.filter((val) => {
    const isValid = val !== null
    && val.length > 0
    && !((
      val.charCodeAt(0) === 13 ||
      val.charCodeAt(0) === 10 ||
      val.charCodeAt(0) === 32
    ) && val.length < 4);
    return isValid
  });
  const logsWithMetadata = filteredLogsData.map((log: string) => {
    return {
      message: log,
      type: utils.getMessageType(log),
    }
  });
  return logsWithMetadata;
}