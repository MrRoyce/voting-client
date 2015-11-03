'use strict';

import React from 'react';
import classNames from 'classnames'
;import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({

  mixins: [PureRenderMixin],

  getPair: function() {
    return this.props.pair || [];
  },

  isDisabled: function() {
    return !!this.props.hasVoted;
  },

  hasVotedFor: function(entry) {
    return this.props.hasVoted === entry;
  },

  // The 'vote' onClick callback property is connected from 'Voting'
  // via the Redux connect function and the action creators
  render: function() {
    return <div className="voting">
      {this.getPair().map(entry =>
        <button key={entry}
                className={classNames({voted: this.hasVotedFor(entry)})}
                disabled={this.isDisabled()}
                onClick={() => this.props.vote(entry)}>
          <h1>{entry}</h1>
          {this.hasVotedFor(entry) ?
            <div className="label">Voted</div> :
            null}
        </button>
      )}
    </div>;
  }
});
