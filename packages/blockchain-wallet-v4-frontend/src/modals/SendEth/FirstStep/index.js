import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleToToggle = this.handleToToggle.bind(this)
  }

  handleToToggle (val) {
    this.props.formActions.touch('sendEth', 'to')
    this.props.actions.sendEthFirstStepToToggled(val)
  }

  render () {
    return this.props.data.cata({
      Success: value => (
        <Success
          fee={value.fee}
          isContract={value.isContract}
          unconfirmedTx={value.unconfirmedTx}
          effectiveBalance={value.effectiveBalance}
          toToggled={value.toToggled}
          handleToToggle={this.handleToToggle}
          destination={value.destination}
          enableToggle={value.enableToggle}
          onSubmit={() => this.props.actions.sendEthFirstStepSubmitClicked()}
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
