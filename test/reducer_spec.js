import {Map, fromJS} from 'immutable'
import {expect} from 'chai'

import reducer from '../src/reducer'

describe('#reducer', () => {
  it('has an undefined state', () => {
    const action = {type: 'SET_ENTRIES', entries: ['film', 'flam', 'Jim']}

    const nextState = reducer(undefined, action)

    expect(nextState).to.equal(fromJS({
      entries: ['film', 'flam', 'Jim']
    }))
  })

  it('handles SET_ENTRIES', () => {
    const initialState = Map()
    const action = {type: 'SET_ENTRIES', entries: ['film', 'flam', 'Jim']}

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      'entries': ['film', 'flam', 'Jim']
    }))
  })

  it('handles NEXT', () => {
    const initialState = fromJS({
      'entries': ['flim', 'flam']
    })
    const action = {type: 'NEXT'}

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      'vote': {'pair': ['flim', 'flam']},
      'entries': []
    }))
  })

  it('handles VOTE', () => {
    const initialState = fromJS({
      'vote': {
        'pair': ['flim', 'flam']
      },
      'entries': []
    })
    const action = {type: 'VOTE', movie: 'flim'}

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      'vote': {
        'pair': ['flim', 'flam'],
        'tally': {'flim': 1}
      },
      'entries': []

    }))
  })
})
