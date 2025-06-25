import 'ai';

declare module 'ai' {
  interface Attachment {
    id: string;
    type: 'file' | 'image';
  }
  interface Message {
    id: string;
  }
}
