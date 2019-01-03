import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Wallets from './Wallets'
import Transactions from './Transactions'
import ImportedAddresses from './ImportedAddresses'

const Wrapper = styled.div`
  & > :last-child {
    margin-top: 30px;
  }
`
class BsvContainer extends React.PureComponent {
  componentDidMount () {
    this.props.settings.initializeBsv()
  }

  render () {
    return (
      <Wrapper>
        <Wallets />
        <ImportedAddresses />
        <Transactions />
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  settings: bindActionCreators(actions.components.settings, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(BsvContainer)
