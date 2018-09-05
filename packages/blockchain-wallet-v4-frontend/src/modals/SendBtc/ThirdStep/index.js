import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { Icon, Text } from 'blockchain-info-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
`

class ThirdStepContainer extends React.PureComponent {
  render () {
    const { isDeviceReady } = this.props
    return (
      <Content>
        <Row>
          <Text weight={300}>
            <FormattedHTMLMessage
              id='modals.sendbtc.thirdstep.connectbtcapp'
              defaultMessage='1. Open the <b>bitcoin app</b> on your device'
            />
          </Text>
          {isDeviceReady ? (
            <Icon
              name='checkmark-in-circle-filled'
              size='24px'
              color='success'
            />
          ) : (
            <Icon name='refresh' />
          )}
        </Row>
        <Row>
          <Text weight={300} opacity={isDeviceReady ? 1 : 0.4}>
            <FormattedMessage
              id='modals.sendbtc.thirdstep.confirmtx'
              defaultMessage='2. Review the transaction details on your device screen. Press the top right button to confirm the transaction.'
            />
          </Text>
        </Row>
      </Content>
    )
  }
}

const mapStateToProps = state => ({
  isDeviceReady: selectors.components.sendBtc.getIsDeviceReady(state)
})

export default connect(mapStateToProps)(ThirdStepContainer)
