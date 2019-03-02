import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Wallets from './Wallets'
import Transactions from './Transactions'
import ImportedAddresses from './ImportedAddresses'
import { getAreThereBsvTransactions } from './selectors'

const Wrapper = styled.div`
  & > :last-child {
    margin-top: 30px;
  }
`
class BsvContainer extends React.PureComponent {
  componentDidMount () {
    this.props.settings.initializeBsv()
    this.props.txActions.initialized()
  }

  render () {
    const { areThereBsvTransactions } = this.props
    return (
      <Wrapper>
        <Wallets />
        <ImportedAddresses />
        {areThereBsvTransactions && <Transactions />}
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  areThereBsvTransactions: getAreThereBsvTransactions(state)
})

const mapDispatchToProps = dispatch => ({
  settings: bindActionCreators(actions.components.settings, dispatch),
  txActions: bindActionCreators(actions.components.bsvTransactions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BsvContainer)
