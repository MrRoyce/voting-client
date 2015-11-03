'use strict';

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import Winner from './Winner';
import Vote from './Vote';
import * as actionCreators from '../action_creators';

export const Voting = React.createClass({
  mixins: [PureRenderMixin],
/*
 * The Voting component itself now merely
 * makes a decision about which of these
 * two components to render:
 */
  render : function () {
    return <div>
      {this.props.winner ?
        <Winner ref="winner" winner={this.props.winner} /> :
        <Vote {...this.props} />}
    </div>;
  }
});

/*
 * The role of the mapping function is to map the state from the Redux Store into an object of props. Those props will then be merged into the props of the component that's being connected. In the case of Voting, we just need to map the pair and winner from the state:
 */
function mapStateToProps(state) {
  return {
    pair: state.getIn(['vote', 'pair']),
    hasVoted: state.get('hasVoted'),
    winner: state.get('winner')
  };
}

connect(mapStateToProps)(Voting);

/*
 The module now exports two components: The pure component Voting and the connected component VotingContainer. The react-redux documentation calls the former a "dumb" component and the latter a "smart" component. I prefer "pure" and "connected". Call them what you will, understanding the difference is key:

- The pure/dumb component is fully driven by the props it is given. It is the component equivalent of a pure function.
- The connected/smart component, on the other hand, wraps the pure version with some logic that will keep it in sync with the changing state of the Redux Store. That logic is provided by redux-react.

A really neat thing about action creators is the way react-redux can connect them to React components: We have a vote callback prop on Voting, and a vote action creator. Both have the same name and the same function signature: A single argument, which is the entry being voted. What we can do is simply give our action creators to the react-redux connect function as the second argument, and the connection will be made:

The effect of this is that a vote prop will be given to Voting. That prop is a function that creates an action using the vote action creator, and also dispatches that action to the Redux Store. Thus, clicking a vote button now dispatches an action! You should be able to see the effects in the browser immediately: When you vote on something, the buttons will become disabled.
 */
export const VotingContainer = connect(
  mapStateToProps,
  actionCreators  // Give the action creator to the connect function which
  // finally gives the vote property to Voting!!!!
)(Voting);
