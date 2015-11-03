'use strict';

/*
All that is missing is the actual sending of the client-side VOTE action to the server, so that it would be dispatched to both of the Redux stores

What we're going to do is create a "remote action middleware" that causes an action to be dispatched not only to the original store, but also to a remote store using a Socket.io connection.

It is a function that takes a Redux store, and returns another function that takes a "next" callback. That function returns a third function that takes a Redux action. The innermost function is where the middleware implementation will actually go

This style of nesting single-argument functions is called currying. In this case it's used so that the Middleware is easily configurable: If we had all the arguments in just one function (function(store, next, action) { }) we'd also have to supply all the arguments every time the middleware is used. With the curried version we can call the outermost function once, and get a return value that "remembers" which store to use. The same goes for the next argument.

The next argument is a callback that the middleware should call when it has done its work and the action should be sent to the store (or the next middleware):

It is not appropriate for the remote action middleware to send each and every action to the server. Some actions, such as SET_STATE, should just be handled locally in the client. We can extend the middleware to only send certain actions to the server. Concretely, we should only send out actions that have a {meta: {remote: true}} property attached:
 */

export default socket => store => next => action => {
  if (action.meta && action.meta.remote) {
    socket.emit('action', action);
  }
    return next(action);
};
