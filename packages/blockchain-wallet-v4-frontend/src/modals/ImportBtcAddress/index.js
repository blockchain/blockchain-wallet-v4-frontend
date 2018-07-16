import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'

import modalEnhancer from 'providers/ModalEnhancer'
import ImportBtcAddress from './template.js'
import { getData } from './selectors'

class ImportBtcAddressContainer extends React.PureComponent {
  render () {
    const { position, close, submitting, invalid, isAddressInternal, isAddressExternal, priv, actions } = this.props

    return (
      <ImportBtcAddress
        isAddressInternal={isAddressInternal}
        isAddressExternal={isAddressExternal}
        position={position}
        submitting={submitting}
        invalid={invalid}
        close={close}
        priv={priv}
        onSubmit={() => actions.importBtcAddressSubmitClicked()}
      />
    )
  }
}

const mapStateToProps = getData

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.importBtcAddress, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('ImportBtcAddress')
)

export default enhance(ImportBtcAddressContainer)
