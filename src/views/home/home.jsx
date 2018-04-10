import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import BaseComponent from '../../common/BaseComponent.jsx';

import './home.less';

class Home extends BaseComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const { logined } = this.props;
    if (!logined) {
      return <Redirect from="/" to="/login" />;
    }
    return (
      <div className="home">
        <Link to="login">主页</Link>
      </div>
    );
  }
}

export default connect(
    (state) => {
      return {
        logined: state.getIn(['loginReducers', 'logined'])
      }
    },
    null,
)(Home);