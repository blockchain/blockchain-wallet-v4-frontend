import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'

function BitPayInfo ({ coin, modalActions, previousModal }) {
  return <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('BitPayInfo'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(BitPayInfo)
