import * as selectors from './selectors'

describe('goals selectors', () => {
  const mockState = {
    goals: {
      goals: { name: 'referral' },
      initialModals: { key: '123' }
    }
  }

  it('getGoals should return goals', () => {
    expect(selectors.getGoals(mockState)).toEqual(mockState.goals.goals)
  })

  it('getInitialModals should return modal', () => {
    expect(selectors.getInitialModals(mockState)).toEqual(
      mockState.goals.initialModals
    )
  })
})
