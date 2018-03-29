import axios from 'axios';

const initialState = {
  user: {}
}

const UPDATE_USER_INFO = 'UPDATE_USER_INFO';

export const getUserInfo = () => {
  console.log('userData')

  const userData = axios.get('/auth/me').then(res => {
    return res.data;
  });

  return {
    type: UPDATE_USER_INFO,
    payload: userData
  }
}

const reducer = (state = initialState, action) => {
  console.log(action)
  switch(action.type) {
    case UPDATE_USER_INFO + '_FULFILLED':
      return Object.assign({}, state, {user: action.payload});
    default:
      return state;
  }
}

export default reducer;
