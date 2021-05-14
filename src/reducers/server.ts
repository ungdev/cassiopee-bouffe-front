import { Action, ServerState } from '../types';

const initialState: ServerState = {
  socketConnected: false,
};

export const SET_SOCKET_CONNECTED = 'SET_SOCKET_CONNECTED';

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_SOCKET_CONNECTED:
      return {
        ...state,
        socketConnected: action.payload,
      };

    default:
      return state;
  }
};

export const setSocketConnected = (): Action => ({
  type: SET_SOCKET_CONNECTED,
  payload: true,
});

export const setSocketDisconnected = (): Action => ({
  type: SET_SOCKET_CONNECTED,
  payload: false,
});
