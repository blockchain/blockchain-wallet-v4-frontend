import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDownV2, IconChevronUp, IconChevronUpV2 } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from '@reduxjs/toolkit'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Spacer from 'components/Spacer'
import { actions } from 'data'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
`

const Popout = styled.div`
  position: absolute;
  background: ${(props) => props.theme.white};
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 8px;
  z-index: 100;
  top: 48px;
`

const PopoutItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${(props) => props.theme.grey100};
  &:last-child {
    border-bottom: 0;
  }
`

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 4px;
  padding: 4px;
  border: 1px solid ${(props) => props.theme.grey100};
  background: ${(props) => props.theme.white};
  &:hover {
    border: 1px solid ${(props) => props.theme.blue600};
    background: 1px solid ${(props) => props.theme.blue000};
  }
`

const AppSwitcher: React.FC<Props> = ({ routerActions }) => {
  return (
    <Wrapper>
      <Spacer style={{ marginRight: '12px' }} height='24px' />
      <Flex>
        <Text cursor='pointer' weight={600} color='blue600' size='14px'>
          Wallet
        </Text>
        <IconWrapper>
          <Icon label='up'>
            <IconChevronUpV2 />
          </Icon>
          <Icon label='down'>
            <IconChevronDownV2 />
          </Icon>
        </IconWrapper>
      </Flex>
      <Popout>
        <PopoutItem>Wallet</PopoutItem>
        <PopoutItem>NFTs</PopoutItem>
      </Popout>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default AppSwitcher as React.FC<{}>
