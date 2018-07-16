import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { keys } from 'ramda'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { STEPS } from 'data/components/identityVerification/model'
import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import media from 'services/ResponsiveService'
import { ModalHeader, ModalBody } from 'blockchain-info-components'
import Tray, { duration } from 'components/Tray'
import StepIndicator from 'components/StepIndicator'
import Personal from './Personal'
// import Address from './Address'
// import Verify from './Verify'

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

export const formName = 'IdentityVerification'

class IdentityVerification extends React.PureComponent {
  static propTypes = {
    step: PropTypes.oneOf(keys(STEPS)),
    isOnfidoEnabled: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
  }

  static defaultProps = {
    step: STEPS.personal
  }

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
    const { actions } = this.props
    // if (step === STEPS.address) return <Address />
    // if (step === STEPS.verify) return <Verify />
    return (
      <Personal
        handleSubmit={actions.setVertificationStep.bind(null, STEPS.address)}
      />
    )
  }

  render () {
    const { show } = this.state
    const { step } = this.props

    return (
      <Tray in={show} class='tray' onClose={this.handleClose}>
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
        <ModalBody>{this.getStepComponent()}</ModalBody>
      </Tray>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const enhance = compose(
  modalEnhancer('IdentityVerification'),
  connect(
    getData,
    mapDispatchToProps
  )
)

export default enhance(IdentityVerification)
