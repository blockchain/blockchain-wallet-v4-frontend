import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { bindActionCreators, compose } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutHeader,
  FlyoutSubHeader
} from 'components/Flyout/Layout'
import CoinAccountListOption from 'components/Form/CoinAccountListOption'
import TextBox from 'components/Form/TextBox'
import { actions } from 'data'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/components/swap/types'

import { Props as OwnProps } from '..'
import { REQUEST_FORM } from '../model'
import { RequestSteps } from '../types'
import { getData } from './selectors'

const HeaderContent = styled.div`
  position: relative;
`
const ResultsText = styled(Text)`
  position: absolute;
  bottom: -24px;
  left: 0;
`
const InputContainer = styled.div`
  margin-top: 24px;
  position: relative;
`
const StyledIcon = styled(Icon)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
`
const NoAccounts = styled.div`
  border-top: ${(props) => `1px solid ${props.theme.grey000}`};
  padding: 16px 40px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > div {
    display: flex;
    align-items: center;
  }
`
const PlusIconContainer = styled.div`
  background-color: ${(props) => props.theme.green100};
  padding: 2px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`
class RequestCoinSelect extends React.PureComponent<Props> {
  render() {
    const { data, formActions, formValues, handleClose, setStep, walletCurrency } = this.props

    const { coinfig: ethCoinfig } = window.coins.ETH

    const Row = ({ data: rowData, index, key, style }) => {
      const account = rowData[index]

      return (
        <div style={style}>
          <CoinAccountListOption
            key={key}
            account={account}
            coin={account.coin}
            onClick={() => {
              if (account.type === SwapBaseCounterTypes.CUSTODIAL && !data.isAtLeastTier1) {
                setStep(RequestSteps.IDV_INTRO)
              } else {
                formActions.change(REQUEST_FORM, 'selectedAccount', account)
                formActions.change(REQUEST_FORM, 'step', RequestSteps.SHOW_ADDRESS)
              }
            }}
            walletCurrency={walletCurrency}
          />
        </div>
      )
    }

    return (
      <FlyoutContainer>
        <FlyoutHeader onClick={handleClose} data-e2e='ReceiveCryptoFlyout' mode='close'>
          <Icon name='arrow-bottom-right' color='blue600' size='24px' />
        </FlyoutHeader>
        <FlyoutSubHeader
          data-e2e='receiveCryptoSubHeader'
          title={
            <Text size='24px' color='grey900' weight={600}>
              <FormattedMessage
                id='modals.requestcrypto.coinselect.title'
                defaultMessage='Receive Crypto'
              />
            </Text>
          }
          subTitle={
            <HeaderContent>
              <Text size='16px' color='grey600' weight={500}>
                <FormattedMessage
                  id='modals.requestcrypto.coinselect.subtitle'
                  defaultMessage='Select and share your address or QR code to receive crypto from anyone around the world.'
                />
              </Text>
              <InputContainer>
                <Field name='coinSearch' type='text' placeholder='Search' component={TextBox} />
                <StyledIcon color='grey200' name='magnifier' />
              </InputContainer>
              {formValues.coinSearch && (
                <ResultsText size='12px' color='grey600' weight={600}>
                  {data.accounts.length ? (
                    <>
                      {data.accounts.length}{' '}
                      <FormattedMessage id='copy.results' defaultMessage='Results' />
                    </>
                  ) : (
                    <FormattedMessage id='copy.no_results' defaultMessage='No Results' />
                  )}
                </ResultsText>
              )}
            </HeaderContent>
          }
        />
        <FlyoutContent mode='top'>
          {data.accounts.length ? (
            <AutoSizer>
              {({ height, width }) => (
                <List
                  className='List'
                  height={height}
                  itemData={data.accounts}
                  itemCount={data.accounts.length}
                  itemSize={74}
                  width={width}
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
          ) : (
            <NoAccounts
              role='button'
              onClick={() => {
                formActions.change(REQUEST_FORM, 'selectedAccount', data.ethAccount)
                formActions.change(REQUEST_FORM, 'step', RequestSteps.SHOW_ADDRESS)
              }}
            >
              <div>
                <PlusIconContainer>
                  <Icon name='plus-in-circle-filled' color='green600' size='24px' />
                </PlusIconContainer>
                <div>
                  <Text size='16px' color='grey900' weight={600}>
                    <FormattedMessage
                      id='copy.receive_any_erc20'
                      defaultMessage='Receive Any Erc20 Token'
                    />
                  </Text>
                  <Text size='14px' color='grey800' weight={500} style={{ marginTop: '2px' }}>
                    <FormattedMessage
                      id='copy.view_eth_addr'
                      defaultMessage='View Your {eth} Address'
                      values={{
                        eth: ethCoinfig.name
                      }}
                    />
                  </Text>
                </div>
              </div>
              <Icon name='chevron-right' size='32px' color='grey400' />
            </NoAccounts>
          )}
        </FlyoutContent>
      </FlyoutContainer>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
const enhance = compose(connector)

type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    handleAccountChange: (account: SwapAccountType) => void
    handleClose: () => void
    setStep: (step: RequestSteps) => void
  }

export default enhance(RequestCoinSelect)
