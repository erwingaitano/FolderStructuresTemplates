/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */
/* global expect, dump */

import _ from 'lodash';
import { SagaCancellationException } from 'redux-saga';
import { put, call, take, fork, cancel } from 'redux-saga/effects';
import saga, { getUser, fakeExternalApi } from './user-saga';
import { createMockTask } from 'redux-saga/utils';

import reducer,
       { START_USER_REQUEST, CANCEL_USER_REQUEST,
         USER_REQUEST_STARTED, USER_REQUEST_CANCELED,
         USER_REQUEST_SUCCEED, USER_REQUEST_FAILED,
         startUserRequest, cancelUserRequest, userRequestCanceled,
         userRequestFailed, userRequestSucceed, userRequestStarted,
         initialState } from './user';


describe('Module User', function () {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState);
  });

  it('should return the same state', () => {
    expect(initialState, {}).to.equal(initialState);
  });

  describe('START_USER_REQUEST', () => {
    it('should return an action for start user request', () => {
      expect(startUserRequest(3)).to.eql({
        type: START_USER_REQUEST,
        id: 3
      });
    });

    it('should return the same state when this action happened', () => {
      expect(reducer(initialState, startUserRequest(3))).to.eql(initialState);
    });
  });

  describe('CANCEL_USER_REQUEST', () => {
    it('should return an action for cancel user request', () => {
      expect(cancelUserRequest()).to.eql({ type: CANCEL_USER_REQUEST });
    });

    it('should return the same state when this action happened', () => {
      expect(reducer(initialState, cancelUserRequest())).to.eql(initialState);
    });
  });

  describe('USER_REQUEST_STARTED', () => {
    it('should return an action for user request started', () => {
      expect(userRequestStarted()).to.eql({
        type: USER_REQUEST_STARTED
      });
    });

    it('should return a new state for a request started', () => {
      const dummyState = _.cloneDeep(initialState);
      const expectedState = _.cloneDeep(initialState);
      expectedState.isRequesting = true;
      expectedState.isLoaded = false;

      const newState = reducer(dummyState, userRequestStarted());
      expect(newState).to.eql(expectedState);
    });
  });

  describe('USER_REQUEST_CANCELED', () => {
    it('should return an action for user request canceled', () => {
      expect(userRequestCanceled()).to.eql({
        type: USER_REQUEST_CANCELED
      });
    });

    it('should return a new state for user request canceled', () => {
      const expectedState = _.cloneDeep(initialState);
      expectedState.isRequesting = false;
      const newState = reducer(initialState, userRequestCanceled());
      expect(newState).to.eql(expectedState);
    });

    it(`should return a new state for user request
        canceled when already requested data in state`, () => {
      const dummyState = _.cloneDeep(initialState);
      dummyState.name = 'Erwin';
      dummyState.isLoaded = true;

      const expectedState = _.cloneDeep(dummyState);
      expectedState.isRequesting = false;

      const newState = reducer(dummyState, userRequestCanceled());
      expect(newState).to.eql(expectedState);
    });
  });

  describe('USER_REQUEST_SUCCEED', () => {
    it('should return a new action for user request succeed', () => {
      expect(userRequestSucceed({ name: 'Erwin', id: 3 })).to.eql({
        type: USER_REQUEST_SUCCEED,
        user: { name: 'Erwin', id: 3 }
      });
    });

    it('should return a new state for user request succeed', () => {
      const expectedState = _.cloneDeep(initialState);
      expectedState.isLoaded = true;
      expectedState.name = 'Erwin';
      expectedState.error = null;

      const newState = reducer(initialState, userRequestSucceed({ name: 'Erwin' }));
      expect(newState).to.eql(expectedState);
    });

    it(`should return a new state for user request succeed,
        when an already user was requested successfully`, () => {
      const dummyState = _.cloneDeep(initialState);
      dummyState.name = 'Erwin';
      dummyState.isLoaded = true;

      const expectedState = _.cloneDeep(dummyState);
      expectedState.isLoaded = true;
      expectedState.name = 'Gaitan';
      expectedState.error = null;

      const newState = reducer(dummyState, userRequestSucceed({ name: 'Gaitan' }));
      expect(newState).to.eql(expectedState);
    });

    it(`should return a new state for user request succeed,
        when an already user was requested with an error`, () => {
      const dummyState = _.cloneDeep(initialState);
      dummyState.name = 'Erwin';
      dummyState.isLoaded = false;
      dummyState.error = new Error('error');

      const expectedState = _.cloneDeep(dummyState);
      expectedState.isLoaded = true;
      expectedState.name = 'Gaitan';
      expectedState.error = null;

      const newState = reducer(dummyState, userRequestSucceed({ name: 'Gaitan' }));
      expect(newState).to.eql(expectedState);
    });
  });

  describe('USER_REQUEST_FAILED', () => {
    it('should return a new action for user request failed', () => {
      expect(userRequestFailed(new Error('Error bro'))).to.eql({
        type: USER_REQUEST_FAILED,
        error: new Error('Error bro')
      });
    });

    it('should return a new state for user request failed', () => {
      const expectedState = _.cloneDeep(initialState);
      expect(initialState).to.eql(expectedState);
    });

    it(`should return a new state for user request failed
        when an already item was loaded successfully`, () => {
      const dummyState = _.cloneDeep(initialState);
      dummyState.name = 'Erwin';
      dummyState.isLoaded = true;

      const expectedState = _.cloneDeep(dummyState);
      expectedState.isLoaded = false;
      expectedState.error = new Error('fuck');

      const newState = reducer(dummyState, userRequestFailed(new Error('fuck')));
      expect(newState).to.eql(expectedState);
    });

    it(`should return a new state for user request failed
        when an already item was loaded with error`, () => {
      const dummyState = _.cloneDeep(initialState);
      dummyState.isLoaded = false;
      dummyState.error = new Error('initial error');

      const expectedState = _.cloneDeep(dummyState);
      expectedState.isLoaded = false;
      expectedState.error = new Error('fuck');

      const newState = reducer(dummyState, userRequestFailed(new Error('fuck')));
      expect(newState).to.eql(expectedState);
    });
  });

  describe('Saga', () => {
    describe('getUser()', () => {
      it('should be a success reponse', () => {
        const dummyResponse = { name: 'Erwin' };

        const gen = getUser(3);
        let next = gen.next();

        expect(next.value).to.eql(call(fakeExternalApi, 3, 2000));
        next = gen.next(dummyResponse);

        expect(next.value).to.eql(put(userRequestSucceed(dummyResponse)));
        next = gen.next();

        expect(next).to.eql({ done: true, value: undefined });
      });

      it('should be a fail response', () => {
        const dummyError = { message: 'ERROR' };

        const gen = getUser(3);
        let next = gen.next();

        expect(next.value).to.eql(call(fakeExternalApi, 3, 2000));
        next = gen.throw(dummyError);

        expect(next.value).to.eql(put(userRequestFailed(dummyError)));
        next = gen.next();

        expect(next).to.eql({ done: true, value: undefined });
      });

      it('should be a cancel response', () => {
        const dummySagaError = new SagaCancellationException();

        const gen = getUser(3);
        let next = gen.next();

        expect(next.value).to.eql(call(fakeExternalApi, 3, 2000));
        next = gen.throw(dummySagaError);

        expect(next.value).to.eql(put(userRequestCanceled()));
        next = gen.next();

        expect(next).to.eql({ done: true, value: undefined });
      });
    });

    describe('cancelableTakeLatestSaga()', () => {
      it(`should start an user request for the
          first time and listen for start/cancel request`, () => {
        const dummyAction = startUserRequest(3);
        const dummyTask = createMockTask();

        const gen = saga();
        let next = gen.next();

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
        next = gen.next(dummyAction);

        expect(next.value).to.eql(fork(getUser, 3));
        next = gen.next(dummyTask);

        expect(next.value).to.eql(put(userRequestStarted()));
        next = gen.next();

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
      });

      it('should start a new user request and cancel an existing one', () => {
        const dummyTask = createMockTask();
        const dummyTask2 = createMockTask();
        const dummyAction = startUserRequest(3);
        const dummyAction2 = startUserRequest(4);
        const gen = saga();
        let next = gen.next();

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
        next = gen.next(dummyAction);

        expect(next.value).to.eql(fork(getUser, 3));
        next = gen.next(dummyTask);

        expect(next.value).to.eql(put(userRequestStarted()));
        next = gen.next();

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
        next = gen.next(dummyAction2);

        expect(next.value).to.eql(cancel(dummyTask));
        next = gen.next();

        expect(next.value).to.eql(fork(getUser, 4));
        next = gen.next(dummyTask2);

        expect(next.value).to.eql(put(userRequestStarted()));
        next = gen.next();

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
      });

      it('should cancel a non existant user request', () => {
        const dummyAction = cancelUserRequest();

        const gen = saga();
        let next = gen.next();

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
        next = gen.next(dummyAction);

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
      });

      it('should cancel a pending user request', () => {
        const dummyAction = startUserRequest(3);
        const dummyAction2 = cancelUserRequest();
        const dummyTask = createMockTask();

        const gen = saga();
        let next = gen.next();

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
        next = gen.next(dummyAction);

        expect(next.value).to.eql(fork(getUser, 3));
        next = gen.next(dummyTask);

        expect(next.value).to.eql(put(userRequestStarted()));
        next = gen.next();

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
        next = gen.next(dummyAction2);

        expect(next.value).to.eql(cancel(dummyTask));
        next = gen.next();

        expect(next.value).to.eql(take([START_USER_REQUEST, CANCEL_USER_REQUEST]));
      });
    });

    describe('cancelableTakeFirstSaga()', () => {
      it('should start an user request for the first time and succeed', () => {
        const dummyAction = startUserRequest(3);
        const dummyNewAction = userRequestSucceed({ name: 'Erwin' });
        const dummyTask = createMockTask();

        const gen = saga();
        let next = gen.next();

        expect(next.value).to.eql(take(START_USER_REQUEST));
        next = gen.next(dummyAction);

        expect(next.value).to.eql(fork(getUser, dummyAction.id));
        next = gen.next(dummyTask);

        expect(next.value).to.eql(put(userRequestStarted()));
        next = gen.next();

        expect(next.value).to.eql(
          take([CANCEL_USER_REQUEST, USER_REQUEST_FAILED, USER_REQUEST_SUCCEED]));
        next = gen.next(dummyNewAction);

        expect(next.value).to.eql(take(START_USER_REQUEST));
      });

      it('should start an user request for the first time and failed', () => {
        const dummyAction = startUserRequest(3);
        const dummyNewAction = userRequestFailed(new Error('error'));
        const dummyTask = createMockTask();

        const gen = saga();
        let next = gen.next();

        expect(next.value).to.eql(take(START_USER_REQUEST));
        next = gen.next(dummyAction);

        expect(next.value).to.eql(fork(getUser, dummyAction.id));
        next = gen.next(dummyTask);

        expect(next.value).to.eql(put(userRequestStarted()));
        next = gen.next();

        expect(next.value).to.eql(
          take([CANCEL_USER_REQUEST, USER_REQUEST_FAILED, USER_REQUEST_SUCCEED]));
        next = gen.next(dummyNewAction);

        expect(next.value).to.eql(take(START_USER_REQUEST));
      });

      it('should start an user request for the first time and be canceled', () => {
        const dummyAction = startUserRequest(3);
        const dummyNewAction = cancelUserRequest();
        const dummyTask = createMockTask();

        const gen = saga();
        let next = gen.next();

        expect(next.value).to.eql(take(START_USER_REQUEST));
        next = gen.next(dummyAction);

        expect(next.value).to.eql(fork(getUser, dummyAction.id));
        next = gen.next(dummyTask);

        expect(next.value).to.eql(put(userRequestStarted()));
        next = gen.next();

        expect(next.value).to.eql(
          take([CANCEL_USER_REQUEST, USER_REQUEST_FAILED, USER_REQUEST_SUCCEED])
        );
        next = gen.next(dummyNewAction);

        expect(next.value).to.eql(cancel(dummyTask));
        next = gen.next();

        expect(next.value).to.eql(take(START_USER_REQUEST));
      });

      it('should do nothing when a new user request is made but one is in progress', () => {
        const dummyAction = startUserRequest(3);
        const dummyTask = createMockTask();

        const gen = saga();
        let next = gen.next();

        expect(next.value).to.eql(take(START_USER_REQUEST));
        next = gen.next(dummyAction);

        expect(next.value).to.eql(fork(getUser, dummyAction.id));
        next = gen.next(dummyTask);

        expect(next.value).to.eql(put(userRequestStarted()));
        next = gen.next();

        // Generator hanging here because it's waiting for any of the below 3 actions but
        // the user is sending more startUserRequest actions.
        expect(next.value).to.eql(
          take([CANCEL_USER_REQUEST, USER_REQUEST_FAILED, USER_REQUEST_SUCCEED])
        );
      });
    });
  });
});
