import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle, IconChevronDownV2, IconChevronUpV2 } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from '@reduxjs/toolkit'
import { AnimatePresence, motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { WalletOptionsType } from '@core/redux/walletOptions/types'
import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Spacer from 'components/Spacer'
import { actions, selectors } from 'data'
import { UserDataType } from 'data/modules/profile/types'
import { useOnClickOutside } from 'services/misc'
import { useMedia } from 'services/styles'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  height: 24px;
`

const Popout = styled(motion.div)`
  position: absolute;
  background: ${(props) => props.theme.white};
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 8px;
  z-index: 100;
  left: -8px;
  top: 32px;
`

const PopoutItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  white-space: nowrap;
  border-bottom: 1px solid ${(props) => props.theme.grey100};
  cursor: pointer;
  &:last-child {
    border-bottom: 0;
  }
`

const IconWrapper = styled.div<{ nfts: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 4px;
  height: 20px;
  border: 1px solid ${(props) => props.theme.grey100};
  background: ${(props) => props.theme.white};
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    ${(props) =>
      props.nfts === 'nfts'
        ? css`
            border: 1px solid ${(props) => props.theme.purple600};
            background: ${(props) => props.theme.purple000};
            * {
              fill: ${(props) => props.theme.purple600};
            }
          `
        : css`
            border: 1px solid ${(props) => props.theme.blue600};
            background: ${(props) => props.theme.blue000};
            * {
              fill: ${(props) => props.theme.blue600};
            }
          `}
  }
`

// order of the object determines rendering order of dropdown
/* eslint-disable sort-keys, sort-keys-fix/sort-keys-fix */
const appConfigMap = {
  wallet: {
    color: 'blue600',
    displayName: 'Wallet',
    name: 'wallet',
    route: '/home',
    subtitle: () => (
      <FormattedMessage id='navbar.wallet.desc' defaultMessage='Buy, Sell & Swap Crypto' />
    ),
    title: () => <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
  },
  nfts: {
    color: 'purple600',
    displayName: 'NFTs',
    name: 'nfts',
    route: '/nfts/home',
    subtitle: () => (
      <FormattedMessage id='navbar.nfts.desc' defaultMessage='Buy, Sell & Discover NFTs' />
    ),
    title: () => <FormattedMessage id='navbar.nfts.title' defaultMessage='NFT Marketplace' />
  },
  dex: {
    color: 'blue600',
    displayName: 'DEX',
    name: 'dex',
    route: '/dex',
    subtitle: () => <FormattedMessage id='copy.dex' defaultMessage='Decentralized Exchange' />,
    title: () => 'DEX'
  }
}
/* eslint-enable sort-keys, sort-keys-fix/sort-keys-fix */

const getAppConfig = () => {
  if (window.location.hash.includes('dex')) {
    return appConfigMap.dex
  }
  if (window.location.hash.includes('nfts')) {
    return appConfigMap.nfts
  }
  return appConfigMap.wallet
}

const AppSwitcher: React.FC<Props> = ({ isDexEnabled, routerActions }) => {
  const isTablet = useMedia('tabletL')
  const ref = useRef(null)
  const [isActive, setIsActive] = useState<boolean>(false)
  const currentApp = getAppConfig()

  useOnClickOutside(ref, () => setIsActive(false))

  const toggleIsActive = () => {
    setIsActive((isActive) => !isActive)
  }

  return (
    <Wrapper ref={ref}>
      {isTablet ? null : <Spacer style={{ marginRight: '12px' }} height='24px' />}
      {/* @ts-ignore */}
      <Flex alignItems='center' gap={8} onClick={toggleIsActive}>
        {isTablet ? null : (
          <Text cursor='pointer' weight={600} color={currentApp.color} size='14px'>
            {currentApp.displayName}
          </Text>
        )}
        <IconWrapper
          nfts={currentApp.name}
          role='button'
          className={`${currentApp.name} ${isActive ? 'active' : ''}`}
        >
          <Icon label='up' size='sm'>
            <IconChevronUpV2 />
          </Icon>
          <Icon label='down' size='sm'>
            <IconChevronDownV2 />
          </Icon>
        </IconWrapper>
      </Flex>
      <AnimatePresence>
        {isActive ? (
          <Popout
            transition={{ duration: 0.3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Object.keys(appConfigMap).map((app: string) => {
              if (!isDexEnabled && app === 'dex') return null
              const appConfig = appConfigMap[app]
              return (
                <PopoutItem
                  key={appConfig.name}
                  role='button'
                  onClick={() => {
                    setIsActive(false)
                    routerActions.push(appConfig.route)
                  }}
                >
                  <Flex flexDirection='column' gap={2}>
                    <Text size='16px' color='black' weight={600}>
                      {appConfig.title()}
                    </Text>
                    <Text size='14px' weight={600}>
                      {appConfig.subtitle()}
                    </Text>
                  </Flex>
                  <Icon
                    label='check'
                    size='sm'
                    color={currentApp.name === appConfig.name ? appConfig.color : 'grey100'}
                  >
                    <IconCheckCircle />
                  </Icon>
                </PopoutItem>
              )
            })}
          </Popout>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  isDexEnabled: selectors.core.walletOptions.getDexProductEnabled(state).getOrElse(false) as boolean
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(AppSwitcher)
