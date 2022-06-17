import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Receive } from './Receive'

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
      <Link to='/extension/home'>
        <Icon color='white060' label='IconActivity' size='md'>
          <IconArrowLeft />
        </Icon>
      </Link>
      <Switch>
        <Route path={`${path}/`} component={Receive} />
      </Switch>
    </FundingWrapper>
  )
}
