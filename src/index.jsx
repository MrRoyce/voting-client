'use strict';

/*
 * Getting Data In from Redux to React

We have a Redux Store that holds our immutable application state. We have stateless React components that take immutable data as inputs. The two would be a great fit: If we can figure out a way to always get the latest data from the Store to the components, that would be perfect. React would re-render when the state changes, and the pure render mixin would make sure that the parts of the UI that have no need to re-render won't be.

Rather than writing such synchronization code ourselves, we can make use of the Redux React bindings that are available in the react-redux package:
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import io from 'socket.io-client';
import reducer from './reducer';
import {setState} from './action_creators';
import remoteActionMiddleware from './remote_action_middleware';
import App from './components/App';
import {VotingContainer} from './components/Voting';
import {ResultsContainer} from './components/Results';

require('./style.css');

const socket = io(`${location.protocol}//${location.hostname}:8090`);

/*
 If we now plug in this middleware to our Redux store, we should see all actions being logged. The middleware can be activated using an applyMiddleware function that Redux ships with. It takes the middleware we want to register, and returns a function that takes the createStore function. That second function will then create a store for us that has the middleware included in it:
 */

// This is another instance of the curried style of configuring things
// that we just discussed. Redux APIs use it quite heavily.
const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket)
)(createStore);

const store = createStoreWithMiddleware(reducer);

socket.on('state', state =>
  store.dispatch(setState(state))  // from setState in action_creator
);

const routes = <Route component={App}>
    <Route path="/results" component={ResultsContainer} />
    <Route path="/" component={VotingContainer} />
</Route>;

/*
 * The big idea of react-redux is to take our pure components and wire them up into a Redux Store by doing two things:

1. Mapping the Store state into component input props.
2. Mapping actions into component output callback props.
Before any of this is possible, we need to wrap our top-level application component inside a react-redux Provider component. This connects our component tree to a Redux store, enabling us to make the mappings for individual components later.

We'll put in the Provider around the Router component. That'll cause the Provider to be an ancestor to all of our application components:
 */

ReactDOM.render(
  <Provider store={store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
