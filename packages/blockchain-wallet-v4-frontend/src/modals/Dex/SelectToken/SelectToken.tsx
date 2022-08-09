import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCloseCircleV2, IconSearch } from '@blockchain-com/icons'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Field, formValueSelector, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { CoinType } from '@core/types'
import { Icon as BcIcon, Modal, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import TextBox from 'components/Form/TextBox'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { DexSwapForm, DexSwapSideEnum, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import Loading from './SelectToken.loading'
import { getData } from './SelectToken.selectors'

const FORM_NAME = 'dexTokenSelect'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`
const CloseIcon = styled.div`
  > :first-child {
    cursor: pointer;
  }
`
const TextFilterWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  margin: 16px 0;
`
const SearchIconWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 16px;
`
const NoResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 42px 0 20px;
`
const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 350px;
  overflow-y: scroll;
`
const TokenRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 16px 0;
  &:hover {
    cursor: pointer;
  }
`
const TokenIcon = styled(BcIcon)`
  width: 40px;
`
const TokenDetails = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`
const TokenBalanceColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`

const DexSelectToken = ({
  formActions,
  modalActions,
  position,
  swapFormValues,
  swapSide,
  tokenListR,
  tokenSearch,
  total,
  walletCurrency
}: Props) => {
  const onTokenSelect = (token) => {
    formActions.change('dexSwap', swapSide, token)
    // get opposite side of pair
    const oppositeSide =
      DexSwapSideEnum.BASE === swapSide ? DexSwapSideEnum.COUNTER : DexSwapSideEnum.BASE
    // if same token would now be on both sides of swap, clear other side of swap
    if (swapFormValues?.[oppositeSide] === token) {
      formActions.change('dexSwap', oppositeSide, undefined)
    }
    modalActions.closeModal()
  }

  return (
    <Modal size='small' position={position} total={total} style={{ padding: '24px' }}>
      <Header>
        <Text color='textBlack' lineHeight='135%' size='24px' weight={600}>
          <FormattedMessage id='copy.select_token' defaultMessage='Select Token' />
        </Text>
        <CloseIcon
          onClick={() => {
            modalActions.closeModal()
          }}
        >
          <Icon label='close' size='md' color='grey400'>
            <IconCloseCircleV2 />
          </Icon>
        </CloseIcon>
      </Header>
      <TextFilterWrapper>
        <Field
          component={TextBox}
          height='48px'
          data-e2e='searchTokenInput'
          name='search'
          placeholder='Search Symbol or Address'
        />
        <SearchIconWrapper>
          <Icon label='close' size='md' color='grey400'>
            <IconSearch />
          </Icon>
        </SearchIconWrapper>
      </TextFilterWrapper>
      {tokenListR.cata({
        Failure: (error) => <span>{error}</span>,
        Loading: () => <Loading />,
        NotAsked: () => <Loading />,
        Success: (tokenList) => {
          return tokenSearch?.length && !tokenList.length ? (
            <NoResultsWrapper>
              <Text color='textBlack' size='18px'>
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
                      <div>
                        <Text color='textBlack' size='16px' weight={600} lineHeight='150%'>
                          {token.name}
                        </Text>
                        <Text color='grey600' size='14px' weight={500} lineHeight='20px'>
                          {token.displaySymbol}
                        </Text>
                      </div>
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

const mapStateToProps = (state: RootState) => ({
  swapFormValues: selectors.form.getFormValues('dexSwap')(state) as DexSwapForm,
  tokenListR: getData(state),
  tokenSearch: formValueSelector(FORM_NAME)(state, 'textFilter'),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> &
  InjectedFormProps & {
    position: number
    swapSide: DexSwapSideEnum
    total: number
  }

const enhance = compose<React.ComponentType>(
  ModalEnhancer(ModalName.DEX_TOKEN_SELECT),
  connector,
  reduxForm({
    form: FORM_NAME
  })
)

export default enhance(DexSelectToken)
