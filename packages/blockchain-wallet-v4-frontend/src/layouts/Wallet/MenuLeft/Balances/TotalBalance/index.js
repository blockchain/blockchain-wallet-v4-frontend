import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { SkeletonRectangle, Text } from 'blockchain-info-components'
import styled from 'styled-components'

import { getTotalBalance } from 'components/Balances/total/selectors'

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`

const SuccessWrapper = styled.div`
  text-align: right;
  color: ${props => props.theme.grey700};
  font-size: ${props => (props.large ? '20px' : '12px')};
  font-weight: ${props => (props.large ? '200' : '300')};
  padding-right: ${props => (props.large ? '15px' : '25px')};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  span {
    text-transform: capitalize;
    &:last-child {
      margin-left: 10px;
      color: ${props => props.theme['grey400']};
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
      Failure: e => (
        <ErrorWrapper>
          <Text size='14px' weight={600} color='red600'>
            Error Fetching Balance
          </Text>
        </ErrorWrapper>
      ),
      Loading: () => (
        <SkeletonRectangle width='120px' height='25px' bgColorgrey000 />
      ),
      NotAsked: () => (
        <SkeletonRectangle width='120px' height='25px' bgColorgrey000 />
      )
    })
  }
}

const mapStateToProps = state => ({
  data: getTotalBalance(state)
})

export default connect(mapStateToProps)(TotalBalance)
