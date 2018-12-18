import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Wallets from './Wallets'
import Transactions from './Transactions'

const Wrapper = styled.div`
  & > :last-child {
    margin-top: 30px;
  }
`
class BsvContainer extends React.PureComponent {
  componentDidMount () {
    this.props.bsvKvStore.fetchMetadataBsv()
    this.props.bsv.fetchData()
  }

  render () {
    return (
      <Wrapper>
        <Wallets />
        <Transactions />
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  bsvKvStore: bindActionCreators(actions.core.kvStore.bsv, dispatch),
  bsv: bindActionCreators(actions.core.data.bsv, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(BsvContainer)
