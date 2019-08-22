import React from 'react';
import PropTypes from 'prop-types';
import './Chat.css';
import {
  Button, Col, Input, Form,
} from 'reactstrap';
import { connect } from 'react-redux';
import Message from '../Message/Message';
import globe from '../../assets/9.gif';
import store from '../../store/store';

function handleSubmit(props, e) {
  e.preventDefault();
  props.submitMessage(props.message);
  store.dispatch({
    type: 'message',
    payload: '',
  });
}

function handleChange(e) {
  store.dispatch({
    type: 'message',
    payload: e.target.value,
  });
}

function Chat(props) {
  return (
  <div className="chat__wrapper">
  <div className="chat__wrapper_text">
      <Message />
      <div className="chat__wrapper_loading chat__wrapper_loading-disconnect" id="chat__wrapper_loading">Connection to server {'  '}<img alt="downloading-gif" width="30" height="30" src={ globe }/>  </div>
  </div>
  <div className="form__wrapper">
    <Form
      // inline
      action="#"
      onSubmit={(e) => handleSubmit(props, e)}
      className="form__send-message"
    >
      <Col className="form-input__send-message"
       md="10" sm="10"
       >
        <Input
          className="input"
          type="text"
          placeholder="enter message"
          value={props.message}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </Col>
      <Col
      // md="2" sm="2"
      >
        <div className="form__button-wrapper">
          <Button color="primary" className="button button-send">
            Send
          </Button>{' '}
        </div>
      </Col>
    </Form>
  </div>
</div>);
}

Chat.propTypes = {
  message: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  message: state.message,
});

export default connect(mapStateToProps)(Chat);
