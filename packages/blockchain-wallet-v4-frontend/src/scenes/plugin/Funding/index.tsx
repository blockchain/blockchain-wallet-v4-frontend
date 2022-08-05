import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import styled from 'styled-components'

import Receive from './Receive'

export const FundingWrapper = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  letter-spacing: 0em;
  font-family: Inter, sans-serif;
  color: ${(props) => props.theme.white};
`

const Funding = (props) => {
  const { path } = props.match

  return (
    <FundingWrapper>
      <Link to='/plugin/coinslist'>
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

export default Funding
