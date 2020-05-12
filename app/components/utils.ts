enum MessageType {
  Warning = "w",
  Error = "e",
  Info = "i"
}

export function getMessageType(log: string): MessageType {
  if (log.includes("Warning") || log.includes("warning")) {
    return MessageType.Warning;
  }
  if (log.includes("Error") || log.includes("error") || log.includes(".err]")) {
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