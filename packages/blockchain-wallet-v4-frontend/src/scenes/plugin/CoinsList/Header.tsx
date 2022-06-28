import React, { memo } from 'react'
import { connect } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowUpRight, IconDownload } from '@blockchain-com/icons'
import styled from 'styled-components'

import { IconButton, SkeletonRectangle, Text, TooltipIcon } from 'blockchain-info-components'
import { getTotalBalance } from 'components/Balances/total/selectors'
import { Flex } from 'components/Flex'
import { selectors } from 'data'

const HeaderWrapper = styled.div`
  height: 207px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const IconButtonStyled = styled(IconButton)`
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.white};
  border-color: ${(p) => p.theme.white};

  svg {
    fill: ${(props) => props.theme.exchangeLogin};
  }

  span {
    margin-right: 0 !important;
  }
`

const ButtonWrapper = styled.div`
  text-align: center;

  & > *:first-child {
    margin-bottom: 5px;
  }
`

const Header = (props: any) => {
  const balance = props.data.cata({
    Failure: () => (
      <Text weight={700} size='24px' color='grey200'>
        Error
      </Text>
    ),
    Loading: () => <SkeletonRectangle width='120px' height='25px' />,
    NotAsked: () => <SkeletonRectangle width='120px' height='25px' />,
    Success: (val) => <>{val.totalBalance}</>
  })
  return (
    <HeaderWrapper data-testid='coinview-header'>
      <Text style={{ margin: '20px 0' }} color='white' size='40px' weight={500}>
        {balance}
      </Text>
      <Flex justifyContent='center' gap={24}>
        <ButtonWrapper>
          <IconButtonStyled
            padding='0'
            name='receive'
            rounded
            width='40px'
            height='40px'
            data-e2e='coinview-header-receive-btn'
          >
            <Icon label=''>
              <IconDownload />
            </Icon>
          </IconButtonStyled>
          <Text color='white' size='10px' weight={500}>
            Receive
          </Text>
        </ButtonWrapper>
        <ButtonWrapper>
          <IconButtonStyled
            padding='0'
            name='IconArrowUpRight'
            rounded
            width='40px'
            height='40px'
            data-e2e='coinview-header-send-btn'
          >
            <Icon label='IconArrowUpRight'>
              <IconArrowUpRight />
            </Icon>
          </IconButtonStyled>
          <Text color='white' size='10px' weight={500}>
            Send
          </Text>
        </ButtonWrapper>
      </Flex>
    </HeaderWrapper>
  )
}

const mapStateToProps = (state) => ({
  data: getTotalBalance(state),
  userCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD'),
  walletAddress: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

export default connect(mapStateToProps, null)(Header)
