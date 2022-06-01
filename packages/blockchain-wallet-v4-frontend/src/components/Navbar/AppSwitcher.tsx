import React, { useRef, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle, IconChevronDownV2, IconChevronUpV2 } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from '@reduxjs/toolkit'
import { AnimatePresence, motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Spacer from 'components/Spacer'
import { actions } from 'data'
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

const AppSwitcher: React.FC<Props> = ({ routerActions }) => {
  const isTablet = useMedia('tabletL')
  const ref = useRef(null)
  const [isActive, setIsActive] = useState<boolean>(false)
  const app = window.location.hash.includes('nfts') ? 'nfts' : 'wallet'

  useOnClickOutside(ref, () => setIsActive(false))

  const toggleIsActive = () => {
    setIsActive((isActive) => !isActive)
  }

  const mainColor = app === 'nfts' ? 'purple600' : 'blue600'

  return (
    <Wrapper ref={ref}>
      {isTablet ? null : <Spacer style={{ marginRight: '12px' }} height='24px' />}
      {/* @ts-ignore */}
      <Flex alignItems='center' gap={8} onClick={toggleIsActive}>
        {isTablet ? null : (
          <Text cursor='pointer' weight={600} color={mainColor} size='14px'>
            {app === 'nfts' ? 'NFTs' : 'Wallet'}
          </Text>
        )}
        <IconWrapper nfts={app} role='button' className={`${app} ${isActive ? 'active' : ''}`}>
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
            <PopoutItem
              role='button'
              onClick={() => {
                setIsActive(false)
                routerActions.push('/home')
              }}
            >
              <Flex flexDirection='column' gap={2}>
                <Text size='16px' color='black' weight={600}>
                  Wallet
                </Text>
                <Text size='14px' weight={600}>
                  Buy, Sell & Swap Crypto
                </Text>
              </Flex>
              <Icon label='check' size='sm' color={app === 'wallet' ? mainColor : 'grey100'}>
                <IconCheckCircle />
              </Icon>
            </PopoutItem>
            <PopoutItem
              role='button'
              onClick={() => {
                setIsActive(false)
                routerActions.push('/nfts/home')
              }}
            >
              <Flex flexDirection='column' gap={2}>
                <Text size='16px' color='black' weight={600}>
                  NFT Marketplace
                </Text>
                <Text size='14px' weight={600}>
                  Buy, Sell & Discover NFTs
                </Text>
              </Flex>
              <Icon label='check' size='sm' color={app === 'nfts' ? mainColor : 'grey100'}>
                <IconCheckCircle />
              </Icon>
            </PopoutItem>
          </Popout>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(AppSwitcher)
