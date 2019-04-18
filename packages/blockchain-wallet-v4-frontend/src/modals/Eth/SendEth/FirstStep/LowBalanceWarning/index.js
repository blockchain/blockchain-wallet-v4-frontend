import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { propOr, lt } from 'ramda'
import { formValueSelector } from 'redux-form'

import { Exchange } from 'blockchain-wallet-v4/src'
import { model, selectors } from 'data'
import { Link, Text } from 'blockchain-info-components'
import {
  WarningWrapper,
  WarningLeftColumn,
  WarningRightColumn
} from '../Components'

const LowBalanceWarning = props => {
  const { totalBalance, ethRates, amount } = props
  const totalEthValue = Exchange.convertEtherToFiat({
    value: totalBalance,
    toCurrency: 'USD',
    fromUnit: 'WEI',
    rates: ethRates
  }).value
  const totalSendValue = Exchange.convertEtherToFiat({
    value: propOr(0, 'coin', amount),
    toCurrency: 'USD',
    fromUnit: 'ETH',
    rates: ethRates
  }).value

  return (
    lt(totalEthValue - totalSendValue, 1) && (
      <WarningWrapper>
        <WarningLeftColumn>
          <Text size='14px' weight={400} color='orange'>
            <FormattedMessage
              id='modals.sendeth.lowbalancewarning.title'
              defaultMessage='Running low!'
            />
          </Text>
          <Text size='13px' weight={300}>
            <FormattedMessage
              id='modals.sendeth.lowbalancewarning.explain'
              defaultMessage="You'll need ETH to send your ERC20 Token, USD Pax."
            />
          </Text>
        </WarningLeftColumn>
        <WarningRightColumn>
          <Link
            size='13px'
            weight={400}
            href='https://support.blockchain.com'
            target='_blank'
          >
            <FormattedMessage
              id='modals.sendeth.lowbalancewarning.learn'
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
