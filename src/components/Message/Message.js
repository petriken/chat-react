/* eslint-disable no-useless-escape */
import React from 'react';
import PropTypes from 'prop-types';
import './Message.css';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';

function createTextLinks(text) {
  let replacedText;

  // URLs starting with http://, https://, or ftp://
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = text.replace(
    replacePattern1,
    '<a href="$1" target="_blank">$1</a>',
  );

  // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(
    replacePattern2,
    '$1<a href="http://$2" target="_blank">$2</a>',
  );

  // Change email addresses to mailto:: links.
  const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(
    replacePattern3,
    '<a href="mailto:$1">$1</a>',
  );

  return replacedText;
}

function Message(props) {
  return (
    <div className="input_message">
      {props.messages.map((mes, index) => {
        const { from, message, time } = mes;
        const date = new Date(time);
        const fineTime = `${
          date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        }:${
          date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        }:${
          date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        } ${date.toDateString().slice(4, 10)}`;

        const ownMessage = (
          <div className="message-wrapper" key={index + mes.id}>
            <div className="message-time">{fineTime}</div>
            <div className="message message-secondary">
              {' '}
              <div className="message-from">
                <strong>{from.slice(0, 30)}</strong>
              </div>{' '}
              :{' '}
              <div className="message-text">
                {ReactHtmlParser(createTextLinks(message))}
              </div>
            </div>
          </div>
        );

        const commonMessage = (
          <div className="message-wrapper" key={index + mes.id}>
            <div className="message message-primary">
              {' '}
              <div className="message-from">
                <strong>{from.slice(0, 30)}</strong>
              </div>{' '}
              :{' '}
              <div className="message-text">
                {ReactHtmlParser(createTextLinks(message))}
              </div>
            </div>
            <div className="message-time">{fineTime}</div>
          </div>
        );

        return from === props.login ? ownMessage : commonMessage;
      })}
    </div>
  );
}

Message.propTypes = {
  login: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  messages: state.messages,
  login: state.name,
});
export default connect(mapStateToProps)(Message);
