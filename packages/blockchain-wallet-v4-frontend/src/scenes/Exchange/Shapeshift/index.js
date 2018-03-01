import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
// import * as crypto from 'crypto'

import wizardProvider from 'providers/WizardProvider'
import { getData } from './selectors'
import { actions } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class ShapeshiftContainer extends React.Component {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    switch (this.props.step) {
      case 1: return <FirstStep {...this.props} />
      case 2: return <SecondStep {...this.props} />
      default: return <div />
    }
  }
}

const mapStateToProps = (state) => {
  const data = getData(state)
  return { ...data }
}

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  dataShapeshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  wizardProvider('exchange', 2),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ShapeshiftContainer)
