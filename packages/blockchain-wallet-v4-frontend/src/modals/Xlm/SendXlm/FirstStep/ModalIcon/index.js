import { connect } from 'react-redux'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import { Icon } from 'blockchain-info-components'

const ModalIcon = styled(Icon)`
  margin-left: 24px;
  cursor: pointer;
`

const ModalIconContainer = ({ showModal, className }) => (
  <ModalIcon
    onMouseDown={showModal}
    name='arrow-right'
    className={className}
    data-e2e='sendXlmRightArrow'
  />
)

const mapDispatchToProps = (dispatch, props) => ({
  showModal: dispatch.bind(
    null,
    actions.modals.showModal(props.modal, { ...props })
  )
})

export default connect(
  null,
  mapDispatchToProps
)(ModalIconContainer)
