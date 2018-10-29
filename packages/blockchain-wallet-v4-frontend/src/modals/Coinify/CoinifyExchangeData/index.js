import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import modalEnhancer from 'providers/ModalEnhancer'
import { compose } from 'redux'
import { connect } from 'react-redux'
import StepIndicator from 'components/StepIndicator'
import Tray from 'components/Tray'
import { selectors } from 'data'
import Create from './Create'
import Confirm from './Confirm'
import ISignThis from './ISignThis'
import { ModalHeader, ModalBody, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { path } from 'ramda'
import media from 'services/ResponsiveService'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`
const HeaderText = styled(Text)`
  font-size: 20px;
  ${media.mobile`
    display: none;
  `};
`

class CoinifyExchangeData extends React.PureComponent {
  constructor () {
    super()
    this.state = { show: false }
    this.stepMap = {
      account: (
        <FormattedMessage
          id='modals.coinifyexchangedata.steps.account'
          defaultMessage='Create Account'
        />
      ),
      isx: (
        <FormattedMessage
          id='modals.coinifyexchangedata.steps.identityverify'
          defaultMessage='Identity Verification'
        />
      )
    }
  }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose () {
    this.setState({ show: false })
    setTimeout(this.props.close, 500)
  }

  getStepComponent (step) {
    switch (step) {
      case 'account':
        return <Create country={this.props.country} />
      case 'isx':
        return (
          <ISignThis iSignThisId={path(['iSignThisID'], this.props.trade)} />
        )
      case 'confirm':
        return <Confirm />
    }
  }

  render () {
    const { show } = this.state
    const step = this.props.signupStep || this.props.step

    return (
      <Tray in={show} class='tray' onClose={this.handleClose.bind(this)}>
        <ModalHeader
          tray
          paddingHorizontal='15%'
          onClose={this.handleClose.bind(this)}
        >
          <HeaderWrapper>
            <HeaderText size='20px' weight={300}>
              <FormattedMessage
                id='coinifyexchangedata.header.start'
                defaultMessage='Start buying and selling in two simple steps.'
              />
            </HeaderText>
            <StepIndicator
              barFullWidth
              flexEnd
              minWidth='135px'
              maxWidth='135px'
              step={step}
              stepMap={this.stepMap}
            />
          </HeaderWrapper>
        </ModalHeader>
        <ModalBody>{this.getStepComponent(step)}</ModalBody>
      </Tray>
    )
  }
}

CoinifyExchangeData.propTypes = {
  step: PropTypes.oneOf(['account', 'isx', 'confirm', 'order', 'payment']),
  close: PropTypes.func
}

const mapStateToProps = state => ({
  data: getData(state),
  signupStep: path(['coinify', 'signupStep'], state),
  signupComplete: path(['coinify', 'signupComplete'], state),
  trade: selectors.core.data.coinify.getTrade(state).getOrElse({})
})

const enhance = compose(
  modalEnhancer('CoinifyExchangeData'),
  connect(mapStateToProps)
)

export default enhance(CoinifyExchangeData)
