import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  render () {
    const { data, actions, coin } = this.props
    return data.cata({
      Success: value => (
        <Success
          coin={coin}
          fee={value.fee}
          from={value.from}
          isContract={value.isContract}
          isContractChecked={value.isContractChecked}
          unconfirmedTx={value.unconfirmedTx}
          effectiveBalance={value.effectiveBalance}
          onSubmit={actions.sendEthFirstStepSubmitClicked}
          feeToggled={value.feeToggled}
          enableToggle={value.enableToggle}
          minFee={value.minFee}
          maxFee={value.maxFee}
          regularFee={value.regularFee}
          priorityFee={value.priorityFee}
          feeElements={value.feeElements}
          handleFeeToggle={actions.sendEthFirstStepFeeToggled}
          balanceStatus={value.balanceStatus}
          excludeLockbox={value.excludeLockbox}
          hasErc20Balance={value.hasErc20Balance}
          isFeeSufficientForTx={value.isFeeSufficientForTx}
        />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStep)
