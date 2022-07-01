import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDown } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Exchange } from '@core'
import { CoinType } from '@core/types'
import { Icon as TokenIcon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import NumberBox from 'components/Form/NumberBox'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { DexSwapForm, DexSwapSideEnum, ModalName } from 'data/types'

import * as animations from './SwapPair.animations'

const PairWrapper = styled.div<{ animate: boolean; swapSide: DexSwapSideEnum }>`
  height: 48px;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 16px;
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${({ animate, swapSide }) =>
    swapSide === DexSwapSideEnum.BASE
      ? animate
        ? animations.swingOutBottomAnimation
        : animations.swingInBottomAnimation
      : animate
      ? animations.swingOutTopAnimation
      : animations.swingInTopAnimation}
`
const PairValueColumn = styled.div<{ areValuesEntered: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: ${({ areValuesEntered }) => (areValuesEntered ? 'space-between' : 'center')};
  align-items: flex-start;
  > :first-child {
    padding-top: ${({ areValuesEntered }) => (areValuesEntered ? '2px' : '0')};
  }
`
const PairSelectColumn = styled.div<{ isCoinSelected: boolean }>`
  display: flex;
  flex-direction: ${({ isCoinSelected }) => (isCoinSelected ? 'column' : 'row')};
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
const TokenSelectRowEmpty = styled(TokenSelectRow)`
  justify-content: space-between;
`
const AmountInput = styled(NumberBox)`
  max-height: 24px;
  > input {
    background-color: initial;
    border: none;
    color: ${(props) => props.theme.textBlack};
    line-height: 135%;
    font-size: 24px;
    font-weight: 600;
    min-height: 24px;
    height: 24px;
    max-height: 24px;
    padding: 0;
    &:focus {
      background-color: initial;
      border: none;
    }
    ::placeholder {
      color: ${(props) => props.theme.textBlack};
      line-height: 200%;
      font-size: 24px;
      font-weight: 600;
    }
  }
`

const DexSwapPair = ({
  animate,
  balance,
  coin,
  formValues,
  modalActions,
  swapSide,
  walletCurrency
}: Props) => {
  const amountInputField = `${swapSide}Amount`
  const amountInputValue = formValues?.[amountInputField]

  return (
    <PairWrapper animate={animate} swapSide={swapSide}>
      <PairValueColumn areValuesEntered={!!amountInputValue && !!coin}>
        <Field
          component={AmountInput}
          data-e2e={`${swapSide}AmountField`}
          placeholder='0.00'
          name={amountInputField}
          validate={[]}
        />
        {coin && amountInputValue && (
          <FiatDisplay
            coin={coin}
            currency={walletCurrency}
            color='grey600'
            lineHeight='12px'
            loadingHeight='14px'
            size='14px'
            weight={500}
          >
            {Exchange.convertCoinToCoin({
              baseToStandard: false,
              coin: 'ETH',
              value: amountInputValue
            })}
          </FiatDisplay>
        )}
      </PairValueColumn>
      <PairSelectColumn isCoinSelected={!!coin}>
        <TokenSelectWrapper
          role='button'
          onClick={() => {
            modalActions.showModal(ModalName.DEX_TOKEN_SELECT, { origin: 'Dex', swapSide })
          }}
        >
          {coin && (
            <>
              <TokenIcon name={coin} size='16px' />
              <TokenSelectRow>
                <Text color='textBlack' lineHeight='18px' size='12px' weight={600}>
                  {coin}
                </Text>
                <Icon label='select dropdown' color='grey400' size='sm'>
                  <IconChevronDown />
                </Icon>
              </TokenSelectRow>
            </>
          )}
          {!coin && (
            <TokenSelectRowEmpty>
              <Text color='textBlack' lineHeight='18px' size='12px' weight={600}>
                <FormattedMessage id='buttons.select' defaultMessage='Select' />
              </Text>
              <Icon label='select dropdown' color='grey400' size='sm'>
                <IconChevronDown />
              </Icon>
            </TokenSelectRowEmpty>
          )}
        </TokenSelectWrapper>
        {coin && (
          <CoinDisplay coin={coin} color='grey600' size='10px' weight={500}>
            {balance}
          </CoinDisplay>
        )}
      </PairSelectColumn>
    </PairWrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  animate: boolean
  balance?: number
  coin?: CoinType
  formValues: DexSwapForm
  swapSide: DexSwapSideEnum
}

export default connector(DexSwapPair)
