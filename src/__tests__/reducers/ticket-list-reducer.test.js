/* eslint-disable no-unused-vars */
import ticketListReducer from '../../reducers/ticket-list-reducer';
import * as c from './../../actions/ActionTypes';
import Moment from 'moment';

describe ('testListReducer', () => {
  let action;
  const ticketData = {
    names: 'Ryan & Amir',
    location: '4b',
    issue: 'Redux no work',
    timeOpen: 0,
    id: 1
  };

  const currentState = {
    1: {names: 'Ryan & Amir',
    location: '4b',
    issue: 'Redux no work',
    id: 1},
    2: {names: 'Jasmine & Justine',
    location: '2a',
    issue: 'Reducer has side effects',
    id: 2}
  };

  test('Should return default state if there is no action type passed into the reducer', () => {
    expect(ticketListReducer({},{ type: null })).toEqual({});
  });

  test('Should successfully delete a ticket', () => {
    action = {
      type: 'DELETE_TICKET',
      id: 1
    };
    expect(ticketListReducer(currentState, action)).toEqual({
      2: {names: 'Jasmine & Justine',
      location: '2a',
      issue: 'Reducer has side effects',
      id: 2 }
    });
  });

  test('Should add a formatted wait time to ticket entry', () => {
    const { names, location, issue, timeOpen, id } = ticketData;
    action = {
      type: c.UPDATE_TIME,
      formattedWaitTime: '4 minutes',
      id: id
    };
    expect(ticketListReducer({ [id] : ticketData }, action)).toEqual({
      [id] : {
        names: names,
        location: location,
        issue: issue,
        timeOpen: timeOpen,
        id: id,
        formattedWaitTime: '4 minutes'
      }
    });
  });
});