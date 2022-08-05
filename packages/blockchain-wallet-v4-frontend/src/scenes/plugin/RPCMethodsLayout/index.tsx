import React from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import { Flex } from 'components/Flex'

const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled(Flex)`
  position: relative;
  justify-content: center;
  background: ${(props) => props.theme.black};
  width: 360px;
  height: 600px;
  padding: 24px;
  box-sizing: border-box;
`

const RPCMethodsLayout = (props) => {
  const { component: Component, exact = false, path } = props

  return (
    <Route
      path={path}
      exact={exact}
      render={(matchProps) => (
        <MainWrapper>
          <Wrapper>
            <Component {...matchProps} />
          </Wrapper>
        </MainWrapper>
      )}
    />
  )
}

export default RPCMethodsLayout
