import React, { ComponentType } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import { selectors } from 'data'

const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  position: relative;
  background: ${(props) => props.theme.exchangeLogin};
  width: 360px;
  height: 600px;
`

const Header = styled.div`
  position: absolute;
  height: 67px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.exchangeLogin};
  top: 0;
  width: 100%;
`

const Content = styled.div`
  padding: 70px 20px 70px 20px;
  box-sizing: border-box;
  height: 100%;
`

const Footer = styled.div`
  position: absolute;
  height: 67px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.exchangeLogin};
  bottom: 0;
  width: 100%;
`

const PluginLayout = ({
  component: Component,
  exact = false,
  footer,
  header,
  isCoinDataLoaded,
  path
}: Props) => {
  if (!isCoinDataLoaded) return null

  return (
    <Route
      path={path}
      exact={exact}
      render={(matchProps) => (
        <MainWrapper>
          <Wrapper>
            {header && <Header>{header}</Header>}
            <Content>
              <Component {...matchProps} />
            </Content>
            {footer && <Footer>{footer}</Footer>}
          </Wrapper>
        </MainWrapper>
      )}
    />
  )
}

const mapStateToProps = (state) => ({
  isCoinDataLoaded: selectors.core.data.coins.getIsCoinDataLoaded(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  component: ComponentType<any>
  exact?: boolean
  footer?: JSX.Element
  header?: JSX.Element
  pageTitle?: string
  path: string
}

export default connector(PluginLayout)
