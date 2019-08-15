import React, { Component } from 'react';
import {
 Button, Col, Input, Form 
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
      // ws: new ReconnectingWebSocket(URL),
    };
    // this.ws = this.state.ws;
    // }
    this.authorize = this.authorize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  notifyMe() {
    // Проверка поддержки браузером уведомлений
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    }

    // Проверка разрешения на отправку уведомлений
    else if (Notification.permission === 'granted') {
      // Если разрешено, то создаем уведомление
      this.notification = new Notification('notification permissions granted');
    }

    // В противном случае, запрашиваем разрешение
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission((permission) => {
        // Если пользователь разрешил, то создаем уведомление
        if (permission === 'granted') {
          this.notification = new Notification(
            'notification permissions have been granted',
          );
        }
      });
    }
    // this.notification = new Notification(msg);
  }

  // setTimeout(()=> {
  componentDidMount() {
    // this.ws = this.state.ws;
    // this.notifyMe();
    setTimeout(() => {
      console.log(this.state.authorized === true);

      if (this.state.authorized === true) {
        this.ws = new ReconnectingWebSocket(URL);
        this.ws.onopen = () => {
          console.log('____________connected: ', new Date());
          console.log('open-socket.readyState', this.ws.readyState);

          this.notification = new Notification('connection open', {
            icon:
              'https://www.mgtow.com/wp-content/uploads/ultimatemember/32309/profile_photo-256.png?1558599200',
          });

          // setTimeout(() => {
          // this.notification.close();
          // }, 8000);
          this.setState({ readyState: this.ws.readyState });
        };

        this.ws.onmessage = (e) => {
          const message = JSON.parse(e.data);
          this.addMessage(message);
        };

        this.ws.onclose = () => {
          console.log('_____________disconnected: ', new Date());
          // automatically try to reconnect on connection loss
          // this.ws = new WebSocket(URL);
          // this.setState({
          //   ws: new WebSocket(URL)
          // });
          this.notification = new Notification('connection closed', {
            icon:
              'https://cdn.clipart.email/d73437276d4eb5903c0491b2d16fa0ce_red-x-icon-clip-art-at-clkercom-vector-clip-art-online-royalty-_231-297.png',
          });
          // setTimeout(() => {
          // this.notification.close();

          // }, 8000);
          console.log('close-socket.readyState', this.ws.readyState);
          this.setState({ readyState: this.ws.readyState });
        };

        this.ws.onerror = (error) => {
          console.log(`Ошибка ${error.message}`);
          // };
        };
      }
    }, 0);
  }
  // }  ,0);

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    console.log('before', this.state.authorized);

    if (localStorage.getItem('state')) {
      console.log('auth', JSON.parse(localStorage.getItem('state')).authorized);

      setTimeout(() => {
        this.setState({
          authorized: JSON.parse(localStorage.getItem('state')).authorized,
          name: JSON.parse(localStorage.getItem('state')).name,
        });
        console.log('after', this.state.authorized);
      }, 0);
      console.log('afterafter', this.state.authorized);
    }
  }

  // componentDidUpdate(prevState) {
  //   // Популярный пример (не забудьте сравнить пропсы):
  //   if (this.state.ws !== prevState.ws) {
  //     this.setState({ ws: new ReconnectingWebSocket(URL) });
  //   }
  // }

  addMessage(mes) {
    // console.log('mes', mes);

    // mes.forEach(item => {
    //   console.log(`${item.from}: ${item.message}`);
    // });

    mes
      .reverse()
      // .slice(0, 99)
      .forEach((item) => {
        if (this.state.messages.findIndex((elem) => elem.id === item.id) === -1) {
          // console.log('length', mes.length);

          if (mes.length === 1) {
            this.notification = new Notification(item.from, {
              body: item.message,
              icon:
                'https://miro.medium.com/max/256/1*gGh9I9ju9w4lXhmWoG2fXA.png',
            });
            setTimeout(() => {
              this.notification.close();
            }, 2000);
          }
          this.setState({ messages: [...this.state.messages, item] });
        }
      });
  }

  submitMessage = (messageString) => {
    const message = { from: this.state.name, message: messageString };
    this.ws.send(JSON.stringify(message));
    console.log('message', message.message);
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
  }

  // handleSubmit(e) {
  //   e.preventDefault();
  //   this.submitMessage('hi');
  //   this.setState({ message: '' });
  // }

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
                <Button
                  color="primary"
                  className="button"
                  onClick={() => {
                    this.ws.close(1000, 'работа закончена');
                  }}
                >
                  close Connection
                </Button>{' '}
                {/* <Button
                  color="primary"
                  className="button"
                  onClick={() => {
                    this.setState({
                      ws: new WebSocket(URL),
                    });
                  }}
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
          {this.state.authorized
            ? chat
            : // <Chat messages={this.state.messages}message={this.state.message} />
            login}
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
