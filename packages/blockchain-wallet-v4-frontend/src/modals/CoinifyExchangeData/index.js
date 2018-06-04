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

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

class CoinifyExchangeData extends React.PureComponent {
  constructor () {
    super()
    this.state = { show: false }
    this.stepMap = {
      account: <FormattedMessage id='modals.coinifyexchangedata.steps.account' defaultMessage='Create Account' />,
      isx: <FormattedMessage id='modals.coinifyexchangedata.steps.identityverify' defaultMessage='Identity Verification' />
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
      case 'account': return <Create country={this.props.country} />
      case 'isx': return <ISignThis iSignThisId={path(['iSignThisID'], this.props.trade.data)} />
      case 'confirm': return <Confirm />
    }
  }

  render () {
    const { show } = this.state
    const step = this.props.signupStep || this.props.step

    let adjuster
    if (this.props.signupComplete) adjuster = 0.0
    else if (step === 'account' || step === 'isx') adjuster = 0.25

    return (
      <Tray in={show} class='tray' onClose={this.handleClose.bind(this)}>
        <ModalHeader tray paddingHorizontal='15%' onClose={this.handleClose.bind(this)}>
          <HeaderWrapper>
            <Text size='20px' weight={300}>
              <FormattedMessage id='coinifyexchangedata.header.start' defaultMessage='Start buying and selling in two simple steps.' />
            </Text>
            <StepIndicator adjuster={adjuster} barFullWidth flexEnd minWidth='135px' maxWidth='135px' step={step} stepMap={this.stepMap} />
          </HeaderWrapper>
        </ModalHeader>
        <ModalBody>
          { this.getStepComponent(step) }
        </ModalBody>
      </Tray>
    )
  }
}

CoinifyExchangeData.propTypes = {
  step: PropTypes.oneOf(['account', 'isx', 'confirm', 'order', 'payment']),
  close: PropTypes.function
}

const mapStateToProps = (state) => ({
  data: getData(state),
  signupStep: path(['coinify', 'signupStep'], state),
  signupComplete: path(['coinify', 'signupComplete'], state),
  trade: selectors.core.data.coinify.getTrade(state)
})

const mapDispatchToProps = (dispatch) => ({
  // coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('CoinifyExchangeData')
)

export default enhance(CoinifyExchangeData)
