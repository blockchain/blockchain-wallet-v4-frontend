import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { keys } from 'ramda'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { STEPS, MODAL_NAME } from 'data/components/identityVerification/model'
import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import media from 'services/ResponsiveService'
import { ModalHeader, ModalBody } from 'blockchain-info-components'
import Tray, { duration } from 'components/Tray'
import StepIndicator from 'components/StepIndicator'
import Personal from './Personal'
import Address from './Address'
import Verify from './Verify'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`

const stepMap = {
  [STEPS.personal]: (
    <FormattedMessage
      id='modals.identityverification.steps.personal'
      defaultMessage='Personal'
    />
  ),
  [STEPS.address]: (
    <FormattedMessage
      id='modals.identityverification.steps.address'
      defaultMessage='Address'
    />
  ),
  [STEPS.verify]: (
    <FormattedMessage
      id='modals.identityverification.steps.verify'
      defaultMessage='Verify'
    />
  )
}

class IdentityVerification extends React.PureComponent {
  state = { show: false }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  getStepComponent = step => {
    const { actions, modalActions, position, total } = this.props
    if (step === STEPS.address)
      return (
        <Address
          handleSubmit={actions.setVertificationStep.bind(null, STEPS.verify)}
        />
      )

    if (step === STEPS.verify)
      return (
        <Verify
          handleSubmit={modalActions.showModal.bind(null, 'Onfido', {
            position: position + 1,
            total: total + 1
          })}
        />
      )

    return (
      <Personal
        handleSubmit={actions.setVertificationStep.bind(null, STEPS.address)}
      />
    )
  }

  render () {
    const { show } = this.state
    const { step, position, total } = this.props

    return (
      <Tray
        in={show}
        class='tray'
        position={position}
        total={total}
        onClose={this.handleClose}
      >
        <ModalHeader tray paddingHorizontal='15%' onClose={this.handleClose}>
          <HeaderWrapper>
            <StepIndicator
              adjuster={0.1667}
              barFullWidth
              flexEnd
              minWidth='135px'
              maxWidth='135px'
              step={step}
              stepMap={stepMap}
            />
          </HeaderWrapper>
        </ModalHeader>
        <ModalBody>{this.getStepComponent(step)}</ModalBody>
      </Tray>
    )
  }
}

IdentityVerification.propTypes = {
  step: PropTypes.oneOf(keys(STEPS)),
  close: PropTypes.func.isRequired
}

IdentityVerification.defaultProps = {
  step: STEPS.personal
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer(MODAL_NAME),
  connect(
    getData,
    mapDispatchToProps
  )
)

export default enhance(IdentityVerification)
