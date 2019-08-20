import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

import './Header.css';

function Header(props) {
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

const mapStateToProps = (state) => ({
  // messages: state.messages,
  login: state.name,
});
export default connect(mapStateToProps)(Header);
