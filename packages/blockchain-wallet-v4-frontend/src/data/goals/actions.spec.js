import { actions, addInitialModal, defineGoals, deleteGoal, runGoals, saveGoal } from './slice'

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
    expect(actions.deleteGoal(123)).toEqual({
      payload: { id: 123 },
      type: deleteGoal.type
    })
  })

  it('addInitialModal should return proper action', () => {
    expect(actions.addInitialModal('1a', 'initial', {})).toEqual({
      payload: {
        data: {},
        key: '1a',
        name: 'initial'
      },
      type: addInitialModal.type
    })
  })

  it('runGoals should call correct action', () => {
    expect(actions.runGoals()).toEqual({ type: runGoals.toString() })
  })

  it('defineGoals should call correct action', () => {
    expect(actions.defineGoals()).toEqual({ type: defineGoals.toString() })
  })

  it('saveGoal should save goal with random id', () => {
    expect(actions.saveGoal('fakeGoal', {})).toEqual({
      payload: { data: {}, id: '4h96hsvbcj', name: 'fakeGoal' },
      type: saveGoal.type
    })
  })
})
