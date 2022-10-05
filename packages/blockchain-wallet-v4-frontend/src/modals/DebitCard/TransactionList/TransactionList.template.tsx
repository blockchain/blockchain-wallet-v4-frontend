import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import Flyout from 'components/Flyout'
import FlyoutContainer from 'components/Flyout/Container'
import FlyoutHeader from 'components/Flyout/Header'
import { FlyoutContent } from 'components/Flyout/Layout'

import { DAY_MONTH, TIME_HS12, useDateTimeFormatter } from '../../../hooks/useDateTimeFormatter'
import {
  BoxRowItemSubTitle,
  BoxRowItemTitle,
  BoxRowWithBorder
} from '../../../scenes/DebitCard/CardDashboard/CardDashboard.model'
import { Props } from './TransactionList'

const BoxRowItemTitleRight = styled(BoxRowItemTitle)`
  flex: none;
  align-items: end;
`

const TransactionList = (props: Props) => {
  const { close, detail } = props
  const { fee, merchantName, originalAmount, userTransactionTime } = detail
  const date = useDateTimeFormatter(userTransactionTime, DAY_MONTH)
  const time = useDateTimeFormatter(userTransactionTime, TIME_HS12)

  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      close()
    })
  }

  return (
    <Flyout {...props} isOpen={show} onClose={handleClose}>
      <FlyoutContainer>
        <FlyoutHeader data-e2e='transactionDetailFlyout' mode='back' onClick={handleClose}>
          <FormattedMessage id='modals.transaction_list.title' defaultMessage='All Activity' />
        </FlyoutHeader>
        <FlyoutContent mode='top'>
          <>Activity here</>
        </FlyoutContent>
      </FlyoutContainer>
    </Flyout>
  )
}

export default TransactionList
