import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { Icon } from '@blockchain-com/constellation'
import {
  IconBlockchainCircle,
  IconCheckCircle,
  IconCloseCircle,
  IconHome
} from '@blockchain-com/icons'
import { TabMetadata } from 'plugin/internal'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { ConnectStep } from '.'

const ConfirmationWrapper = styled(Flex)`
  height: 100%;
  align-items: stretch;
  flex-direction: column;
`

const IconsWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;
  gap: -30px;
  margin: 30px 0 19px;
  svg {
    position: relative;
    left: 10px;
    &:first-child {
      z-index: 2;
    }
    &:last-child {
      left: 0;
      right: 10px;
    }
  }
`
const AllowList = styled.ul`
  margin: 30px 0 42px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  list-style: none;
  gap: 32px;
`

const AllowListItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 19px;
`

const AllowTitle = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: center;
  color: ${(props) => props.theme.white};
`
const AllowSubtitle = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  text-align: center;
  color: ${(props) => props.theme.grey400};
`
const SiteUrl = styled(Text)`
  margin-bottom: 52px;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  text-align: center;
  color: ${(props) => props.theme.white};
`
const ConnectButton = styled.button`
  height: 48px;
  flex-grow: 1;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
`

const DenyButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter, sans-serif;
  height: 48px;
  flex-grow: 1;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;
  background-color: transparent;
  color: ${(props) => props.theme.white};
  cursor: pointer;
`
const BlockchainIcon = styled(IconBlockchainCircle)`
  color: ${(props) => props.theme.white};
`
const SiteIconContainer = styled('div')`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  overflow: auto;
`
const SiteIcon = styled('img')`
  width: 100%;
`
export const Confirmation: React.FC<{
  metadata: TabMetadata
  setConnectStep: React.Dispatch<React.SetStateAction<ConnectStep>>
}> = ({ metadata, setConnectStep }) => {
  const connect = () => {
    setConnectStep(ConnectStep.Connecting)
  }

  const deny = () => {
    setConnectStep(ConnectStep.InitialScreen)
    window.close()
  }

  return (
    <ConfirmationWrapper>
      <IconsWrapper>
        <BlockchainIcon width='78px' height='78px' />
        {metadata.favicon ? (
          <SiteIconContainer>
            <SiteIcon src={metadata.favicon} alt='icon' />
          </SiteIconContainer>
        ) : (
          <BlockchainIcon width='78px' height='78px' />
        )}
      </IconsWrapper>
      <AllowTitle>
        <FormattedMessage
          id='scenes.plugin.settings.conect_dapp.heading'
          defaultMessage='Connect to website'
        />
      </AllowTitle>
      <SiteUrl>{metadata.origin}</SiteUrl>
      <AllowSubtitle>
        <FormattedMessage
          id='scenes.plugin.settings.conect_dapp.allow.heading'
          defaultMessage='Allow this site to'
        />
      </AllowSubtitle>
      <AllowList>
        <AllowListItem>
          <Icon color='white800' label='AllowListIcon' size='md'>
            <IconHome />
          </Icon>
          <Text size='12px' lineHeight='18px' weight={500}>
            <FormattedMessage
              id='scenes.plugin.settings.connect_dapp.allow.balance'
              defaultMessage='Let it see your wallet balance and activity'
            />
          </Text>
        </AllowListItem>
        <AllowListItem>
          <Icon color='white800' label='AllowListIcon' size='md'>
            <IconCheckCircle />
          </Icon>
          <Text size='12px' lineHeight='18px' weight={500}>
            <FormattedMessage
              id='scenes.plugin.settings.connect_dapp.allow.transactions'
              defaultMessage='Let it send you requests for transactions'
            />
          </Text>
        </AllowListItem>
        <AllowListItem>
          <Icon color='white800' label='AllowListIcon' size='md'>
            <IconCloseCircle />
          </Icon>
          <Text size='12px' lineHeight='18px' weight={500}>
            <FormattedMessage
              id='scenes.plugin.settings.connect_dapp.allow.funds'
              defaultMessage='It cannot move funds without your permission'
            />
          </Text>
        </AllowListItem>
      </AllowList>
      <Flex justifyContent='center'>
        <DenyButton to='/plugin/coinslist' onClick={deny}>
          <FormattedMessage id='scenes.plugin.settings.connect_dapp.deny' defaultMessage='Deny' />
        </DenyButton>
        <ConnectButton onClick={connect}>
          <FormattedMessage
            id='scenes.plugin.settings.connect_dapp.connect'
            defaultMessage='Connect'
          />
        </ConnectButton>
      </Flex>
    </ConfirmationWrapper>
  )
}
