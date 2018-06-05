import React from 'react'
import PropTypes from 'prop-types'
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
    const { step, position, total, closeAll, coin } = this.props

    return (
      <TransactionReport position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep coin={coin} />}
        {step === 2 && <SecondStep coin={coin} />}
      </TransactionReport>
    )
  }
}

TransactionReportContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH'])
}

TransactionReportContainer.defaultProps = {
  coin: 'BTC'
}

const enhance = compose(
  modalEnhancer('TransactionReport'),
  wizardProvider('transactionReport', 2)
)

export default enhance(TransactionReportContainer)
