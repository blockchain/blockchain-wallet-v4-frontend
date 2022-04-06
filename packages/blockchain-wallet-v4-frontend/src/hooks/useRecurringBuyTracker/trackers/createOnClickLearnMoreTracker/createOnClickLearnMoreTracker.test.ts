import { createOnClickLearnMoreTracker } from './createOnClickLearnMoreTracker'

describe('createOnClickLearnMoreTracker()', () => {
  it('Should dispatch the learnMoreLinkClicked action', () => {
    const dispatch = jest.fn()

    const trackOnClickLearnMore = createOnClickLearnMoreTracker({
      dispatch
    })

    expect(dispatch).not.toHaveBeenCalled()

    trackOnClickLearnMore({
      origin: 'DASHBOARD_PROMO'
    })

    expect(dispatch).toHaveBeenCalledWith({
      payload: 'DASHBOARD_PROMO',
      type: 'recurringBuy/learnMoreLinkClicked'
    })
  })
})
