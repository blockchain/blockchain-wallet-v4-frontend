import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions, model } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.Component {
  handleToToggle = val => {
    this.props.formActions.touch(model.components.sendBsv.FORM, 'to')
    this.props.actions.sendBsvFirstStepToToggled(val)
  }

  render () {
    const { data, actions } = this.props

    return data.cata({
      Success: value => {
        return (
          <Success
            from={value.from}
            network={value.network}
            toToggled={value.toToggled}
            destination={value.destination}
            enableToggle={value.enableToggle}
            effectiveBalance={value.effectiveBalance}
            totalFee={value.totalFee}
            handleToToggle={this.handleToToggle}
            onSubmit={actions.sendBsvFirstStepSubmitClicked}
            excludeHDWallets={this.props.excludeHDWallets}
          />
        )
      },
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
  actions: bindActionCreators(actions.components.sendBsv, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStep)
