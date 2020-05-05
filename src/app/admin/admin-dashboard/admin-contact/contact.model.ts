export interface ContactMetaData {
  topic: string;
  name: string;
  email: string;
  date: Date;
  closed: boolean;
  priority: boolean;
  messages: ContactMessage[];
  id: string;
  createdBy: string;
}

export interface ContactMessage {
  date: Date;
  message: string;
  sentBy: SentBy;
}

export interface SentBy {
  name: string;
  admin: boolean;
  email: string;
}
