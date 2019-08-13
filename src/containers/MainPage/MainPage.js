import React, { Component } from 'react';
import {
 Button, Col, Input, Form 
} from 'reactstrap';
// import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import './MainPage.css';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem('state')) {
      this.state = JSON.parse(localStorage.getItem('state'));
    } else {
      this.state = {
        authorized: false,
        name: '',
      };
    }
    this.authorize = this.authorize.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  authorize(e) {
    const login = e.target.querySelector('input[type="login"]').value;
    this.setState({
      name: login,
      authorized: true,
    });
    const tempObj = {
      name: login,
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
            <h1>Hello everything</h1>
          </div>
        </div>
        <div className="form__wrapper">
          <Form inline>
            <Col className="form__send-message" md="9" sm="8">
              <Input
                className="input"
                type="text"
                placeholder="enter message"
              />
            </Col>
            <Col md="3" sm="4">
              <div className="form__button-wrapper">
                <Button color="primary" className="button">
                  Send message
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
          {this.state.authorized ? chat : login}
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
