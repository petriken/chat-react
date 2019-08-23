import { createStore } from 'redux';

const initialState = {
  authorized: false,
  name: '',
  currentUrl: '',
  offlineMessage: [],
  mouseDown: 0,
  touchstart: 0,
  message: '',
  messages: [],
  wsState: null,
};

function appState(state = initialState, action) {
  switch (action.type) {
    case 'authorized':
      return { ...state, authorized: action.payload };
    case 'name':
      return { ...state, name: action.payload };
    case 'currentUrl':
      return { ...state, currentUrl: action.payload };
    case 'offlineMessage':
      return {
        ...state,
        offlineMessage: [...state.offlineMessage, action.payload],
      };
    case 'clearOfflineMessage':
      return {
        ...state,
        offlineMessage: action.payload,
      };
    case 'wsState':
      return { ...state, wsState: action.payload };
    case 'mouseDown':
      return { ...state, mouseDown: action.payload };
    case 'touchstart':
      return { ...state, touchstart: action.payload };
    case 'message':
      return { ...state, message: action.payload };
    case 'messages':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
}

const store = createStore(appState);

export default store;
