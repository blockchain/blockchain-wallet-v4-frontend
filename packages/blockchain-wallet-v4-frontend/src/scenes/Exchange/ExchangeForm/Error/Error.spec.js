import React from 'react'
import { shallow } from 'enzyme'

import { model, selectors } from 'data'
import { Error } from './Error'
import {
  NoLimitsMessage,
  MinimumNoLinkMessage,
  ReachedDailyLimitMessage,
  ReachedWeeklyLimitMessage,
  ReachedAnnualLimitMessage,
  MinimumAmountMessage,
  MaximumAmountMessage,
  BalanceLimitMessage,
  DailyLimitMessage,
  WeeklyLimitMessage,
  AnnualLimitMessage,
  OrderLimitMessage,
  LatestTxMessage,
  LatestTxFetchFailedMessage,
  CreateTargetXlmAccountMessage,
  NoSourceXlmAccountMessage,
  ReserveOverflowMessage,
  NoAdviceMessage
} from './validationMessages'
import { formatAmount } from '../services'

const {
  NO_LIMITS_ERROR,
  NO_VALUE_ERROR,
  MINIMUM_NO_LINK_ERROR,
  REACHED_DAILY_ERROR,
  REACHED_WEEKLY_ERROR,
  REACHED_ANNUAL_ERROR,
  MINIMUM_ERROR,
  BALANCE_ERROR,
  DAILY_ERROR,
  WEEKLY_ERROR,
  ANNUAL_ERROR,
  LATEST_TX_ERROR,
  LATEST_TX_FETCH_FAILED_ERROR,
  ORDER_ERROR,
  CREATE_ACCOUNT_ERROR,
  NO_ACCOUNT_ERROR,
  RESERVE_ERROR
} = model.components.exchange
const { MIN_ERROR: MIN_RATES_ERROR, MAX_ERROR: MAX_RATES_ERROR } = model.rates

const errorMessages = [
  {
    message: NO_LIMITS_ERROR,
    component: NoLimitsMessage,
    componentName: 'NoLimitsMessage'
  },
  {
    message: MINIMUM_NO_LINK_ERROR,
    component: MinimumNoLinkMessage,
    componentName: 'MinimumNoLinkMessage'
  },
  {
    message: REACHED_DAILY_ERROR,
    component: ReachedDailyLimitMessage,
    componentName: 'ReachedDailyLimitMessage'
  },
  {
    message: REACHED_WEEKLY_ERROR,
    component: ReachedWeeklyLimitMessage,
    componentName: 'ReachedWeeklyLimitMessage'
  },
  {
    message: REACHED_ANNUAL_ERROR,
    component: ReachedAnnualLimitMessage,
    componentName: 'ReachedAnnualLimitMessage'
  },
  {
    message: MINIMUM_ERROR,
    component: MinimumAmountMessage,
    componentName: 'MinimumAmountMessage'
  },
  {
    message: MIN_RATES_ERROR,
    component: MinimumAmountMessage,
    componentName: 'MinimumAmountMessage'
  },
  {
    message: MAX_RATES_ERROR,
    component: MaximumAmountMessage,
    componentName: 'MaximumAmountMessage'
  },
  {
    message: BALANCE_ERROR,
    component: BalanceLimitMessage,
    componentName: 'BalanceLimitMessage'
  },
  {
    message: DAILY_ERROR,
    component: DailyLimitMessage,
    componentName: 'DailyLimitMessage'
  },
  {
    message: WEEKLY_ERROR,
    component: WeeklyLimitMessage,
    componentName: 'WeeklyLimitMessage'
  },
  {
    message: ANNUAL_ERROR,
    component: AnnualLimitMessage,
    componentName: 'AnnualLimitMessage'
  },
  {
    message: ORDER_ERROR,
    component: OrderLimitMessage,
    componentName: 'OrderLimitMessage'
  },
  {
    message: LATEST_TX_ERROR,
    component: LatestTxMessage,
    componentName: 'LatestTxMessage'
  },
  {
    message: LATEST_TX_FETCH_FAILED_ERROR,
    component: LatestTxFetchFailedMessage,
    componentName: 'LatestTxFetchFailedMessage'
  },
  {
    message: CREATE_ACCOUNT_ERROR,
    component: CreateTargetXlmAccountMessage,
    componentName: 'CreateTargetXlmAccountMessage'
  },
  {
    message: NO_ACCOUNT_ERROR,
    component: NoSourceXlmAccountMessage,
    componentName: 'NoSourceXlmAccountMessage'
  },
  {
    message: RESERVE_ERROR,
    component: ReserveOverflowMessage,
    componentName: 'ReserveOverflowMessage'
  }
]

jest.spyOn(selectors.components.exchange, 'getTxError').mockReturnValue(null)
jest.spyOn(selectors.components.exchange, 'showError').mockReturnValue(null)

jest.mock('../services')

describe('Exchange Error', () => {
  it('should not show error if showError and txError is falsy', () => {
    const wrapper = shallow(
      <Error error={new Error('')} txError={null} showError={false} />
    )
    expect(wrapper.find('Error__ErrorRow').children()).toHaveLength(0)
  })

  it('should not show error if error and txError is null', () => {
    const wrapper = shallow(
      <Error error={null} txError={null} showError={true} />
    )
    expect(wrapper.find('Error__ErrorRow').children()).toHaveLength(0)
  })

  it(`should show ReserveOverflowMessage if txError is set to ${RESERVE_ERROR}`, () => {
    const wrapper = shallow(<Error txError={RESERVE_ERROR} />)
    expect(wrapper.find(ReserveOverflowMessage)).toHaveLength(1)
  })

  it(`should not show error if error is set to ${NO_VALUE_ERROR}`, () => {
    const wrapper = shallow(<Error error={NO_VALUE_ERROR} showError={true} />)
    expect(
      wrapper
        .find('Error__ErrorRow')
        .children()
        .first()
        .text()
    ).toBe('< />')
  })

  it(`should show NoAdviceMessage if error is unknown`, () => {
    const wrapper = shallow(
      <Error error={NO_VALUE_ERROR + 'unknown'} showError={true} />
    )
    expect(wrapper.find(NoAdviceMessage)).toHaveLength(1)
  })

  it('should pass min to MinimumNoLinkMessage', () => {
    const fiat = true
    const symbol = 'USD'
    const amount = 1000
    const min = { fiat, symbol, amount }
    const wrapper = shallow(
      <Error error={MINIMUM_NO_LINK_ERROR} min={min} showError={true} />
    )
    expect(wrapper.find(MinimumNoLinkMessage).prop('min')).toEqual(min)
    wrapper.find(MinimumNoLinkMessage).dive()
    expect(formatAmount).toHaveBeenCalledWith(fiat, symbol, amount)
  })

  errorMessages.forEach(({ message, component, componentName }) => {
    it(`should show ${componentName} if error is set to ${message}`, () => {
      const wrapper = shallow(<Error error={message} showError={true} />)
      expect(wrapper.find(component)).toHaveLength(1)
    })
  })
})
