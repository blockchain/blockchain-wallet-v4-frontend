import * as selectors from './selectors'

describe('goals selectors', () => {
  // no need to mock entire root state
  const mockState: any = {
    goals: {
      goals: [{ data: {}, id: '123', name: 'referral' }],
      initialModals: { key: '123' }
    }
  }

  it('getGoals should return goals', () => {
    expect(selectors.getGoals(mockState)).toEqual(mockState.goals.goals)
  })

  it('getInitialModals should return modal', () => {
    expect(selectors.getInitialModals(mockState)).toEqual(mockState.goals.initialModals)
  })
})
