import * as c from './../actions/ActionTypes';

export const deleteTicket = id => ({
  type: 'DELETE_TICKET',
  id
});

export const toggleForm = () => ({
  type: 'TOGGLE_FORM'
});

export const updateTime = (id, formattedWaitTime) => ({
  type: c.UPDATE_TIME,
  id: id,
  formattedWaitTime: formattedWaitTime
});