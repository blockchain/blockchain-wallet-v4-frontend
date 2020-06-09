import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import { Link } from 'blockchain-info-components'

import { CoinBalanceWrapper, LoadingBalance } from '../../model'
import { getBchWatchOnlyBalance } from '../selectors'

const ErrorWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
`
const ErrorLink = styled(Link)`
  text-decoration: underline;
`

class BchWatchOnlyBalance extends React.PureComponent {
  handleRefresh = () => {
    this.props.actions.fetchData()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: balance => (
        <LinkContainer to='/bch/transactions'>
          <div>
            <CoinBalanceWrapper coin='BCH' balance={balance} />
          </div>
        </LinkContainer>
      ),
      Failure: () => (
        <ErrorWrapper>
          <ErrorLink size='12px' weight={400} onClick={this.handleRefresh}>
            <FormattedMessage
              id='wallet.menutop.watchonly.bchbalance.refresh'
              defaultMessage='Refresh {curr} data'
              values={{ curr: 'Watch Only Bitcoin Cash' }}
            />
          </ErrorLink>
        </ErrorWrapper>
      ),
      Loading: () => <LoadingBalance coin='BCH' />,
      NotAsked: () => <LoadingBalance coin='BCH' />
    })
  }
}

const mapStateToProps = state => ({
  data: getBchWatchOnlyBalance(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.bch, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BchWatchOnlyBalance)
