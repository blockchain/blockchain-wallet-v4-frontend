import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { getData } from './selectors'
import ImportBchAddress from './template.js'
import modalEnhancer from 'providers/ModalEnhancer'

class ImportBchAddressContainer extends React.PureComponent {
  render () {
    const {
      position,
      close,
      submitting,
      invalid,
      network,
      actions,
      addresses
    } = this.props

    return (
      <ImportBchAddress
        submitting={submitting}
        position={position}
        invalid={invalid}
        network={network}
        close={close}
        onSubmit={() => actions.importBchAddressSubmitClicked(addresses)}
      />
    )
  }
}

const mapStateToProps = getData

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.importBchAddress, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('ImportBchAddress'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ImportBchAddressContainer)
