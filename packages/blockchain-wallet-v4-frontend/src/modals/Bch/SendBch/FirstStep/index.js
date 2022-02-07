import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.Component {
  render() {
    const { actions, data, excludeHDWallets, payPro } = this.props

    return data.cata({
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (value) => (
        <Success
          {...value}
          excludeHDWallets={excludeHDWallets}
          handleBitPayInvoiceExpiration={actions.sendBchBitPayInvoiceExpired}
          onSubmit={actions.sendBchFirstStepSubmitClicked}
          payPro={payPro}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.sendBch, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'Send',
        tier: 2
      })
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)
