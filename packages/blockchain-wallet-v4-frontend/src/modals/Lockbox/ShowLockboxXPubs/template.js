import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import QRCodeReact from 'qrcode.react'
import { FormattedMessage } from 'react-intl'
import { keys } from 'ramda'

import {
  Banner,
  Icon,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Button
} from 'blockchain-info-components'

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
  background-color: ${props => props.theme['white-blue']};
  padding: 25px;
  margin-bottom: 20px;
  word-break: break-all;
  width: 80%;
`
const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid ${props => props.theme['gray-1']};
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
  @media (min-width: 768px) {
    padding: 15px 5px;
  }
  &:after {
    display: block;
    content: '';
    width: 100%;
    left: 0;
    bottom: -2px;
    position: absolute;
    transform: scaleX(0);
    transition: transform 0.3s;
    border-bottom: solid 2px ${props => props.theme['gray-6']};
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
  font-weight: 300;
  @media (min-width: 768px) {
    font-size: 20px;
  }
`
const TabIcon = styled(Icon)`
  margin-right: 10px;
  @media (min-width: 768px) {
    font-size: ${props => props.size || '20px'};
  }
`

const PromptLockbox = props => {
  const { activeTab, coins, setActive, closeAll, position, total } = props

  return (
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
          {keys(coins).map(coin => {
            return (
              <Tab
                className={activeTab === coin ? 'active' : ''}
                onClick={() => setActive(coin)}
              >
                <TabIcon
                  name={coin + '-circle-filled'}
                  size='28px'
                  color={coin}
                />
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
            <QRCodeReact value={coins[activeTab]} size={150} />
          </Content>
        ) : (
          <Content style={{ textAlign: 'center' }}>
            <Text size='16px'>
              <FormattedMessage
                id='modals.lockbox.showxpubs.notfound'
                defaultMessage='Failed to derive the xPub!'
              />
            </Text>
            <Text size='16px' style={{ marginTop: '10px' }}>
              <FormattedMessage
                id='modals.lockbox.showxpubs.notfound2'
                defaultMessage='Ensure {coin} has been added to your Lockbox.'
                values={{ coin: activeTab.toUpperCase() }}
              />
            </Text>
          </Content>
        )}
      </ModalBody>
      <ModalFooter align='right'>
        <Button nature='primary' onClick={closeAll}>
          <FormattedMessage
            id='modals.lockbox.showxpubs.close'
            defaultMessage='Close'
          />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

PromptLockbox.propTypes = {
  coin: PropTypes.string
}

export default PromptLockbox
