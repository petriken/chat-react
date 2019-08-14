import React from 'react';
import PropTypes from 'prop-types';
import './Message.css';

export default function Message(props) {
  const { name, message, time } = props;
  const date = new Date(time);
  const fineTime = `${
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  } ${date.toDateString().slice(4, 10)}`;

  return (
    <div className="message-wrapper">
      <div className="message">
        {' '}
        <div className="message-name">
          <strong>{name.slice(0, 30)}</strong>
        </div>{' '}
        : <div className="message-text">{message}</div>
      </div>
      <span className="message-time">{fineTime}</span>
    </div>
  );
}

Message.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
};
