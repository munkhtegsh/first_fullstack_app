import React from 'react';
import { getUserInfo } from './../../ducks/user';
import { connect } from 'react-redux';

class Private extends React.Component {
  componentDidMount() {
    this.props.getUserInfo();
  }

  bankBalance() {
    return '$' + Math.floor((Math.random() + 1) * 1000) + '.00';
  }

  render() {
    console.log(this.props);
    const { user } = this.props;
    const userDataJSX = this.props.user.display_name 
      ?
      (
        <div>
          <img src={ user.img } alt=""/>
          <p>Account Holder: { user.display_name }</p>
          <p>Account ID: { user.auth_id }</p>
          <p>Balance: { this.bankBalance() }</p>
          <a href="http://localhost:3002/auth/logout">
            <button className=''> Logout </button>
          </a>
        </div>
      )
      :
      (<p> Please log in!</p>)

    return (
      <div>
        <h1>Community Bank</h1>
        <hr/>
        <h4> Account information </h4>
        { userDataJSX }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, { getUserInfo })(Private);