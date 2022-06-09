import React, { memo } from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconReceive, IconSend } from '@blockchain-com/icons'
import styled from 'styled-components'

import { IconButton, Text } from 'blockchain-info-components'
import { getTotalBalance } from 'components/Balances/total/selectors'
import { Flex } from 'components/Flex'
import { selectors } from 'data'

import CoinsList from './CoinsList'

const Wrapper = styled.div`
  height: 100%;
`

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
  background: #65a5ff;
  border-color: #65a5ff;

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

const WalletAddressStyled = styled.div`
  background: #2c3038;
  padding: 3px 14px 3px 10px;
  gap: 5px;
  margin-top: 10px;
  border-radius: 8px;
  text-align: center;
`

const WalletAddress = memo(({ value }: { value: string }) => {
  return (
    <WalletAddressStyled>
      <Text color='grey400'>
        {value.substring(0, 4)}...{value.slice(-4)}
      </Text>
    </WalletAddressStyled>
  )
})

const Header = () => {
  return (
    <HeaderWrapper>
      <WalletAddress value='3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5' />
      <Text style={{ margin: '20px 0' }} color='white' size='40px' weight={500}>
        $9,775.89
      </Text>
      <Flex justifyContent='center' gap={24}>
        <ButtonWrapper>
          <IconButtonStyled
            padding='0'
            name='receive'
            rounded
            width='40px'
            height='40px'
            data-e2e=''
          >
            <Icon label=''>
              <IconReceive />
            </Icon>
          </IconButtonStyled>
          <Text style={{ color: '#65A5FF' }} size='10px' weight={500}>
            Receive
          </Text>
        </ButtonWrapper>
        <ButtonWrapper>
          <IconButtonStyled padding='0' name='' rounded width='40px' height='40px' data-e2e=''>
            <Icon label=''>
              <IconSend />
            </Icon>
          </IconButtonStyled>
          <Text style={{ color: '#65A5FF' }} size='10px' weight={500}>
            Send
          </Text>
        </ButtonWrapper>
      </Flex>
    </HeaderWrapper>
  )
}

const CoinView = () => {
  return (
    <Wrapper>
      <Header />
      <CoinsList />
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  data: getTotalBalance(state),
  userCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

// export default connect(mapStateToProps, null)(CoinView)

export default CoinView
