import * as utils from "./utils";

enum MessageType {
  Warning = "w",
  Error = "e",
  Info = "i"
}

export function getMessageType(log: string): MessageType {
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
      /*
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
      */
    ],
    exact: [
      ' ',
      ''
    ]
  }
}

const separator = /\[[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z\]/;
export function parseMessageList(data: string): any {
  let logs = data.split(separator);
  const filteredLogs = logs.filter((log: string) => {
    // Contaisn filter value
    for (const search of filter.remove.contains) {
      if (log.includes(search)) {
        return false;
      }
    }
    // Exact match
    for (const search of filter.remove.exact) {
      if (log == search) {
        return false;
      }
    }
    if (log.length === 0) {
      return false;
    }
    // Keep
    return true;
  })
  const logsWithMetadata = filteredLogs.map((log: string) => {
    return {
      message: log,
      type: utils.getMessageType(log),
    }
  });
  return logsWithMetadata;
}