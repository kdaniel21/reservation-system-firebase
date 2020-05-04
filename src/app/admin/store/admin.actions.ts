import { Action } from '@ngrx/store';
import { UserMessage } from '../admin-dashboard/admin-contact/message.model';

export const START_VIEW_MESSAGE = '[Admin] Start View Message';
export const STOP_VIEW_MESSAGE = '[Admin] Stop View Message';

export class StartViewMessage implements Action {
  readonly type = START_VIEW_MESSAGE;
  constructor(public payload: UserMessage) {}
}

export class StopViewMessage implements Action {
  readonly type = STOP_VIEW_MESSAGE;
}

export type AdminActions = StartViewMessage | StopViewMessage;
