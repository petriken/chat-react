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
import * as serviceWorker from '../../serviceWorker';

const URL = 'wss://wssproxy.herokuapp.com/';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.connection = this.connection.bind(this);
  }

  checkConnection() {
    const disconnectMessage = document.getElementById('chat__wrapper_loading');
    if (disconnectMessage) {
      if (this.props.wsState !== 1 || !window.navigator.onLine) {
        disconnectMessage.classList.remove('chat__wrapper_loading-connect');
        disconnectMessage.classList.add('chat__wrapper_loading-disconnect');
        disconnectMessage.scrollIntoView({ behavior: 'smooth' });
      } else if (this.props.wsState === 1 && window.navigator.onLine) {
        disconnectMessage.classList.add('chat__wrapper_loading-connect');
        disconnectMessage.classList.remove('chat__wrapper_loading-disconnect');
      }
    }
  }

  notificationSend(message, ico, name) {
    // Проверка поддержки браузером уведомлений
    if ('Notification' in window && document.visibilityState !== 'visible') {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        Notification.requestPermission((result) => {
          if (result === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
              // eslint-disable-next-line no-param-reassign
              registration.showNotification(message, {
                body: name,
                icon: ico,
                tag: 'sample',
              });
              // eslint-disable-next-line no-restricted-globals
              self.addEventListener('notificationclick', (event) => {
                console.log('On notification click: ', event.notification.tag);
                event.notification.close();
              });
            }).catch((err) => console.log(err));
          }
        });
      } else {
        this.notification = new Notification(message, {
          body: name,
          icon: ico,
        });
        this.notification.onclick = (event) => {
          event.preventDefault(); // prevent the browser from focusing the Notification's tab
          window.focus();
          this.notification.close();
        };
        setTimeout(() => {
          this.notification.close();
        }, 1500);
      }
    }
  }

  notifyMe() {
    serviceWorker.register();

    // Проверка поддержки браузером уведомлений
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      // Проверка разрешения на отправку уведомлений
      // Если разрешено, то создаем уведомление

      // this.notificationSend('notification permissions granted');
    } else if (Notification.permission !== 'denied') {
      // В противном случае, запрашиваем разрешение
      Notification.requestPermission((permission) => {
        // Если пользователь разрешил, то создаем уведомление
        if (permission === 'granted') {
          navigator.serviceWorker.ready.then((registration) => {
          // eslint-disable-next-line no-param-reassign
            registration.showNotification('notification permissions have been granted');
          }).catch((err) => console.log(err));
        }
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
    this.ws = new ReconnectingWebSocket(URL);

    this.ws.onopen = () => {
      console.log('____________connected: ', new Date(), this.ws.readyState);
      store.dispatch({
        type: 'wsState',
        payload: this.ws.readyState,
      });
      this.notificationSend(
        'connection open',
        'https://www.mgtow.com/wp-content/uploads/ultimatemember/32309/profile_photo-256.png?1558599200',
      );
      this.checkConnection();
      this.sendMessage();
    };

    this.ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      this.addMessage(message);
      const messageWrapper = document.querySelectorAll('.message-wrapper');
      const lastMsg = messageWrapper[messageWrapper.length - 1];
      const disconnectMessage = document.getElementById('chat__wrapper_loading');

      if (!this.props.mouseDown && !this.props.touchstart && (lastMsg || disconnectMessage)) {
        lastMsg.scrollIntoView({ behavior: 'smooth' });
      }
    };

    this.ws.onclose = () => {
      console.log('_____________disconnected: ', new Date(), this.ws.readyState);
      store.dispatch({
        type: 'wsState',
        payload: this.ws.readyState,
      });
      this.notificationSend(
        'connection closed',
        'https://cdn.clipart.email/d73437276d4eb5903c0491b2d16fa0ce_red-x-icon-clip-art-at-clkercom-vector-clip-art-online-royalty-_231-297.png',
      );
      this.checkConnection();
    };

    this.ws.onerror = (error) => {
      window.console.log('Ошибка', error.message ? error.message : error);
    };
  }

  calcVH() {
    const vH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (document.getElementById('wrapper')) { document.getElementById('wrapper').setAttribute('style', `height:${vH}px;`); }
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

  componentDidMount() {
    let { mouseDown, touchstart } = this.props;
    this.notifyMe();

    this.calcVH();

    window.addEventListener('resize', this.calcVH, true);

    window.addEventListener('mousedown', () => {
      mouseDown += 1;
      store.dispatch({
        type: 'mouseDown',
        payload: mouseDown,
      });
    });

    window.addEventListener('touchstart', () => {
      touchstart += 1;
      store.dispatch({
        type: 'touchstart',
        payload: touchstart,
      });
    });

    window.addEventListener('mouseup', () => {
      mouseDown -= 1;
      store.dispatch({
        type: 'mouseDown',
        payload: mouseDown,
      });
    });

    window.addEventListener('touchend', () => {
      touchstart -= 1;
      store.dispatch({
        type: 'touchstart',
        payload: touchstart,
      });
    });

    window.addEventListener('offline', () => {
      this.checkConnection();
    });

    window.addEventListener('online', () => {
      this.sendMessage();
      this.connection();
    });

    setTimeout(() => {
      if (this.props.authorized === true) {
        this.connection();
      }
    }, 0);
  }

  componentDidUpdate() {
    this.calcVH();
    this.checkConnection();
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
          console.log('messages');
        }
      });
  }

  addRestMessage(mes) {
    mes
      .slice(200)
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
          console.log('messages2');
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
      <div className="wrapper" id="wrapper" style={{ width: '500px' }} >
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
  mouseDown: PropTypes.number.isRequired,
  touchstart: PropTypes.number.isRequired,
};
const mapStateToProps = (state) => ({
  authorized: state.authorized,
  name: state.name,
  offlineMessage: state.offlineMessage,
  messages: state.messages,
  wsState: state.wsState,
  message: state.message,
  currentUrl: state.currentUrl,
  mouseDown: state.mouseDown,
  touchstart: state.touchstart,
});

export default connect(mapStateToProps)(MainPage);
