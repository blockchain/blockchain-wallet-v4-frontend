import React from 'react'
import PropTypes from 'prop-types'
import FiatDisplay from 'components/Display/FiatDisplay'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Banner, Text } from 'blockchain-info-components'
import { CoinBalanceWrapper } from 'components/Balances'

const Success = props => {
  return props.balance === 0 ? null : (
    <LinkContainer to='/btc/transactions'>
      <CoinBalanceWrapper>
        <Text size='10px' weight={300}>
          BTC
        </Text>
        <Banner inline type='informational'>
          <FiatDisplay coin='BTC' cursor='pointer' size='10px' weight={300}>
            {props.balance}
          </FiatDisplay>
          <span>&nbsp;</span>
          <Text size='10px' weight={300}>
            <FormattedMessage
              id='scenes.wallet.menutop.balance.watchonlybtcbalance'
              defaultMessage='Non-Spendable'
            />
          </Text>
        </Banner>
      </CoinBalanceWrapper>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
