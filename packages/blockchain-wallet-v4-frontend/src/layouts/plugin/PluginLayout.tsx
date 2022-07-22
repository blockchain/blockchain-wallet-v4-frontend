import React, { ComponentType, useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route, withRouter } from 'react-router-dom'
import { isSessionActive, setSessionExpireTime } from 'plugin/internal/chromeStorage'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'

const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  position: relative;
  background: ${(props) => props.theme.black};
  width: 360px;
  height: 600px;
`

const Header = styled.div`
  box-sizing: border-box;
  position: absolute;
  height: 67px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: ${(props) => props.theme.black};
  top: 0;
  width: 100%;
  padding: 20px;
`

const Content = styled.div`
  padding: 24px;
  box-sizing: border-box;
  height: 100%;
`

const Footer = styled.div`
  position: absolute;
  height: 67px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.black};
  bottom: 0;
  width: 100%;
`

const PluginLayout = (props: Props) => {
  const {
    component: Component,
    exact = false,
    footer,
    header,
    isCoinDataLoaded,
    path,
    routerActions
  } = props

  const [isLoading, setLoading] = useState(true)

  const isReady = isCoinDataLoaded && !isLoading

  const checkAuth = async () => {
    const isAuthenticated = await isSessionActive()
    if (!isAuthenticated) {
      routerActions.push('/login')
    }
  }

  useEffect(() => {
    checkAuth().then(() => {
      setLoading(false)
    })

    return () => {
      setSessionExpireTime()
    }
  }, [])

  if (!isReady) return null

  return (
    <Route
      path={path}
      exact={exact}
      render={(matchProps) => (
        <MainWrapper>
          <Wrapper id='plugin-wrapper'>
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

const mapDispatchToProps = (dispatch) => ({
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  component: ComponentType<any>
  exact?: boolean
  footer?: JSX.Element
  header?: JSX.Element
  pageTitle?: string
  path: string
}

export default connector(PluginLayout)
