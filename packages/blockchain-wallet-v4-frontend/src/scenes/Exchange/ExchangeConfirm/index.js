import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, model } from 'data'
import { getData } from './selectors'
import { BlockchainLoader } from 'blockchain-info-components'
import DataError from 'components/DataError'
import ExchangeConfirm from './template'

const { EXCHANGE_FORM } = model.components.exchange.EXCHANGE_STEPS

const Loader = styled(BlockchainLoader)`
  align-self: center;
  margin-top: 50px;
`
class ExchangeConfirmContainer extends React.PureComponent {
  render () {
    const { data, actions } = this.props
    return data.cata({
      Success: value => (
        <ExchangeConfirm
          {...value}
          onBack={actions.setStep.bind(null, EXCHANGE_FORM)}
          onSubmit={actions.confirmExchange}
        />
      ),
      Failure: message => <DataError message={message} />,
      Loading: () => <Loader width='200px' height='200px' />,
      NotAsked: () => <Loader width='200px' height='200px' />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeConfirmContainer)
