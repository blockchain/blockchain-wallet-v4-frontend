import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { formValueSelector } from 'redux-form'
import { lt, propOr } from 'ramda'
import React from 'react'

import { Exchange } from 'blockchain-wallet-v4/src'
import { Link, Text } from 'blockchain-info-components'
import { model, selectors } from 'data'
import {
  WarningLeftColumn,
  WarningRightColumn,
  WarningWrapper
} from '../Components'

const LowBalanceWarning = props => {
  const { totalBalance, ethRates, amount } = props
  const totalEthValue = Exchange.convertEthToFiat({
    value: totalBalance,
    toCurrency: 'USD',
    fromUnit: 'WEI',
    rates: ethRates
  }).value
  const totalSendValue = Exchange.convertEthToFiat({
    value: propOr(0, 'coin', amount),
    toCurrency: 'USD',
    fromUnit: 'ETH',
    rates: ethRates
  }).value

  return (
    lt(totalEthValue - totalSendValue, 1) && (
      <WarningWrapper>
        <WarningLeftColumn>
          <Text
            size='14px'
            weight={500}
            color='orange600'
            data-e2e='runningLowMessage'
          >
            <FormattedMessage
              id='modals.sendeth.lowbalancewarning.title'
              defaultMessage='Running low!'
            />
          </Text>
          <Text size='13px' weight={400}>
            <FormattedMessage
              id='modals.sendeth.lowbalancewarning.explain1'
              defaultMessage="You'll need ETH to send your ERC20 Token, USD Digital."
            />
          </Text>
        </WarningLeftColumn>
        <WarningRightColumn>
          <Link
            size='13px'
            weight={500}
            href='https://support.blockchain.com/hc/en-us/sections/360004368351-USD-Pax-FAQ'
            target='_blank'
          >
            <FormattedMessage
              id='buttons.learn_more'
              defaultMessage='Learn More'
            />
          </Link>
        </WarningRightColumn>
      </WarningWrapper>
    )
  )
}

const mapStateToProps = state => ({
  amount: formValueSelector(model.components.sendEth.FORM)(state, 'amount'),
  ethRates: selectors.core.data.eth.getRates(state).getOrFail()
})

export default connect(
  mapStateToProps,
  null
)(LowBalanceWarning)
