import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'

import { FlyoutContainer, FlyoutContent, FlyoutHeader, OptionRightActionRow, Text } from '..'
import { Props as HeaderProps } from './Header'
import { getPeriodSubTitleText, getPeriodTitleText } from './model'
import { RecurringBuyPeriods } from './types'

const FrequencyScreen = ({ children, headerAction, headerMode, setPeriod }: Props) => {
  // ONE_TIME is not a recurring buy option so take it out before displaying
  const periods = Object.values(RecurringBuyPeriods).filter(
    (p) => p !== RecurringBuyPeriods.ONE_TIME
  )
  const setPeriodCallback = useCallback(
    (period: RecurringBuyPeriods) => {
      return () => {
        setPeriod(period)
      }
    },
    [setPeriod]
  )
  return (
    <FlyoutContainer>
      <FlyoutHeader
        data-e2e='closeRecurringBuyModalFrequencyStep'
        mode={headerMode}
        onClick={headerAction}
      >
        {children ? (
          { children }
        ) : (
          <FormattedMessage
            id='modals.recurringbuys.select_a_frequency'
            defaultMessage='Select a Frequency'
          />
        )}
      </FlyoutHeader>
      <FlyoutContent mode='top'>
        {periods.map((period) => (
          <OptionRightActionRow key={period} onClick={setPeriodCallback(period)}>
            <>
              <Text weight={600} size='16px' color='grey900'>
                {getPeriodTitleText(period)}
              </Text>
              <Text weight={500} size='14px' color='grey600'>
                {getPeriodSubTitleText(period)}
              </Text>
            </>
          </OptionRightActionRow>
        ))}
      </FlyoutContent>
    </FlyoutContainer>
  )
}

type Props = {
  children?: React.ReactNode
  headerAction: HeaderProps['onClick']
  headerMode: HeaderProps['mode']
  setPeriod: (period: RecurringBuyPeriods) => void
}

export default FrequencyScreen
