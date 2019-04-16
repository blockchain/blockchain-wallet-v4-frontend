import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { propOr, lt } from 'ramda'
import { formValueSelector } from 'redux-form'

import { Exchange } from 'blockchain-wallet-v4/src'
import { model, selectors } from 'data'
import { Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: -6px;
  margin-bottom: 20px;
`
const LeftColumn = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  flex-basis: 75%;
`
const RightColumn = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-basis: 25%;
`

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
      <Wrapper>
        <LeftColumn>
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
        </LeftColumn>
        <RightColumn>
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
        </RightColumn>
      </Wrapper>
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
