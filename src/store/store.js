import { createStore } from 'redux';
// import { restElement } from '@babel/types';
// import messages from '../translations';

const initialState = {
  // term: '',
  // city: '',
  // locales: {
  //   lang: 'ru',
  //   messages: messages.ru,
  // },
  // page: localStorage.getItem('page') || '/ru',

  authorized: false,
  name: '',
  offlineMessage: [],
  message: '',
  messages: [],
  wsState: null,
  // ws: null,
};

function appState(state = initialState, action) {
  switch (action.type) {
    case 'authorized':
      return { ...state, authorized: action.payload };
    case 'name':
      return { ...state, name: action.payload };
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
  // console.log('action', action);

  // return state;
}

const store = createStore(appState);

console.log('initialState', store.getState());

// store.subscribe(() => {
//   console.log('subscribe', store.getState());
// });

// store.dispatch({
//   type: 'authorized',
//   payload: true,
// });

export default store;
