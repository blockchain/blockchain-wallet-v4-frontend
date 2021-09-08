import { actions } from './slice'

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
    expect(actions.deleteGoal('123')).toEqual({
      payload: '123',
      type: actions.deleteGoal.type
    })
  })

  it('addInitialModal should return proper action', () => {
    expect(
      actions.addInitialModal({
        data: { origin: 'AirdropClaimGoal' },
        key: '1a',
        name: 'ADD_BANK_YAPILY_MODAL'
      })
    ).toEqual({
      payload: {
        data: {
          origin: 'AirdropClaimGoal'
        },
        key: '1a',
        name: 'ADD_BANK_YAPILY_MODAL'
      },
      type: actions.addInitialModal.type
    })
  })

  it('runGoals should call correct action', () => {
    expect(actions.runGoals()).toEqual({ type: actions.runGoals.type })
  })

  it('defineGoals should call correct action', () => {
    expect(actions.defineGoals()).toEqual({ type: actions.defineGoals.type })
  })

  it('saveGoal should save goal with random id', () => {
    expect(actions.saveGoal({ data: {}, name: 'kyc' })).toEqual({
      payload: { data: {}, name: 'kyc' },
      type: actions.saveGoal.type
    })
  })
})
