import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'
import styled from 'styled-components'

import { getTotalBalance } from 'components/Balances/total/selectors'
import { SkeletonRectangle, Text } from 'blockchain-info-components'

const BalanceSkeleton = styled.div`
  > div:first-child {
    margin-bottom: 5px;
  }
`

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
`

const SuccessWrapper = styled.div`
  text-align: right;
  color: ${props => props.theme['gray-5']};
  font-size: ${props => (props.large ? '20px' : '12px')};
  font-weight: ${props => (props.large ? '200' : '300')};
  padding-right: ${props => (props.large ? '15px' : '25px')};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  span {
    text-transform: capitalize;
    &:last-child {
      margin-left: 10px;
      color: ${props => props.theme['gray-3']};
    }
  }
`
class TotalBalance extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: val => (
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
      ),
      Failure: error => (
        <ErrorWrapper>
          <Text size='12px' weight={400} color='red600'>
            {error}
          </Text>
        </ErrorWrapper>
      ),
      Loading: () => (
        <BalanceSkeleton>
          <SkeletonRectangle width='120px' height='26px' bgColor='gray-1' />
        </BalanceSkeleton>
      ),
      NotAsked: () => (
        <BalanceSkeleton>
          <SkeletonRectangle width='120px' height='26px' bgColor='gray-1' />
        </BalanceSkeleton>
      )
    })
  }
}

const mapStateToProps = state => ({
  data: getTotalBalance(state)
})

export default connect(mapStateToProps)(TotalBalance)
