import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import './Header.css';

export default function Header(props) {
  const { login } = props;

  return (
    <div className="header-wrapper">
      <div className="header-login">{login}</div>
      <Button color="primary" className="button" onClick={props.onClick}>
        Log out
      </Button>{' '}
    </div>
  );
}

Header.propTypes = {
  login: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
