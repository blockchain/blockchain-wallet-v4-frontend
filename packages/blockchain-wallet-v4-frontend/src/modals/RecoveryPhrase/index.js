import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { wizardForm } from 'providers/FormProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'

class RecoveryPhraseContainer extends React.Component {
  render () {
    switch (this.props.step) {
      case 0: return <FirstStep {...this.props} />
      case 1: return <SecondStep {...this.props} />
      case 2: return <ThirdStep {...this.props} />
      default: return <div />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  wizardForm('recoveryPhrase', 3),
  modalEnhancer('RecoveryPhrase'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(RecoveryPhraseContainer)
