import React, { useState } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Button, Icon } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Amount } from './Amount'
import { Receive } from './Receive'
import { SelectAccount } from './SelectAccount'
import { Success } from './Success'

export const FundingWrapper = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: Inter, sans-serif;
  letter-spacing: 0em;
  color: white;
  background-color: #0e121b;
  padding: 24px;
`

export const Funding = (props) => {
  const { path } = props.match

  return (
    <FundingWrapper>
      <Link to={`${path}/select-account`}>
        <Icon color='white060' label='IconActivity' size='md'>
          <IconArrowLeft />
        </Icon>
      </Link>
      <Switch>
        <Route path={`${path}/select-account`} component={SelectAccount} />
        <Route path={`${path}/amount`} component={Amount} />
        <Route path={`${path}/success`} component={Success} />
        <Route path={`${path}/receive`} component={Receive} />
      </Switch>
    </FundingWrapper>
  )
}
