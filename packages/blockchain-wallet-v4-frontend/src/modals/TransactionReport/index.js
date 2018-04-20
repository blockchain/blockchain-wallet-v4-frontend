import React from 'react'
import { compose } from 'redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import TransactionReport from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class TransactionReportContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  render () {
    const { step, position, total, closeAll, ...rest } = this.props

    return (
      <TransactionReport position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep {...rest} />}
        {step === 2 && <SecondStep {...rest} />}
      </TransactionReport>
    )
  }
}

const enhance = compose(
  modalEnhancer('TransactionReport'),
  wizardProvider('transactionReport', 2)
)

export default enhance(TransactionReportContainer)
