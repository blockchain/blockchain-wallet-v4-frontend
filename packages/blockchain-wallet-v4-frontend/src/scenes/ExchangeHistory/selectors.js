import { contains, curry, filter, isEmpty, lift, or, prop } from 'ramda'
import { selectors, model } from 'data'

const { COMPLETE_STATES, INCOMPLETE_STATES } = model.components.exchangeHistory

/**
 * Statuses for shapeshift
 * States for exchange
 */
const getTradesWithStatus = curry((statuses, states, trades) =>
  filter(
    trade =>
      or(
        contains(prop('status', trade), statuses),
        contains(prop('state', trade), states)
      ),
    trades
  )
)

export const getData = state => {
  const useShapeShift = selectors.components.exchange.useShapeShift(state)
  const tradesR = useShapeShift
    ? selectors.core.kvStore.shapeShift.getTrades(state)
    : selectors.components.exchangeHistory.getTrades(state)
  const completeTradesR = lift(
    getTradesWithStatus(
      ['complete', 'resolved', 'error', 'failed'],
      COMPLETE_STATES
    )
  )(tradesR)
  const incompleteTradesR = lift(
    getTradesWithStatus(['no_deposits', 'received'], INCOMPLETE_STATES)
  )(tradesR)

  const transform = (complete, incomplete) => {
    const showComplete = !isEmpty(complete)
    const showIncomplete = !isEmpty(incomplete)

    return {
      complete,
      showComplete,
      incomplete,
      showIncomplete
    }
  }
  return {
    data: lift(transform)(completeTradesR, incompleteTradesR),
    useShapeShift
  }
}
