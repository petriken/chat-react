import React from 'react';
import PropTypes from 'prop-types';
import './Message.css';

export default function Message(props) {
  const {
    name, message, time, login,
  } = props;
  const date = new Date(time);
  const fineTime = `${
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  } ${date.toDateString().slice(4, 10)}`;

  const ownMessage = (
    <div className="message-wrapper">
      <div className="message-time">{fineTime}</div>
      <div className="message message-secondary">
        {' '}
        <div className="message-name">
          <strong>{name.slice(0, 30)}</strong>
        </div>{' '}
        : <div className="message-text">{message}</div>
      </div>
    </div>
  );

  const commonMessage = (
    <div className="message-wrapper">
      <div className="message message-primary">
        {' '}
        <div className="message-name">
          <strong>{name.slice(0, 30)}</strong>
        </div>{' '}
        : <div className="message-text">{message}</div>
      </div>
      <div className="message-time">{fineTime}</div>
    </div>
  );

  return name === login ? ownMessage : commonMessage;
}

Message.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
};
