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
import { Props } from './TransactionDetail'

const BoxRowItemTitleRight = styled(BoxRowItemTitle)`
  flex: none;
  align-items: end;
`

const TransactionDetail = (props: Props) => {
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
        <FlyoutHeader data-e2e='transactionDetailFlyout' mode='close' onClick={handleClose}>
          <FormattedMessage
            id='modals.transaction_detail.title'
            defaultMessage='Card Transaction'
          />
        </FlyoutHeader>
        <FlyoutContent mode='top'>
          <FiatDisplay
            coin={originalAmount.symbol}
            size='32px'
            mobileSize='32px'
            color='grey800'
            cursor='inherit'
            weight={600}
            data-e2e={`${originalAmount.symbol}FiatBalance`}
            style={{ marginLeft: '50px' }}
          >
            {originalAmount.value}
          </FiatDisplay>
          <BoxRowWithBorder>
            <Text
              size='14px'
              weight={600}
              lineHeight='20px'
              color='grey600'
              style={{ marginTop: '30px' }}
            >
              <FormattedMessage
                id='modals.transaction_detail.sub_title'
                defaultMessage='Transaction Details'
              />
            </Text>
          </BoxRowWithBorder>
          <BoxRowWithBorder>
            <BoxRowItemTitle>
              <FormattedMessage id='modals.transaction_detail.merchant' defaultMessage='Merchant' />
            </BoxRowItemTitle>
            <BoxRowItemTitleRight>{merchantName}</BoxRowItemTitleRight>
          </BoxRowWithBorder>
          <BoxRowWithBorder>
            <BoxRowItemTitle>
              <FormattedMessage id='modals.transaction_detail.date' defaultMessage='Date & Time' />
            </BoxRowItemTitle>
            <BoxRowItemTitleRight>
              {date}
              <BoxRowItemSubTitle>{time}</BoxRowItemSubTitle>
            </BoxRowItemTitleRight>
          </BoxRowWithBorder>
          <BoxRowWithBorder>
            <BoxRowItemTitle>
              <FormattedMessage
                id='modals.transaction_detail.payment_method'
                defaultMessage='Payment Method'
              />
            </BoxRowItemTitle>
            <BoxRowItemTitleRight>{originalAmount.symbol}</BoxRowItemTitleRight>
          </BoxRowWithBorder>
          <BoxRowWithBorder>
            <BoxRowItemTitle>
              <FormattedMessage
                id='modals.transaction_detail.fee'
                defaultMessage='Blockchain.com Fee'
              />
              <BoxRowItemSubTitle>
                <Text size='12px'>
                  <FormattedMessage
                    id='modals.transaction_detail.fee_subtitle'
                    defaultMessage='This Fee price is based on trade size, payment method and asset being purchased on Blockchain.com.'
                  />
                </Text>
              </BoxRowItemSubTitle>
            </BoxRowItemTitle>
            <BoxRowItemTitleRight>
              <FiatDisplay
                coin={originalAmount.symbol}
                size='16px'
                mobileSize='16px'
                color='grey800'
                cursor='inherit'
                weight={600}
              >
                {fee.value}
              </FiatDisplay>
            </BoxRowItemTitleRight>
          </BoxRowWithBorder>
        </FlyoutContent>
      </FlyoutContainer>
    </Flyout>
  )
}

export default TransactionDetail
