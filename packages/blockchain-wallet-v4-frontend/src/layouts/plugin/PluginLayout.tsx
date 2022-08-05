import React, { ComponentType, useEffect, useState } from 'react'
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import {
  getSessionPayload,
  isSessionActive,
  setSelectedAddress
} from 'plugin/internal/chromeStorage'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

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

const ethOnlyPaths = ['/plugin/activity', '/plugin/nft']

const PluginLayout = (props: Props) => {
  const { component: Component, exact = false, footer, header, path, routerActions } = props

  const [isLoading, setLoading] = useState(true)

  const dispatch = useDispatch()

  const isAuthenticated = useSelector(
    (state: RootState) => selectors.auth.isAuthenticated(state) as boolean
  )

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(false)
      return
    }

    const setup = async () => {
      const wrapper = await getSessionPayload()

      if (!wrapper) {
        await chrome.tabs.create({ url: chrome.runtime.getURL('index-tab.html#/login') })
        window.close()
      } else {
        dispatch(actions.core.wallet.setWrapper(wrapper))
      }

      const isPluginAuthenticated = await isSessionActive()

      if (!isPluginAuthenticated) {
        await chrome.storage.session.clear()
        await chrome.tabs.create({ url: chrome.runtime.getURL('index-tab.html#/login') })
        window.close()
      } else {
        if (window.location.pathname !== '/plugin/coinslist') {
          routerActions.push('/plugin/coinslist')
        }
        dispatch(actions.components.plugin.autoLogin())
        setLoading(false)
      }
    }

    setup()
  }, [dispatch, isAuthenticated, routerActions])

  const walletAddress = useSelector((state) =>
    selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
  )

  useEffect(() => {
    if (!walletAddress || isLoading) return
    setSelectedAddress(walletAddress)
  }, [walletAddress, isLoading])

  const selectedAccount = useSelector((state) => selectors.cache.getCache(state).selectedAccount)

  const isEthAccountSelected =
    selectedAccount && selectedAccount[0] && selectedAccount[0].baseCoin === 'ETH'

  if (!isEthAccountSelected && ethOnlyPaths.includes(path)) {
    routerActions.push('/plugin/coinslist')
  }

  const isCoinDataLoaded = useSelector((state) =>
    selectors.core.data.coins.getIsCoinDataLoaded(state)
  )

  if (isLoading || !isCoinDataLoaded) return <></>

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
            {footer && isEthAccountSelected && <Footer>{footer}</Footer>}
          </Wrapper>
        </MainWrapper>
      )}
    />
  )
}

const mapDispatchToProps = (dispatch) => ({
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  component: ComponentType<any>
  exact?: boolean
  footer?: JSX.Element
  header?: JSX.Element
  pageTitle?: string
  path: string
}

export default connector(PluginLayout)
