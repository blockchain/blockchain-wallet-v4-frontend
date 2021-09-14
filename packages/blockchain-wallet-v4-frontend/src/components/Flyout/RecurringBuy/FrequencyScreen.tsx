import React, { Children, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'
import { SBPaymentTypes } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'

import {
  RecurringBuyNextPayment,
  RecurringBuyPeriods
} from '../../../data/components/recurringBuy/types'
import { OptionRightActionRow, OptionRightActionRowProps } from '../../Rows'
import Container from '../Container'
import Content from '../Content'
import Header, { Props as HeaderProps } from '../Header'
import { getPeriodSubTitleText, getPeriodTitleText } from '../model'

const RowDisplay = ({ method, paymentInfo, period, setPeriod }: RowDisplayProps) => {
  // The ONE_TIME option is not given to us from the API like other period option. It is a special
  // it's used by the FE only when the user is making a purchase, but not as a recurring buy. It's added
  // here manually so the FE code can treat it like the other period options.
  const date = new Date()
  const modifiedPaymentInfo: RecurringBuyNextPayment[] = [
    {
      eligibleMethods: Object.values(SBPaymentTypes),
      nextPayment: date.toString(),
      period: RecurringBuyPeriods.ONE_TIME
    },
    ...paymentInfo
  ]

  const currentPaymentPeriod: RecurringBuyNextPayment | undefined = modifiedPaymentInfo.filter(
    (pi) => pi.period === period
  )[0]

  const eligibleMethod: boolean =
    (currentPaymentPeriod && currentPaymentPeriod.eligibleMethods.includes(method)) || false

  const setPeriodCallback = useCallback(
    (period: RecurringBuyPeriods) => {
      return () => {
        if (eligibleMethod) {
          setPeriod(period)
        }
      }
    },
    [setPeriod, eligibleMethod]
  )

  const rowProps: OptionRightActionRowProps = {
    children: (
      <>
        <Text weight={600} size='16px' color='grey900'>
          {getPeriodTitleText(period)}
        </Text>
        <Text weight={500} size='14px' color='grey600'>
          {getPeriodSubTitleText(period, currentPaymentPeriod?.nextPayment)}
        </Text>
      </>
    ),
    disabled: !eligibleMethod,
    onClick: setPeriodCallback(period)
  }

  if (!eligibleMethod) {
    rowProps.toolTip = (
      <FormattedMessage
        id='modals.recurringbuys.frequency_disabled'
        defaultMessage='{period} recurring buys are unavailable for your payment method at this time.'
        values={{ period: getPeriodTitleText(period) }}
      />
    )
  }

  return <OptionRightActionRow {...rowProps} />
}

const FrequencyScreen = ({
  children,
  headerAction,
  headerMode,
  method,
  paymentInfo,
  setPeriod
}: Props) => {
  const periods = Object.values(RecurringBuyPeriods)

  return (
    <Container>
      <Header
        data-e2e='closeRecurringBuyModalFrequencyStep'
        mode={headerMode}
        onClick={headerAction}
      >
        {children ? (
          <>{children}</>
        ) : (
          <FormattedMessage
            id='modals.recurringbuys.select_a_frequency'
            defaultMessage='Select a Frequency'
          />
        )}
      </Header>
      <Content mode='top'>
        {periods.map((period) => (
          <RowDisplay key={period} {...{ method, paymentInfo, period, setPeriod }} />
        ))}
      </Content>
    </Container>
  )
}
type RowDisplayProps = {
  method: Props['method']
  paymentInfo: Props['paymentInfo']
  period: RecurringBuyPeriods
  setPeriod: Props['setPeriod']
}

type Props = {
  children?: React.ReactNode
  headerAction: HeaderProps['onClick']
  headerMode: HeaderProps['mode']
  method: SBPaymentTypes
  paymentInfo: RecurringBuyNextPayment[]
  setPeriod: (period: RecurringBuyPeriods) => void
}

export default FrequencyScreen
