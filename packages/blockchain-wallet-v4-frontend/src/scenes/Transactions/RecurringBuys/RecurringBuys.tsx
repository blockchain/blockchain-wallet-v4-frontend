import React from 'react'
import { useDispatch } from 'react-redux'

import { Exchange } from '@core'
import { CoinType } from '@core/types'
import { SavedRecurringBuy } from 'components/Box'
import { actions, selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  ActionEnum,
  RecurringBuyOrigins,
  RecurringBuyPeriods,
  RecurringBuyStepType
} from 'data/types'
import { useRemote } from 'hooks'

const RecurringBuys = ({ coin }: { coin: CoinType }) => {
  const dispatch = useDispatch()
  const {
    data: recurringBuys,
    error,
    isLoading,
    isNotAsked
  } = useRemote(selectors.components.recurringBuy.getRegisteredList)

  if (isLoading || isNotAsked) return <SavedRecurringBuy loading />
  if (!recurringBuys?.length || error) return null
  const recurringBuysByCoin = recurringBuys.filter((rb) => rb.destinationCurrency === coin)

  return (
    <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between' }}>
      {recurringBuysByCoin.map((recurringBuy) => (
        <SavedRecurringBuy
          key={recurringBuy.id}
          action={ActionEnum.BUY}
          amount={`${Exchange.getSymbol(recurringBuy.inputCurrency)}${convertBaseToStandard(
            recurringBuy.inputCurrency,
            recurringBuy.inputValue
          )}`}
          coin={recurringBuy.destinationCurrency}
          nextPayment={recurringBuy.nextPayment}
          onClick={() => {
            dispatch(actions.components.recurringBuy.setActive(recurringBuy))
            dispatch(
              actions.components.recurringBuy.showModal({
                origin: RecurringBuyOrigins.COIN_PAGE
              })
            )
            dispatch(
              actions.components.recurringBuy.setStep({
                origin: RecurringBuyOrigins.COIN_PAGE,
                step: RecurringBuyStepType.DETAILS
              })
            )
          }}
          period={recurringBuy.period as RecurringBuyPeriods}
        />
      ))}
    </div>
  )
}

export default RecurringBuys
