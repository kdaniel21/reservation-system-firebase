import { Action } from '@ngrx/store';
import { ContactMetaData } from '../admin-dashboard/admin-contact/contact.model';

export const START_VIEW_MESSAGE = '[Admin] Start View Message';
export const STOP_VIEW_MESSAGE = '[Admin] Stop View Message';

export class StartViewMessage implements Action {
  readonly type = START_VIEW_MESSAGE;
  constructor(public payload: ContactMetaData) {}
}

export class StopViewMessage implements Action {
  readonly type = STOP_VIEW_MESSAGE;
}

export type AdminActions = StartViewMessage | StopViewMessage;
