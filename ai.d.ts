import 'ai';

declare module 'ai' {
  interface Attachment {
    id: string;
    type: 'file' | 'image';
  }
  interface Message {
    // we assume that this is always defined as we use it thay,
    // either way this can lead to problems if the id of the messages
    // is not automcatically set.
    id: string;
  }
}
