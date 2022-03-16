import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import GenerateReport from './template'

const GenerateReportContainer = ({ errors, modalActions }) => {
  const onClose = () => modalActions.closeModal()

  return <GenerateReport errors={errors} onClose={onClose} />
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const mapStateToProps = (state) => ({
  errors: selectors.components.taxCenter.selectErrors(state)
})

const enhance = compose(
  modalEnhancer(ModalName.GENERATE_REPORT_MODAL),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(GenerateReportContainer)
