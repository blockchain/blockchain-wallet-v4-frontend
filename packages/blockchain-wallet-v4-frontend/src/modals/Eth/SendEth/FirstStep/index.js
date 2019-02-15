import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions, model } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  handleToToggle = val => {
    this.props.formActions.touch(model.components.sendEth.FORM, 'to')
    this.props.actions.sendEthFirstStepToToggled(val)
  }

  render () {
    const { data, actions } = this.props
    return data.cata({
      Success: value => (
        <Success
          fee={value.fee}
          from={value.from}
          isContract={value.isContract}
          unconfirmedTx={value.unconfirmedTx}
          effectiveBalance={value.effectiveBalance}
          onSubmit={actions.sendEthFirstStepSubmitClicked}
          toToggled={value.toToggled}
          feeToggled={value.feeToggled}
          handleToToggle={this.handleToToggle}
          destination={value.destination}
          enableToggle={value.enableToggle}
          minFee={value.minFee}
          maxFee={value.maxFee}
          regularFee={value.regularFee}
          priorityFee={value.priorityFee}
          feeElements={value.feeElements}
          handleFeeToggle={actions.sendEthFirstStepFeeToggled}
          balanceStatus={value.balanceStatus}
          excludeLockbox={value.excludeLockbox}
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
  actions: bindActionCreators(actions.components.sendEth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStep)
