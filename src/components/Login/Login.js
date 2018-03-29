import React from 'react';
import './Login.css';
import logo from './communityBank.svg';

export default () => (
  <div className='App'>
    <img src={logo} alt=""/>
    <a href={process.env.REACT_APP_LOGIN}>
      <button className=''>Login</button>
    </a>
  </div>
)