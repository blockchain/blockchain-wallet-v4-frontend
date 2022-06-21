import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft, IconClose } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { Account } from './Account'
import { Networks } from './Networks'
import { Overal } from './Overal'

export const SettingsHeading = styled(Text)`
  font-size: 20px;
  margin: 34px 0 42px;
  color: white;
`

export const Close = styled(Link)`
  width: 100%;
  display: flex;
  justify-content: end;
`

export const SettingsContainer = styled.section`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

export class Setting {
  public icon: any

  public label: string

  public path: string

  constructor(label: string, path: string, icon?: any) {
    this.label = label
    this.path = path
    this.icon = icon
  }
}

export const Settings = (props) => {
  const { path } = props.match

  return (
    <SettingsContainer>
      {`#${path}` === window.location.hash ? (
        <Close to='/extension/home'>
          <Icon color='white600' label='IconClose' size='md'>
            <IconClose />
          </Icon>
        </Close>
      ) : (
        <Link to={`${path}`}>
          <Icon color='white800' label='IconBack' size='md'>
            <IconArrowLeft />
          </Icon>
        </Link>
      )}
      <SettingsContainer>
        <Switch>
          <Route component={Overal} path={path} exact />
          <Route component={Account} path={`${path}/account`} exact />
          <Route component={Networks} path={`${path}/networks`} exact />
        </Switch>
      </SettingsContainer>
    </SettingsContainer>
  )
}
