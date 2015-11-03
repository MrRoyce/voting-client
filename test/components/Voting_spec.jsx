/* eslint-disable no-unused-expressions*/

import React from 'react/addons';
import {List} from 'immutable';
import ReactDOM from 'react-dom';
import {Voting} from '../../src/components/Voting';
import {expect} from 'chai';

const {renderIntoDocument, scryRenderedDOMComponentsWithTag, Simulate} = React.addons.TestUtils;

describe('Voting', () => {

    it('renders a pair of buttons', () => {
    const component = renderIntoDocument(
      <Voting pair={["Trainspotting", "28 Days Later"]} />
    );

    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons.length).to.equal(2);
    expect(buttons[0].textContent).to.equal('Trainspotting');
    expect(buttons[1].textContent).to.equal('28 Days Later');
    });

    /*
    * When one of those voting buttons is clicked,
    * the component should invoke a callback function.
    * Like the entry pair, the callback function
    * should also be given to the component as a prop.
    */
    it('invokes callback when a button is clicked', () => {

        let votedWith;

        const vote = (entry) => votedWith = entry;

        const component = renderIntoDocument(
          <Voting pair={["Trainspotting", "28 Days Later"]}
                  vote={vote}/>
        );
        const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
        Simulate.click(buttons[0]);  // Click on 'Trainspotting' button

        expect(votedWith).to.equal('Trainspotting');
    });

    it('disables buttons when user has voted', () => {
      const component = renderIntoDocument(
        <Voting pair={["Trainspotting", "28 Days Later"]}
                hasVoted="Trainspotting" />
      );
      const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

      expect(buttons.length).to.equal(2);
      expect(buttons[0].hasAttribute('disabled')).to.equal(true);
      expect(buttons[1].hasAttribute('disabled')).to.equal(true);
    });

    it('adds label to the voted entry', () => {
      const component = renderIntoDocument(
        <Voting pair={["Trainspotting", "28 Days Later"]}
                hasVoted="Trainspotting" />
      );
      const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

      expect(buttons[0].textContent).to.contain('Voted');
    });

    it('renders just the winner when there is one', () => {
      const component = renderIntoDocument(
        <Voting winner="Trainspotting" />
      );
      const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
      expect(buttons.length).to.equal(0);

      const winner = ReactDOM.findDOMNode(component.refs.winner);
      expect(winner).to.be.ok;
      expect(winner.textContent).to.contain('Trainspotting');
    });

    /*
     * The component should not be rerendered if the component
     * is 'pure'
     */
    it('renders as a pure component', () => {
      const pair = ['Trainspotting', '28 Days Later'];
      const component = renderIntoDocument(
        <Voting pair={pair} />
      );

      let firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
      expect(firstButton.textContent).to.equal('Trainspotting');

      pair[0] = 'Sunshine';
      component.setProps({pair: pair});
      firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
      expect(firstButton.textContent).to.equal('Trainspotting');
    });

    /*
     * We should have to explicitly set a new immutable list in
     * the props to have the change reflected in the UI:
     */
    it('does update DOM when prop changes', () => {
        const pair = List.of('Trainspotting', '28 Days Later');
        const component = renderIntoDocument(
          <Voting pair={pair} />
        );

        let firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
        expect(firstButton.textContent).to.equal('Trainspotting');

        // explicitly set new immutable list in props
        const newPair = pair.set(0, 'Sunshine');

        component.setProps({pair: newPair});
        firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
        expect(firstButton.textContent).to.equal('Sunshine');
    });

});
