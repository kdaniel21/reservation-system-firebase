export interface UserMessage {
  topic: string,
  name: string,
  email: string,
  date: Date,
  solved: boolean,
  priority: boolean,
  message: string,
  id: string
}
