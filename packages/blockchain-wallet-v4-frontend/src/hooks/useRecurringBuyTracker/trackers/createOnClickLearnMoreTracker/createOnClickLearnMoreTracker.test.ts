import { createOnClickLearnMoreTracker } from './createOnClickLearnMoreTracker'

jest.mock('react-redux', () => {
  const dispatch = jest.fn()
  const originalModule = jest.requireActual('react-redux')

  return {
    ...originalModule,
    useDispatch: jest.fn(() => dispatch)
  }
})

describe('createOnClickLearnMoreTracker()', () => {
  it('Should dispatch the learnMoreLinkClicked action', () => {
    const dispatch = jest.fn()

    const trackOnClickLearnMore = createOnClickLearnMoreTracker({
      dispatch
    })

    expect(dispatch).not.toHaveBeenCalled()

    trackOnClickLearnMore()

    expect(dispatch).toHaveBeenCalledWith({
      payload: 'DASHBOARD_PROMO',
      type: 'recurringBuy/learnMoreLinkClicked'
    })
  })
})
