import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { SkeletonRectangle, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { getTotalBalance } from 'components/Balances/total/selectors'
import { selectors } from 'data'

const ErrorWrapper = styled(TooltipHost)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

const SuccessWrapper = styled.div`
  text-align: right;
  color: ${(props) => props.theme.grey700};
  font-size: ${(props) => (props.large ? '20px' : '12px')};
  font-weight: ${(props) => (props.large ? '200' : '300')};
  padding-right: ${(props) => (props.large ? '15px' : '25px')};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  span {
    text-transform: capitalize;
    &:last-child {
      margin-left: 10px;
      color: ${(props) => props.theme.grey400};
    }
  }
`
class TotalBalance extends React.PureComponent {
  render() {
    return this.props.data.cata({
      Failure: () => (
        <ErrorWrapper id='tooltip.rates_error'>
          <Text weight={700} size='24px' color='grey200'>
            {Currencies[this.props.userCurrency].units[this.props.userCurrency].symbol}--
          </Text>
          <TooltipIcon name='question-in-circle-filled' />
        </ErrorWrapper>
      ),
      Loading: () => <SkeletonRectangle width='120px' height='25px' bgColorgrey000 />,
      NotAsked: () => <SkeletonRectangle width='120px' height='25px' bgColorgrey000 />,
      Success: (val) => (
        <>
          {this.props.large ? (
            <SuccessWrapper large data-e2e='topBalanceTotal'>
              {val.totalBalance}
            </SuccessWrapper>
          ) : (
            <LinkContainer to='/home'>
              <SuccessWrapper>
                <FormattedMessage
                  id='scenes.wallet.menutop.balance.totalbalance.total'
                  defaultMessage='Total Balance'
                />{' '}
                {val.totalBalance}
              </SuccessWrapper>
            </LinkContainer>
          )}
        </>
      )
    })
  }
}

const mapStateToProps = (state) => ({
  data: getTotalBalance(state),
  userCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

export default connect(mapStateToProps)(TotalBalance)
