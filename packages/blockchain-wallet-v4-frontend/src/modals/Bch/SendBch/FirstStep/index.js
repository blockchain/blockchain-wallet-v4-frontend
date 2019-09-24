import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.Component {
  render () {
    const { actions, data, excludeHDWallets, payPro } = this.props

    return data.cata({
      Success: value => (
        <Success
          destination={value.destination}
          effectiveBalance={value.effectiveBalance}
          excludeLockbox={value.excludeLockbox}
          excludeHDWallets={excludeHDWallets}
          from={value.from}
          handleBitPayInvoiceExpiration={actions.sendBchBitPayInvoiceExpired}
          network={value.network}
          onSubmit={actions.sendBchFirstStepSubmitClicked}
          payPro={payPro}
          totalFee={value.totalFee}
        />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBch, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStep)
