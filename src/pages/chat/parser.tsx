interface partText {
  text: string;
}
export interface messageInterface {
  role: string;
  parts: partText[];
}

export interface messageListInterface {
  chatIndex: number;
  chat: messageInterface[];
}
