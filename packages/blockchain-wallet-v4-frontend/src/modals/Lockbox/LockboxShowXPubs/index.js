import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { keys } from 'ramda'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import {
  Banner,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import QRCodeWrapper from 'components/QRCode/Wrapper'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { media } from 'services/styles'

import { getData } from './selectors'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const WarningBanner = styled(Banner)`
  margin-bottom: 20px;
`
const XPubText = styled(Text)`
  background-color: ${(props) => props.theme.grey000};
  padding: 25px;
  margin-bottom: 20px;
  word-break: break-all;
  width: 80%;
`
const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid ${(props) => props.theme.grey000};
  margin-bottom: 35px;
`
const Tab = styled.div`
  width: 33%;
  display: flex;
  padding: 10px 5px;
  position: relative;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${media.atLeastTablet`
    padding: 15px 5px;
  `}
  &:after {
    display: block;
    content: '';
    width: 100%;
    left: 0;
    bottom: -2px;
    position: absolute;
    transform: scaleX(0);
    transition: transform 0.3s;
    border-bottom: solid 2px ${(props) => props.theme.grey800};
  }
  > * {
    transition: color 0.3s;
  }
  &.active,
  &:hover {
    &:after {
      transform: scaleX(1);
    }
  }
`
const TabHeader = styled(Text)`
  font-weight: 400;
  ${media.atLeastTablet`
    font-size: 20px;
  `}
`
const TabIcon = styled(Icon)`
  margin-right: 10px;
  ${media.atLeastTablet`
    font-size: ${(props) => props.size || '20px'};
  `}
`

export class LockboxShowXPubs extends React.PureComponent {
  state = {
    activeTab: 'btc'
  }

  setActive = (tab) => {
    this.setState({ activeTab: tab })
  }

  render() {
    const { closeAll, position, total } = this.props
    const { activeTab } = this.state

    return this.props.data.cata({
      Failure: () => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />,
      Success: (coins) => (
        <Modal size='large' position={position} total={total}>
          <ModalHeader icon='lock' onClose={closeAll}>
            <FormattedMessage
              id='modals.lockbox.showxpubs.title'
              defaultMessage='Lockbox Extended Public Keys'
            />
          </ModalHeader>
          <ModalBody>
            <WarningBanner type='warning'>
              <Text size='13px' color='error'>
                <FormattedMessage
                  id='modals.lockbox.showxpubs.warning'
                  defaultMessage="Don't share your Extended Public Keys (xPubs) with an untrusted source. Anyone with access to these can keep track of your payments and may be able to disrupt access to your wallet."
                />
              </Text>
            </WarningBanner>
            <Tabs>
              {keys(coins).map((coin) => {
                return (
                  <Tab
                    key={coin}
                    className={activeTab === coin ? 'active' : ''}
                    onClick={() => this.setActive(coin)}
                  >
                    <TabIcon name={coin} size='28px' color={coin} />
                    <TabHeader>
                      <span>{coin.toUpperCase()}</span>
                    </TabHeader>
                  </Tab>
                )
              })}
            </Tabs>
            {coins[activeTab] ? (
              <Content>
                <XPubText size='12px' weight='300'>
                  {coins[activeTab]}
                </XPubText>
                <QRCodeWrapper value={coins[activeTab]} size={150} />
              </Content>
            ) : (
              <Content style={{ textAlign: 'center' }}>
                <Text size='16px'>
                  <FormattedMessage
                    id='modals.lockbox.showxpubs.failedtoderive'
                    defaultMessage='Failed to derive the xPub!'
                  />
                </Text>
                <Text size='16px' style={{ marginTop: '10px' }}>
                  <FormattedMessage
                    id='modals.lockbox.showxpubs.ensurecoinadded'
                    defaultMessage='Ensure {coin} has been added to your Lockbox.'
                    values={{ coin: activeTab.toUpperCase() }}
                  />
                </Text>
              </Content>
            )}
          </ModalBody>
          <ModalFooter align='right'>
            <Button nature='primary' onClick={closeAll}>
              <FormattedMessage id='buttons.close' defaultMessage='Close' />
            </Button>
          </ModalFooter>
        </Modal>
      )
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.deviceIndex)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('LOCKBOX_SHOW_XPUBS'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(LockboxShowXPubs)
