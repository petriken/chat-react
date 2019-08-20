/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../../components/Header/Header';
import Login from '../../components/Login/Login';
import Chat from '../../components/Chat/Chat';
import './MainPage.css';
import store from '../../store/store';

const URL = 'wss://wssproxy.herokuapp.com/';
let mouseDown = 0;

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.connection = this.connection.bind(this);
  }

  // showNotification() {
  //   console.log(1);

  //   Notification.requestPermission((result) => {
  //     console.log(2);

  //     if (result === 'granted') {
  //       console.log(3);
  //       navigator.serviceWorker.register('../../serviceWorker.js');

  //       navigator.serviceWorker.ready

  //         .then((registration) => {
  //           console.log(4);

  //           registration.showNotification('Vibration Sample', {
  //             body: 'Buzz! Buzz!',
  //             icon: '../images/touch/chrome-touch-icon-192x192.png',
  //             // vibrate: [200, 100, 200, 100, 200, 100, 200],
  //             tag: 'vibration-sample',
  //           });
  //         })
  //         .then((registration) => {
  //           registration.addEventListener('updatefound', () => {
  //             // If updatefound is fired, it means that there's
  //             // a new service worker being installed.
  //             const installingWorker = registration.installing;
  //             console.log(
  //               'A new service worker is being installed:',
  //               installingWorker,
  //             );
  //             // You can listen for changes to the installing service worker's
  //             // state via installingWorker.onstatechange
  //           });
  //         })
  //         .catch((error) => {
  //           console.log('Service worker registration failed:', error);
  //         });
  //     } else {
  //       console.log('Service workers are not supported.');
  //     }
  //   });
  // }

  notificationSend(message, ico, name) {
    if ('Notification' in window && document.visibilityState !== 'visible') {
      // this.showNotification();
      this.notification = new Notification(message, {
        body: name,
        icon: ico,
      });
      this.notification.onclick = (event) => {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        window.focus();
        this.notification.close();

        // window.open(this.props.currentUrl, '_blank');
        // this.notification.close();
      };

      setTimeout(() => {
        // this.showNotification();
        this.notification.close();
      }, 1500);
    }
  }

  notifyMe() {
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker
    //     .register('../../serviceWorker.js')
    //     .then((registration) => {
    //       registration.addEventListener('updatefound', () => {
    //         // If updatefound is fired, it means that there's
    //         // a new service worker being installed.
    //         const installingWorker = registration.installing;
    //         console.log(
    //           'A new service worker is being installed:',
    //           installingWorker,
    //         );
    //         // You can listen for changes to the installing service worker's
    //         // state via installingWorker.onstatechange
    //       });
    //     })
    //     .catch((error) => {
    //       console.log('Service worker registration failed:', error);
    //     });
    // } else {
    //   console.log('Service workers are not supported.');
    // }

    // navigator.serviceWorker.register('sw.js');
    // this.showNotification();

    // Проверка поддержки браузером уведомлений
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      // Проверка разрешения на отправку уведомлений
      // Если разрешено, то создаем уведомление

      this.notificationSend('notification permissions granted');
    } else if (Notification.permission !== 'denied') {
      // В противном случае, запрашиваем разрешение
      Notification.requestPermission((permission) => {
        // Если пользователь разрешил, то создаем уведомление
        if (permission === 'granted') {
          this.notificationSend('notification permissions have been granted');
        }
      });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    if (localStorage.getItem('state')) {
      store.dispatch({
        type: 'authorized',
        payload: JSON.parse(localStorage.getItem('state')).authorized,
      });
      store.dispatch({
        type: 'name',
        payload: JSON.parse(localStorage.getItem('state')).name,
      });
      store.dispatch({
        type: 'currentUrl',
        payload: document.location.href,
      });
    }
  }

  sendMessage() {
    if (this.props.offlineMessage) {
      this.props.offlineMessage.forEach((item) => {
        this.ws.send(JSON.stringify(item));
      });
      store.dispatch({
        type: 'clearOfflineMessage',
        payload: [],
      });
    }
  }

  connection() {
    // ServiceWorkerGlobalScope.onnotificationclick = this.showNotification();
    this.notifyMe();
    this.ws = new ReconnectingWebSocket(URL);

    this.ws.onopen = () => {
      console.log('____________connected: ', new Date());
      store.dispatch({
        type: 'wsState',
        payload: this.ws.readyState,
      });
      this.notificationSend(
        'connection open',
        'https://www.mgtow.com/wp-content/uploads/ultimatemember/32309/profile_photo-256.png?1558599200',
      );

      this.sendMessage();
    };

    this.ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      this.addMessage(message);
      const messageWrapper = document.querySelectorAll('.message-wrapper');
      const lastMsg = messageWrapper[messageWrapper.length - 1];

      if (!mouseDown && lastMsg) {
        lastMsg.scrollIntoView({ behavior: 'smooth' });
      }
    };

    this.ws.onclose = () => {
      console.log('_____________disconnected: ', new Date());
      store.dispatch({
        type: 'wsState',
        payload: this.ws.readyState,
      });
      this.notificationSend(
        'connection closed',
        'https://cdn.clipart.email/d73437276d4eb5903c0491b2d16fa0ce_red-x-icon-clip-art-at-clkercom-vector-clip-art-online-royalty-_231-297.png',
      );
    };

    this.ws.onerror = (error) => {
      window.console.log('Ошибка', error);
    };
  }

  componentDidMount() {
    window.addEventListener('mousedown', () => {
      mouseDown += 1;
      store.dispatch({
        type: 'mouseDown',
        payload: mouseDown,
      });
    });
    window.addEventListener('mouseup', () => {
      mouseDown -= 1;
    });
    window.addEventListener('online', () => {
      this.sendMessage();
    });
    setTimeout(() => {
      if (this.props.authorized === true) {
        this.connection();
      }
    }, 0);
  }

  addMessage(mes) {
    if (mes.length > 1) {
      this.notificationSend(
        `You have ${mes.length} new messages`,
        'https://miro.medium.com/max/256/1*gGh9I9ju9w4lXhmWoG2fXA.png',
      );
    }
    mes
      .slice(0, 199)
      .reverse()
      .forEach((item) => {
        if (this.props.messages.findIndex((elem) => elem.id === item.id) === -1) {
          const newItem = item;
          if (mes.length === 1) {
            this.notificationSend(
              item.from,
              'https://miro.medium.com/max/256/1*gGh9I9ju9w4lXhmWoG2fXA.png',
              item.message,
            );
          }
          store.dispatch({
            type: 'messages',
            payload: newItem,
          });
        }
      });
  }

  submitMessage = (messageString) => {
    let message;
    if (messageString) {
      if (this.props.wsState === 1 && window.navigator.onLine) {
        message = { from: this.props.name, message: messageString };
        this.ws.send(JSON.stringify(message));
      } else if (this.props.wsState !== 1 || !window.navigator.onLine) {
        message = {
          from: this.props.name,
          message: `offline-msg: ${messageString}`,
        };
        store.dispatch({
          type: 'offlineMessage',
          payload: message,
        });
      }
    }
  };

  handleClick() {
    store.dispatch({
      type: 'name',
      payload: '',
    });
    store.dispatch({
      type: 'authorized',
      payload: false,
    });
    const tempObj = {
      name: '',
      authorized: false,
    };
    localStorage.setItem('state', JSON.stringify(tempObj));
    this.ws.close();
  }

  render() {
    return (
      <div className="wrapper">
        {this.props.authorized ? <Header onClick={this.handleClick} /> : null}
        <div className="main-wrapper">
          {this.props.authorized ? (
            <Chat submitMessage={this.submitMessage} />
          ) : (
            <Login onConnection={this.connection} />
          )
          }
        </div>
      </div>
    );
  }
}

MainPage.propTypes = {
  authorized: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  offlineMessage: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
  wsState: PropTypes.number,
  message: PropTypes.string.isRequired,
  currentUrl: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  authorized: state.authorized,
  name: state.name,
  offlineMessage: state.offlineMessage,
  messages: state.messages,
  wsState: state.wsState,
  message: state.message,
  currentUrl: state.currentUrl,
});

export default connect(mapStateToProps)(MainPage);
