import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { actions } from 'data'

const ModalIcon = styled(Icon)`
  margin-top: 4px;
  margin-left: 24px;
  cursor: pointer;
  font-size: 20px;
  color: ${props => props.theme['brand-secondary']};
`

const ModalIconContainer = ({ className, showModal }) => (
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

export default connect(null, mapDispatchToProps)(ModalIconContainer)
