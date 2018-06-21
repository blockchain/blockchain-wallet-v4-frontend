import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Banner, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding-left: 5px;
  margin-bottom: 10px;
  padding-right: ${props => props.large ? '15px' : '25px'};
  > div:last-child {
    margin-left: 10px;
    > div {
      color: ${props => props.theme['gray-3']}
    }
  }
`

const Success = props => {
  return props.balance === 0 ? < div /> : (
    <LinkContainer to='/bch/transactions'>
      <Wrapper>
        <Text size='10px' weight={300}>BCH</Text>
        <Banner inline type='informational'>
          <FiatDisplay coin='BCH' cursor='pointer' size='10px' weight={300}>{props.balance}</FiatDisplay>
          <span>&nbsp;</span>
          <Text size='10px' weight={300}>
            <FormattedMessage id='scenes.wallet.menutop.balance.watchonlybchbalance' defaultMessage='Non-Spendable' />
          </Text>
        </Banner>
      </Wrapper>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
