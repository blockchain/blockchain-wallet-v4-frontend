import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  render () {
    const { data, actions, coin } = this.props
    return data.cata({
      Success: value => (
        <Success
          balanceStatus={value.balanceStatus}
          coin={coin}
          effectiveBalance={value.effectiveBalance}
          enableToggle={value.enableToggle}
          excludeLockbox={value.excludeLockbox}
          fee={value.fee}
          feeElements={value.feeElements}
          feeToggled={value.feeToggled}
          from={value.from}
          handleFeeToggle={actions.sendEthFirstStepFeeToggled}
          hasErc20Balance={value.hasErc20Balance}
          isContractChecked={value.isContractChecked}
          isMnemonicVerified={value.isMnemonicVerified}
          isSufficientEthForErc20={value.isSufficientEthForErc20}
          maxFee={value.maxFee}
          minFee={value.minFee}
          onSubmit={actions.sendEthFirstStepSubmitClicked}
          priorityFee={value.priorityFee}
          regularFee={value.regularFee}
          unconfirmedTx={value.unconfirmedTx}
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
