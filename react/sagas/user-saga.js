import { isCancelError } from 'redux-saga';
import { take, put, cancel, call, fork } from 'redux-saga/effects';
import { START_USER_REQUEST, CANCEL_USER_REQUEST,
         USER_REQUEST_FAILED, USER_REQUEST_SUCCEED,
         userRequestCanceled, userRequestFailed,
         userRequestSucceed, userRequestStarted } from './user';

// You may want this function to be imported from an api folder or something
export function fakeExternalApi(id, ms) {
  return new Promise((resolve, reject) => {
    if (Math.floor(Math.random() * 100) % 2) {
      window.setTimeout(() => { reject(new Error('ERROR: An error occurred!')); }, ms);
    } else {
      window.setTimeout(() => {
        resolve({
          id,
          name: 'Erwin G',
          img: 'http://lorempixel.com/100/100/'
        });
      }, ms);
    }
  });
}

export function* getUser(id) {
  try {
    const response = yield call(fakeExternalApi, id, 2000);
    yield put(userRequestSucceed(response));
  } catch (err) {
    if (isCancelError(err)) {
      yield put(userRequestCanceled());
    } else {
      // Probably also want to check if it's an authorization error so we
      // may trigger a logout action here
      yield put(userRequestFailed(err));
    }
  }
}

/**
 * DEFAULT - CHOOSE ONLY ONE EXPORT DEFAULT
 *
 * This saga listen for start or cancel user request actions, if it was a start request,
 * we cancel the previous one and start a new start request.
 * If the action was a cancel request, we just cancel the previous task if any.
 * At the end, we start listening for those actions again.
 *
 * This pattern is useful when you want to always get the latest request, so you can
 * spam requests and only the last one will be proceessed (finished by success or error).
 * You also can be able to cancel the in the way task.
 */
export default function* cancelableTakeLatestSaga() {
  let task;

  while (true) {
    const action = yield take([START_USER_REQUEST, CANCEL_USER_REQUEST]);
    if (task) yield cancel(task);

    if (action.type === START_USER_REQUEST) {
      task = yield fork(getUser, action.id);
      yield put(userRequestStarted());
    }
  }
}

/**
 * This saga listen for start user request actions, if one is in the way,
 * it won't listen to any other user request actions until
 * it finishes (resolved or rejected), or was canceled by a cancel user request.
 *
 * This pattern is useful when you want to just do one async action and wait till
 * it finishes or is manually canceled by a user, before continuing.
 */
export default function* cancelableTakeFirstSaga() {
  while (true) {
    const action = yield take(START_USER_REQUEST);
    const task = yield fork(getUser, action.id);
    const newAction = yield take([CANCEL_USER_REQUEST, USER_REQUEST_FAILED, USER_REQUEST_SUCCEED]);

    if (newAction.type === CANCEL_USER_REQUEST) yield cancel(task);
  }
}
