import React, { Component } from 'react';
import { Button, Input, Form } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Login.css';
import store from '../../store/store';

class Login extends Component {
  constructor(props) {
    super(props);
    this.authorize = this.authorize.bind(this);
  }

  authorize(e) {
    const login = e.target.querySelector('input[type="login"]').value;

    store.dispatch({
      type: 'authorized',
      payload: true,
    });
    store.dispatch({
      type: 'name',
      payload: login.slice(0, 30),
    });

    const tempObj = {
      name: login.slice(0, 30),
      authorized: true,
    };
    localStorage.setItem('state', JSON.stringify(tempObj));
    this.props.onConnection();
  }

  render() {
    return (
      <Form
        action="#"
        className="login__wrapper_form"
        onSubmit={this.authorize}
      >
        <Input
          className="input"
          type="login"
          name="login"
          placeholder="login"
        />
        <Button color="primary" type="submit" className="button">
          Login
        </Button>{' '}
      </Form>
    );
  }
}

Login.propTypes = {
  authorized: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onAddAuth: PropTypes.func.isRequired,
  onConnection: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  authorized: state.authorized,
  name: state.name,
});

const mapDispatchToProps = (dispatch) => ({
  onAddLogin: (login) => {
    dispatch({ type: 'login', payload: login.slice(0, 30) });
  },
  onAddAuth: (bool) => {
    dispatch({ type: 'authorized', payload: bool });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
