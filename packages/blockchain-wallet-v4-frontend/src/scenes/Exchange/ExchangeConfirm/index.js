import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { compose } from 'ramda'

import { actions, model } from 'data'
import { getData } from './selectors'

import { BlockchainLoader } from 'blockchain-info-components'
import DataError from 'components/DataError'
import ExchangeConfirm from './template'

const { EXCHANGE_FORM } = model.components.exchange.EXCHANGE_STEPS
const { SECOND_STEP_BACK, SECOND_STEP_SUBMIT_CLICK } = model.analytics.EXCHANGE

const Loader = styled(BlockchainLoader)`
  align-self: center;
  margin-top: 50px;
`
class ExchangeConfirmContainer extends React.PureComponent {
  render () {
    const { data, actions, logBack, logSubmitClick } = this.props
    return data.cata({
      Success: value => (
        <ExchangeConfirm
          {...value}
          onBack={compose(
            logBack,
            actions.setStep.bind(null, EXCHANGE_FORM)
          )}
          onSubmit={compose(
            logSubmitClick,
            actions.confirmExchange
          )}
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
  logBack: () => dispatch(actions.analytics.logEvent(SECOND_STEP_BACK)),
  logSubmitClick: () =>
    dispatch(actions.analytics.logEvent(SECOND_STEP_SUBMIT_CLICK)),
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeConfirmContainer)
