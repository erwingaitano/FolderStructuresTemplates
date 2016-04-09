///////////////
// CONSTANTS //
///////////////

export const START_USER_REQUEST = 'START_USER_REQUEST';
export const CANCEL_USER_REQUEST = 'CANCEL_USER_REQUEST';
export const USER_REQUEST_STARTED = 'USER_REQUEST_STARTED';
export const USER_REQUEST_CANCELED = 'USER_REQUEST_CANCELED';
export const USER_REQUEST_SUCCEED = 'USER_REQUEST_SUCCEED';
export const USER_REQUEST_FAILED = 'USER_REQUEST_FAILED';

/////////////////////
// ACTION CREATORS //
/////////////////////

export function startUserRequest(id) {
  return { type: START_USER_REQUEST, id };
}

export function cancelUserRequest() {
  return { type: CANCEL_USER_REQUEST };
}

export function userRequestStarted() {
  return { type: USER_REQUEST_STARTED };
}

export function userRequestCanceled() {
  return { type: USER_REQUEST_CANCELED };
}

export function userRequestSucceed(user) {
  return { type: USER_REQUEST_SUCCEED, user };
}

export function userRequestFailed(error) {
  return { type: USER_REQUEST_FAILED, error };
}

///////////////////
// INITIAL STATE //
///////////////////

export const initialState = {
  isRequesting: false,
  isLoaded: false
};

/////////////
// REDUCER //
/////////////

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_REQUEST_STARTED: {
      console.log('started');
      return {
        ...state,
        isRequesting: true
      };
    }

    case USER_REQUEST_CANCELED: {
      console.log('canceled');
      return {
        ...state,
        isRequesting: false
      };
    }

    case USER_REQUEST_SUCCEED: {
      console.log('succeed', action.user);
      return {
        ...state,
        ...action.user,
        isRequesting: false,
        isLoaded: true
      };
    }

    case USER_REQUEST_FAILED: {
      console.log('failed', action.error);
      return {
        ...state,
        error: action.error,
        isRequesting: false,
        isLoaded: false
      };
    }

    default: return state;
  }
}
