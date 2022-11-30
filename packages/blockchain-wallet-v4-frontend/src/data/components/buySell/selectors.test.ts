import Remote from '@core/remote'
import { getBuyQuoteMemoizedByOrder } from 'data/components/buySell/selectors'
import { RootState } from 'data/rootReducer'

describe('buySell selectors', () => {
  describe('getBuyQuoteMemoizedByOrder', () => {
    const OLD_QUOTE = Remote.Success({
      quote: {
        quoteId: 'old-quote'
      }
    })
    const OLD_ORDER = Remote.Success({
      id: 'old-order'
    })

    const NEW_QUOTE = Remote.Success({
      quote: {
        quoteId: 'new-quote'
      }
    })
    const NEW_ORDER = Remote.Success({
      id: 'new-order'
    })
    const makeState = (buyQuote: typeof OLD_QUOTE, order: typeof OLD_ORDER) =>
      ({
        components: {
          buySell: {
            buyQuote,
            order
          }
        }
      } as RootState)

    describe('when cache is empty', () => {
      it('should return up to date quote', () => {
        expect(getBuyQuoteMemoizedByOrder(makeState(OLD_QUOTE, OLD_ORDER))).toBe(OLD_QUOTE)
      })
    })

    describe('when quote changed but order is the same', () => {
      it('should return cached quote', () => {
        expect(getBuyQuoteMemoizedByOrder(makeState(NEW_QUOTE, OLD_ORDER))).toBe(OLD_QUOTE)
      })
    })

    describe('when both quote and order changed', () => {
      it('should return new quote', () => {
        expect(getBuyQuoteMemoizedByOrder(makeState(NEW_QUOTE, NEW_ORDER))).toBe(NEW_QUOTE)
      })
    })
  })

  it.todo('other selectors')
})
