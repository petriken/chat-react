import React, { Component } from 'react';
import { Button, Col, Input, Form } from 'reactstrap';

import './MainPage.css';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: false
    };
  }

  render() {
    const login = (
      <form
        action="#"
        className="login__wrapper_form"
        onSubmit={this.authorize}
      >
        <Input className="input" type="login" placeholder="login" />
        <Button color="primary" className="button">
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
      <div className="main-wrapper">{this.state.authorized ? chat : login}</div>
    );
  }
}

// const mapStateToProps = state => ({ lang: state.locales.lang });
// export default connect(mapStateToProps)(MainPage);
