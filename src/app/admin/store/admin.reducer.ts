import * as AdminActions from './admin.actions';
import { UserMessage } from '../admin-dashboard/admin-contact/message.model';

const initialState = {
  viewedMessage: null,
};

export interface State {
  viewedMessage: UserMessage;
}

export function adminReducer(
  state = initialState,
  action: AdminActions.AdminActions
) {
  switch (action.type) {
    case AdminActions.START_VIEW_MESSAGE:
      return {
        ...state,
        viewedMessage: { ...action.payload },
      };
    case AdminActions.STOP_VIEW_MESSAGE:
      return {
        ...state,
        viewedMessage: null,
      };
  }
}
