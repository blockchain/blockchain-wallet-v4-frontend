import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
  box-sizing: border-box;
`
const Device = styled.div`
  padding: 10px;
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
`

const Lockbox = props => {
  const { addDevice, deleteDevice, deviceIdList, devices } = props
  return (
    <Wrapper>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '10px'
        }}
      >
        <Button nature='primary' onClick={addDevice}>
          <FormattedMessage
            id='scenes.lockbox.welcome.addanotherdevice'
            defaultMessage='Add Another Device'
          />
        </Button>
      </div>
      {deviceIdList.map((id, i) => {
        const device = devices[id]
        return (
          <Device>
            <h3>{device.deviceName}</h3>
            <div>ID: {deviceIdList[i]}</div>
            {!device.accounts ? (
              <div>Accounts not stored.</div>
            ) : (
              <div>
                <div>
                  BTC Account Label: {device.accounts.btc.accounts[0].label}
                </div>
                <div>BTC Xpub: {device.accounts.btc.accounts[0].xpub}</div>
                <div>
                  ETH Account Label: {device.accounts.eth.accounts[0].label}
                </div>
                <div>ETH Address: {device.accounts.eth.accounts[0].addr}</div>
              </div>
            )}

            <Button
              nature='sent'
              style={{ marginTop: '10px' }}
              onClick={() => {
                deleteDevice(deviceIdList[i])
              }}
            >
              <FormattedMessage
                id='scenes.lockbox.welcome.deletedevice'
                defaultMessage='Delete Device'
              />
            </Button>
          </Device>
        )
      })}
    </Wrapper>
  )
}

export default Lockbox
