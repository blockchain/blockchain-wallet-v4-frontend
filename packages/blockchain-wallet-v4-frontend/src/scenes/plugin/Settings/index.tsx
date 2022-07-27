import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft, IconClose } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { Account } from './Account'
import { Connected } from './Connected'
import { General } from './General'
import { Info } from './Info'
import { Networks } from './Networks'
import Overal from './Overal'

export const SettingsHeading = styled(Text)`
  font-size: 20px;
  margin: 34px 0 42px;
  color: ${(props) => props.theme.white};
`

export const SettingsContainer = styled(Flex)`
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  width: 360px;
  height: 600px;
  padding: 24px;
  box-sizing: border-box;
  flex-direction: column;
  z-index: 2;
  background: ${(props) => props.theme.black};
`

const SettingsItemsWrapper = styled(Flex)`
  flex-direction: column;
  flex-grow: 1;
`

const SettingsLinksWrapper = styled(Flex)`
  z-index: 3;
`

const SettingsControl = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
`

export class Setting {
  public id: string

  public icon: any

  public label: string

  public path: string

  constructor(id: string, label: string, path: string, icon?: any) {
    this.id = id
    this.label = label
    this.path = path
    this.icon = icon
  }
}

const Settings = ({ setIsSettingsVisible }) => {
  const closeSettings = () => {
    setIsSettingsVisible(false)
  }
  return (
    <SettingsContainer>
      <SettingsLinksWrapper justifyContent='space-between'>
        <Link to='/plugin/coinslist'>
          <Icon color='grey700' label='IconBack' size='md'>
            <IconArrowLeft />
          </Icon>
        </Link>
        <Link to='/plugin/coinslist' onClick={closeSettings}>
          <Icon color='grey700' label='IconClose' size='md'>
            <IconClose />
          </Icon>
        </Link>
      </SettingsLinksWrapper>
      <SettingsItemsWrapper>
        <Switch>
          <Route component={Overal} path='/plugin/coinslist' exact />
          <Route component={Account} path='/plugin/coinslist/account' />
          <Route component={Networks} path='/plugin/coinslist/networks' />
          <Route component={Connected} path='/plugin/coinslist/connected-dapps' />
          <Route component={General} path='/plugin/coinslist/general' />
          <Route component={Info} path='/plugin/coinslist/about' />
        </Switch>
      </SettingsItemsWrapper>
    </SettingsContainer>
  )
}

export default Settings
