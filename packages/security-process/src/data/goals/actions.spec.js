import * as A from './actions'
import * as AT from './actionTypes'

describe('goals actions', () => {
  const mathCopy = Object.create(global.Math)

  beforeAll(() => {
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.1244251629529336
    global.Math = mockMath
  })

  afterAll(() => {
    global.Math = mathCopy
  })

  it('deleteGoal should return proper action', () => {
    expect(A.deleteGoal(123)).toEqual({
      type: AT.DELETE_GOAL,
      payload: { id: 123 }
    })
  })

  it('addInitialModal should return proper action', () => {
    expect(A.addInitialModal('1a', 'initial', {})).toEqual({
      type: AT.ADD_INITIAL_MODAL,
      payload: {
        key: '1a',
        name: 'initial',
        data: {}
      }
    })
  })

  it('runGoals should call correct action', () => {
    expect(A.runGoals()).toEqual({ type: AT.RUN_GOALS })
  })

  it('defineGoals should call correct action', () => {
    expect(A.defineGoals()).toEqual({ type: AT.DEFINE_GOALS })
  })

  it('saveGoal should save goal with random id', () => {
    expect(A.saveGoal('fakeGoal', {})).toEqual({
      type: AT.SAVE_GOAL,
      payload: { id: '4h96hsvbcj', name: 'fakeGoal', data: {} }
    })
  })
})
