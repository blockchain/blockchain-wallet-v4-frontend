import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import Flyout, { duration } from 'components/Flyout'
import FlyoutContainer from 'components/Flyout/Container'
import { ModalName } from 'data/modals/types'
import modalEnhancer from 'providers/ModalEnhancer'

const LoadingFlyout = (props) => (
  <Flyout {...props}>
    <FlyoutContainer>LOADING</FlyoutContainer>
  </Flyout>
)

const enhance = compose<React.ComponentType>(
  modalEnhancer(ModalName.LOADING_FLYOUT, { transition: duration })
)

const connector = connect(null, null)

export default connector(enhance(LoadingFlyout))
