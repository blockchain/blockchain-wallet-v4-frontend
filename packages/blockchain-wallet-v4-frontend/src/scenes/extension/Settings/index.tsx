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
  flex-direction: column;
  flex-grow: 1;
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

export const Settings = (props) => {
  const { path } = props.match

  const goBack = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    props.history.goBack()
  }
  return (
    <SettingsContainer>
      <Flex justifyContent='space-between'>
        {`#${path}` !== window.location.hash ? (
          <Link to={path} onClick={goBack}>
            <Icon color='white800' label='IconBack' size='md'>
              <IconArrowLeft />
            </Icon>
          </Link>
        ) : (
          <span />
        )}
        <Link to='/extension/home'>
          <Icon color='white600' label='IconClose' size='md'>
            <IconClose />
          </Icon>
        </Link>
      </Flex>
      <SettingsContainer>
        <Switch>
          <Route component={Overal} path={path} exact />
          <Route component={Account} path={`${path}/account`} />
          <Route component={Networks} path={`${path}/networks`} />
          <Route component={Connected} path={`${path}/connected-dapps`} />
          <Route component={General} path={`${path}/general`} />
          <Route component={Info} path={`${path}/info`} />
        </Switch>
      </SettingsContainer>
    </SettingsContainer>
  )
}
