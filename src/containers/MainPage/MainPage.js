import React, { Component } from 'react';
import {
  Button, Col, Input, Form,
} from 'reactstrap';
import ReconnectingWebSocket from 'reconnecting-websocket';

// import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import Message from '../../components/Message/Message';
import './MainPage.css';
// import Chat from '../../components/Chat/Chat';

const URL = 'wss://wssproxy.herokuapp.com/';

export default class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authorized: false,
      name: '',
      message: '',
      messages: [],
      offlineMessage: [],
    };
    this.authorize = this.authorize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.connect = this.connect.bind(this);
  }

  notificationSend(message, ico, name) {
    if ('Notification' in window && document.visibilityState !== 'visible') {
      this.notification = new Notification(message, {
        body: name,
        icon: ico,
      });

      setTimeout(() => {
        this.notification.close();
      }, 1500);
    }
  }

  notifyMe() {
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
      setTimeout(() => {
        this.setState({
          authorized: JSON.parse(localStorage.getItem('state')).authorized,
          name: JSON.parse(localStorage.getItem('state')).name,
        });
      }, 0);
    }
  }

  connect() {
    this.notifyMe();
    this.ws = new ReconnectingWebSocket(URL);
    this.ws.onopen = () => {
      console.log('____________connected: ', new Date());
      this.setState({ wsState: this.ws.readyState });
      this.notificationSend(
        'connection open',
        'https://www.mgtow.com/wp-content/uploads/ultimatemember/32309/profile_photo-256.png?1558599200',
      );
      if (this.state.offlineMessage) {
        this.state.offlineMessage.forEach((item) => {
          this.ws.send(JSON.stringify(item));
        });
        this.setState({ offlineMessage: [] });
      }
    };

    this.ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      this.addMessage(message);
    };

    this.ws.onclose = () => {
      console.log('_____________disconnected: ', new Date());
      this.setState({ wsState: this.ws.readyState });
      this.notificationSend(
        'connection closed',
        'https://cdn.clipart.email/d73437276d4eb5903c0491b2d16fa0ce_red-x-icon-clip-art-at-clkercom-vector-clip-art-online-royalty-_231-297.png',
      );
      this.setState({ readyState: this.ws.readyState });
    };

    this.ws.onerror = (error) => {
      console.log(`Ошибка ${error.message}`);
      // };
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.state.authorized === true) {
        this.connect();
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
        if (this.state.messages.findIndex((elem) => elem.id === item.id) === -1) {
          if (mes.length === 1) {
            this.notificationSend(
              item.from,
              'https://miro.medium.com/max/256/1*gGh9I9ju9w4lXhmWoG2fXA.png',
              item.message,
            );
          }
          this.setState({ messages: [...this.state.messages, item] });
        }
      });
  }

  submitMessage = (messageString) => {
    let message;
    if (this.state.wsState === 1) {
      message = { from: this.state.name, message: messageString };
      this.ws.send(JSON.stringify(message));
    } else if (this.state.wsState === 3) {
      message = {
        from: this.state.name,
        message: `offline-msg: ${messageString}`,
      };
      this.setState({
        offlineMessage: [...this.state.offlineMessage, message],
      });
    }
  };

  authorize(e) {
    const login = e.target.querySelector('input[type="login"]').value;
    this.setState({
      name: login.slice(0, 30),
      authorized: true,
    });
    const tempObj = {
      name: login.slice(0, 30),
      authorized: true,
    };
    localStorage.setItem('state', JSON.stringify(tempObj));

    setTimeout(() => {
      if (this.state.authorized === true) {
        this.connect();
      }
    }, 0);
  }

  handleClick() {
    this.setState({
      name: '',
      authorized: false,
    });
    const tempObj = {
      name: '',
      authorized: false,
    };
    localStorage.setItem('state', JSON.stringify(tempObj));
    this.ws.close();
  }

  render() {
    const header = (
      <Header onClick={this.handleClick} login={this.state.name} />
    );

    const login = (
      <form
        action="#"
        className="login__wrapper_form"
        onSubmit={this.authorize}
      >
        <Input className="input" type="login" placeholder="login" />
        <Button color="primary" type="submit" className="button">
          Login
        </Button>{' '}
      </form>
    );

    const chat = (
      <div className="chat__wrapper">
        <div className="chat__wrapper_text">
          <div className="input_message">
            {this.state.messages.map((mes, index) => (
              <Message
                key={index + mes.id}
                message={mes.message}
                name={mes.from}
                time={mes.time}
              />
            ))}
          </div>
        </div>
        <div className="form__wrapper">
          <Form
            inline
            action="."
            ws={this.state.ws}
            onSubmit={(e) => {
              e.preventDefault();
              this.submitMessage(this.state.message);
              this.setState({ message: '' });
            }}
          >
            <Col className="form__send-message" md="9" sm="8">
              <Input
                className="input"
                type="text"
                placeholder="enter message"
                value={this.state.message}
                onChange={(e) => {
                  this.setState({ message: e.target.value });
                }}
              />
            </Col>
            <Col md="3" sm="4">
              <div className="form__button-wrapper">
                <Button color="primary" className="button">
                  Send message
                </Button>{' '}
                {/* <Button
                  color="primary"
                  className="button"
                  onClick={() => {
                    this.ws.close(1000, 'работа закончена');
                  }}
                >
                  close Connection
                </Button>{' '}
                <Button
                  color="primary"
                  className="button"
                  onClick={this.connect}
                >
                  open Connection
                </Button>{' '} */}
              </div>
            </Col>
          </Form>
        </div>
      </div>
    );

    return (
      <div className="wrapper">
        {this.state.authorized ? header : null}
        <div className="main-wrapper">
          {this.state.authorized ? chat : login
          // <Chat messages={this.state.messages}message={this.state.message} />
          }
        </div>
      </div>
    );
  }
}

// MainPage.propTypes = {
//   name: PropTypes.string.isRequired,
// };
// const mapStateToProps = state => ({ lang: state.locales.lang });
// export default connect(mapStateToProps)(MainPage);
