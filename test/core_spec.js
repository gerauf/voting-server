import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  describe('#setEntries', () => {
    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 Days Later')

      const nextState = setEntries(state, entries)

      expect(nextState).to.equal(
        fromJS({'entries': ['Trainspotting', '28 Days Later']})
      )
    });

    it('converts to immutable', () => {
      const state = Map()
      const entries = ['Trainspotting', '28 Days Later']

      const nextState = setEntries(state, entries)

      expect(nextState).to.equal(
        fromJS({'entries': ['Trainspotting', '28 Days Later']})
      );
    });
  });

  describe('#next', () => {
    it('takes the next two entries under vote', () => {
      const state = Map({
        'entries': List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });

      const nextState = next(state)

      expect(nextState).to.equal(
        fromJS({
          'vote': {'pair': ['Trainspotting', '28 Days Later']},
          'entries': ['Sunshine']
        })
      );
    });

    it('puts winner of current vote back into entries', () => {
      const state = fromJS({
        'vote': {
          'pair': ['Trainspotting', '28 Days Later'],
          'tally': { 'Trainspotting': 4, '28 Days Later': 2 }
        },
        'entries': ['Sunshine', 'Millions', '127 Hours']
      })
      const nextState = next(state)

      expect(nextState).to.equal(fromJS({
        'vote': {
          'pair': ['Sunshine', 'Millions'],
        },
        'entries': ['127 Hours', 'Trainspotting']
      }));
    });

    it('puts both from tied vote back into entries', () => {
      const state = fromJS({
        'vote': {
          'pair': ['Trainspotting', '28 Days Later'],
          'tally': { 'Trainspotting': 4, '28 Days Later': 4 }
        },
        'entries': ['Sunshine', 'Millions', '127 Hours']
      })
      const nextState = next(state)

      expect(nextState).to.equal(fromJS({
        'vote': {
          'pair': ['Sunshine', 'Millions'],
        },
        'entries': ['127 Hours', 'Trainspotting', '28 Days Later']
      }));
    });

    it('marks as winner the final entry', () => {
      const state = fromJS({
        'vote': {
          'pair': ['Trainspotting', '28 Days Later'],
          'tally': { 'Trainspotting': 4, '28 Days Later': 3 }
        },
        'entries': []
      })

      const nextState = next(state)

      expect(nextState).to.equal(fromJS({
        'winner': 'Trainspotting'
      }))
    })
  });

  describe('#vote', () => {
    it('creates a tally for the voted entry', () => {
      const state = Map({
        'vote': Map({
          'pair': List.of('Trainspotting', '28 Days Later')
        }),
        'entries': List()
      });

      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(Map({
        'vote': Map({
          'pair': List.of('Trainspotting', '28 Days Later'),
          'tally': Map({
            'Trainspotting': 1
          })
        }),
        'entries': List()
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        'vote': Map({
          'pair': List.of('Trainspotting', '28 Days Later'),
          'tally': Map({
            'Trainspotting': 1,
            '28 Days Later': 2
          })
        }),
        'entries': List()
      });

      const nextState = vote(state,'Trainspotting')

      expect(nextState).to.equal(Map({
        'vote': Map({
          'pair': List.of('Trainspotting', '28 Days Later'),
          'tally': Map({
            'Trainspotting': 2,
            '28 Days Later': 2
          })
        }),
        'entries': List()
      }))

    })
  });
});
