import React from 'react';
import PropTypes from 'prop-types';
import './Chat.css';
import {
  Button, Col, Input, Form,
} from 'reactstrap';
import { connect } from 'react-redux';
import Message from '../Message/Message';
import store from '../../store/store';

function handleSubmit(props, e) {
  e.preventDefault();
  props.submitMessage(props.message);
  store.dispatch({
    type: 'message',
    payload: '',
  });
}

function Chat(props) {
  return (
  <div className="chat__wrapper">
  <div className="chat__wrapper_text">
    <Message />
  </div>
  <div className="form__wrapper">
    <Form
      inline
      action="#"
      onSubmit={(e) => handleSubmit(props, e)}
    >
      <Col className="form__send-message" md="9" sm="8">
        <Input
          className="input"
          type="text"
          placeholder="enter message"
          value={props.message}
          onChange={(e) => {
            store.dispatch({
              type: 'message',
              payload: e.target.value,
            });
          }}
        />
      </Col>
      <Col md="3" sm="4">
        <div className="form__button-wrapper">
          <Button color="primary" className="button button-send">
            Send message
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
