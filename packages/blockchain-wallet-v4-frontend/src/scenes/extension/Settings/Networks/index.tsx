import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { Ethereum } from '../../../../icons/Ethereum'
import { Near } from '../../../../icons/Near'
import { Optimist } from '../../../../icons/Optimist'
import { Polygon } from '../../../../icons/Polygon'
import { SettingsList } from '../Overal'

const NetworkHeading = styled(Text)`
  font-size: 20px;
  margin: 34px 0 58px;
  color: white;
`

const NetworkButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background-color: transparent;
  border: unset;
  outline: none;
  cursor: pointer;
`

const ButtonLabel = styled(Text)`
  margin-left: 16px;
  flex-grow: 1;
  color: white;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
`

const ButtonSatus = styled(Text)`
  color: white;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: right;
`
class Network {
  public icon: any

  public label: string

  public isConnected: boolean

  constructor(icon: any, label: string, isConnected: boolean) {
    this.icon = icon
    this.label = label
    this.isConnected = isConnected
  }
}

export const Networks = () => {
  const networks = [
    new Network(<Ethereum />, 'Ethereum', true),
    new Network(<Polygon />, 'Polygon', false),
    new Network(<Near />, 'Near', false),
    new Network(<Polygon />, 'Fantom', false),
    new Network(<Polygon />, 'Arbitrum', false),
    new Network(<Optimist />, 'Optimist', false)
  ]

  return (
    <>
      <NetworkHeading>Available networks</NetworkHeading>
      <SettingsList>
        {networks.map((network: Network) => (
          <li key={network.label}>
            <NetworkButton>
              {network.icon}
              <ButtonLabel>{network.label}</ButtonLabel>
              <ButtonSatus>{network.isConnected && 'Connected'}</ButtonSatus>
            </NetworkButton>
          </li>
        ))}
      </SettingsList>
    </>
  )
}
