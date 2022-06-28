import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDown } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { CoinType } from '@core/types'
import { Icon as TokenIcon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { actions } from 'data'
import { ModalName } from 'data/types'

const PairWrapper = styled.div`
  height: 48px;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 16px;
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const PairValueColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`
const PairSelectColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const TokenSelectWrapper = styled.div`
  display: flex;
  width: 100px;
  flex-direction: row;
  align-items: center;
  padding: 6px 8px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.white};
  cursor: pointer;
`
const TokenSelectRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-left: 8px;
`

const DexSwapPair = ({ balance, coin, modalActions }: Props) => {
  return (
    <PairWrapper>
      <PairValueColumn>
        <Text color='textBlack' lineHeight='135%' size='24px' weight={600}>
          0
        </Text>
        <FiatDisplay
          coin='UNI'
          color='grey600'
          currency='USD'
          lineHeight='20px'
          loadingHeight='20px'
          size='14px'
          weight={500}
        >
          {0}
        </FiatDisplay>
      </PairValueColumn>
      <PairSelectColumn>
        <TokenSelectWrapper
          role='button'
          onClick={() => {
            modalActions.showModal(ModalName.DEX_TOKEN_SELECT, { origin: 'Dex' })
          }}
        >
          <TokenIcon name={coin} size='16px' />
          <TokenSelectRow>
            <Text color='textBlack' lineHeight='18px' size='12px' weight={600}>
              {coin}
            </Text>
            <Icon label='select dropdown' color='grey400' size='sm'>
              <IconChevronDown />
            </Icon>
          </TokenSelectRow>
        </TokenSelectWrapper>
        <CoinDisplay coin={coin} color='grey600' size='10px' weight={500}>
          {balance}
        </CoinDisplay>
      </PairSelectColumn>
    </PairWrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  balance: number
  coin: CoinType
}

export default connector(DexSwapPair)
