import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import HomeRoutes from './HomeRoutes'

export const extensionHeight = 600
export const extensionWidth = 800

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

const InnerWrapper = styled.div`
  width: ${() => `${extensionWidth}px`};
  height: ${() => `${extensionHeight}px`};
`

const ExtensionRoutes = (props) => {
  const { path } = props.match
  return (
    <Wrapper>
      <InnerWrapper>
        <Switch>
          <Route path={`${path}/home`} component={HomeRoutes} />
        </Switch>
      </InnerWrapper>
    </Wrapper>
  )
}

export default ExtensionRoutes
