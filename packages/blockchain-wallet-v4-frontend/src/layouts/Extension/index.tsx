import React, { ComponentType } from 'react'
import { Redirect, Route } from 'react-router-dom'
import styled from 'styled-components'

type ExtensionLayoutContainerProps = {
  component: ComponentType<any>
  path: string
}

const ExtensionContainer = styled.section`
  width: 100%;
  height: 100%;
`

const ExtensionWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 23px 24px;
`

export const ExtensionLayoutContainer: React.FC<ExtensionLayoutContainerProps> = ({
  component: Component,
  path
}) => {
  return (
    <Route
      path={path}
      render={(props) => (
        <ExtensionContainer>
          <ExtensionWrapper>
            <Component />
          </ExtensionWrapper>
        </ExtensionContainer>
      )}
    />
  )
}

export default ExtensionLayoutContainer
