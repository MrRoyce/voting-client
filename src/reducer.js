/* eslint-disable default-case*/
'use strict';

import {List, Map} from 'immutable';

/*
 * The reducer should handle the SET_STATE action.
 * In its handler function we can actually just merge
 * the given new state to the old state,
 * using the merge function from Map. That makes our tests pass!
 */
function setState(state, newState) {
  return state.merge(newState);
}

function vote(state, entry) {

  const currentPair = state.getIn(['vote', 'pair']);

  if (currentPair && currentPair.includes(entry)) {
    return state.set('hasVoted', entry);
  } else {
    return state;
  }
}

function resetVote(state) {

  const hasVoted = state.get('hasVoted');
  const currentPair = state.getIn(['vote', 'pair'], List());

  if (hasVoted && !currentPair.includes(hasVoted)) {
    return state.remove('hasVoted');
  } else {
    return state;
  }
}

export default function(state = Map(), action) {
  switch (action.type) {

      case 'SET_STATE':
        return resetVote(setState(state, action.state));

      case 'VOTE':
        return vote(state, action.entry);

  }

  return state;
}
