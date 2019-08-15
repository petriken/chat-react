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
// const ws = new WebSocket(URL);
// let ws;

export default class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authorized: localStorage.getItem('state')
        ? JSON.parse(localStorage.getItem('state')).authorized
        : false,
      name: localStorage.getItem('state')
        ? JSON.parse(localStorage.getItem('state')).name
        : '',
      message: '',
      messages: [],
      // ws: null,
    };
    this.ws = new ReconnectingWebSocket(URL);
    // }
    this.authorize = this.authorize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  componentDidMount() {
    // let ws = null;

    // this.ws = this.state.ws || new WebSocket(URL);
    // this.ws = new WebSocket(URL);

    this.ws.onopen = () => {
      console.log('____________connected');
      console.log('open-socket.readyState', this.ws.readyState);
    };

    this.ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      this.addMessage(message);
      // console.log('-mes-socket.readyState', this.ws.readyState);
    };

    this.ws.onclose = () => {
      console.log('_____________disconnected');
      // automatically try to reconnect on connection loss
      // ws = new WebSocket(URL);
      this.ws = new WebSocket(URL);
      // setTimeout(() => {
      this.setState({
        ws: new WebSocket(URL),
      });
      // }, 1000);
      console.log('close-socket.readyState', this.ws.readyState);
    };

    this.ws.onerror = (error) => {
      console.log(`Ошибка ${error.message}`);
    };
  }

  // addMessage(mes) {
  //   mes.reverse().forEach((item) => {
  //     this.state.messages.push(item);
  //   });
  // }

  addMessage(mes) {
    console.log('mes', mes);
    mes.reverse().forEach((item) => {
      if (mes.indexOf(item.id) === -1) {
        this.setState({ messages: [...this.state.messages, item] });
      }
    });
  }

  // addMessage = mes =>
  //   this.setState(() => ({ messages: [mes, ...this.state.messages] }));

  submitMessage = (messageString) => {
    const message = { from: this.state.name, message: messageString };
    this.ws.send(JSON.stringify(message));
    console.log('message', message.message);

    // this.addMessage(message);
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
      message: this.state.message,
      // messages: this.state.messages,
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
                <Button
                  color="primary"
                  className="button"
                  onClick={() => {
                    this.setState({
                      ws: new WebSocket(URL),
                    });
                  }}
                >
                  open Connection
                </Button>{' '}
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
