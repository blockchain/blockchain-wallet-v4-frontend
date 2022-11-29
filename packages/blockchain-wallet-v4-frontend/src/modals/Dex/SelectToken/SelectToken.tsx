import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import {
  Flex,
  IconCloseCircleV2,
  IconSearch,
  Input,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import { compose } from 'redux'

import { CoinType } from '@core/types'
import { Modal } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { actions, model, selectors } from 'data'
import { DexSwapForm, DexSwapSide, DexSwapSideFields, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { getDexTokensList } from './SelectToken.selectors'
import {
  CloseIcon,
  Loading,
  NoResultsWrapper,
  SearchIconWrapper,
  TextFilterWrapper,
  TokenBalanceColumn,
  TokenDetails,
  TokenIcon,
  TokenList,
  TokenRow
} from './styles'

const { DEX_SWAP_FORM } = model.components.dex

type Props = {
  position: number
  swapSide: DexSwapSide
  total: number
}

const DexSelectToken = ({ position, swapSide, total }: Props) => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()

  const [search, setSearch] = useState('')

  const dexTokensList = useSelector(getDexTokensList)
  const swapFormValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const walletCurrency = useSelector(selectors.core.settings.getCurrency).getOrElse('USD')

  const onTokenSelect = (token) => {
    // set selected token
    dispatch(actions.form.change(DEX_SWAP_FORM, DexSwapSideFields[swapSide], token))

    // if same token would now be on both sides of swap, clear other side of swap
    const oppositeSide = swapSide === 'BASE' ? 'COUNTER' : 'BASE'
    if (swapFormValues[DexSwapSideFields[oppositeSide]] === token) {
      dispatch(actions.form.change(DEX_SWAP_FORM, DexSwapSideFields[oppositeSide], undefined))
    }

    dispatch(actions.modals.closeModal())
  }

  const onClose = () => {
    dispatch(actions.modals.closeModal())
  }

  return (
    <Modal size='small' position={position} total={total} style={{ padding: '24px' }}>
      <Flex justifyContent='space-between'>
        <Text color={SemanticColors.body} variant='title2'>
          <FormattedMessage id='copy.select_token' defaultMessage='Select Token' />
        </Text>
        <CloseIcon onClick={onClose}>
          <IconCloseCircleV2 label='close' size='medium' color={PaletteColors['grey-400']} />
        </CloseIcon>
      </Flex>
      <TextFilterWrapper>
        <Input
          id='dexCoinSearch'
          state='default'
          type='text'
          placeholder={formatMessage({
            defaultMessage: 'Search Symbol or Address',
            id: 'dex.searCoin.placeholder'
          })}
        />
        <SearchIconWrapper>
          <IconSearch label='close' size='medium' color={PaletteColors['grey-400']} />
        </SearchIconWrapper>
      </TextFilterWrapper>
      {dexTokensList.cata({
        Failure: (error) => <span>{error}</span>,
        Loading: () => <Loading />,
        NotAsked: () => <Loading />,
        Success: (tokenList) => {
          return search.length && tokenList.length === 0 ? (
            <NoResultsWrapper>
              <Text color={SemanticColors.body} variant='body1'>
                <FormattedMessage id='copy.no_results_found' defaultMessage='No results found!' />
              </Text>
            </NoResultsWrapper>
          ) : (
            <TokenList>
              {tokenList.map((token) => {
                return (
                  <TokenRow
                    key={token.displaySymbol}
                    onClick={() => onTokenSelect(token.displaySymbol)}
                  >
                    <TokenIcon name={token.symbol as CoinType} size='24px' />
                    <TokenDetails>
                      <Flex flexDirection='column'>
                        <Text color={SemanticColors.body} variant='body2'>
                          {token.name}
                        </Text>
                        <Text color={SemanticColors.body} variant='paragraph1'>
                          {token.displaySymbol}
                        </Text>
                      </Flex>
                      <TokenBalanceColumn>
                        <FiatDisplay
                          coin={token.symbol}
                          color='textBlack'
                          currency={walletCurrency}
                          cursor='pointer'
                          data-e2e={`${token.displaySymbol}FiatBalance`}
                          lineHeight='150%'
                          loadingHeight='20px'
                          size='16px'
                          weight={600}
                        >
                          {token.balance}
                        </FiatDisplay>
                        <CoinDisplay
                          coin={token.symbol}
                          color='grey600'
                          cursor='pointer'
                          data-e2e={`${token.displaySymbol}Balance`}
                          lineHeight='20px'
                          size='14px'
                          weight={500}
                        >
                          {token.balance}
                        </CoinDisplay>
                      </TokenBalanceColumn>
                    </TokenDetails>
                  </TokenRow>
                )
              })}
            </TokenList>
          )
        }
      })}
    </Modal>
  )
}

export default compose<React.ComponentType>(ModalEnhancer(ModalName.DEX_TOKEN_SELECT))(
  DexSelectToken
)
