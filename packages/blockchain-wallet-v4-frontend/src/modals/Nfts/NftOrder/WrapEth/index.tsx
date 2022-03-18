import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { Remote } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { GasDataI } from '@core/network/api/nfts/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import { getEthBalance } from 'components/Balances/nonCustodial/selectors'
import { BlueCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { FlyoutWrapper, StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import { Form, NumberBox } from 'components/Form'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { required } from 'services/forms'

import { StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import WrapEthFees from './fees'

const WrapEth: React.FC<Props> = (props) => {
  const { ethBalanceR, formActions, formValues, nftActions, orderFlow } = props
  const ethBalance = ethBalanceR.getOrElse(new BigNumber(0))
  const fee = orderFlow.fees.getOrElse({ gasPrice: 0, totalFees: 0 } as GasDataI)
  const max = Math.max(0, ethBalance.minus(fee.gasPrice * fee.totalFees).toNumber())
  const gasData = orderFlow.fees.getOrElse({} as GasDataI)

  const disabled = !Remote.Success.is(orderFlow.fees)

  return (
    <>
      <div style={{ position: 'relative' }} />
      <StickyHeaderWrapper>
        <FlyoutHeader
          data-e2e='wrapEthHeader'
          mode='back'
          onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER })}
        >
          Wrap Eth
        </FlyoutHeader>
        <FlyoutWrapper style={{ paddingTop: 0 }}>
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
            <Icon size='52px' name='ETH' />
            <Icon size='52px' name='arrow-right' />
            <Icon size='52px' name='WETH' />
          </div>
        </FlyoutWrapper>
      </StickyHeaderWrapper>
      <Form>
        <Row>
          <Title>
            <FormattedMessage
              id='scenes.wallet.menutop.balance.totalbalance'
              defaultMessage='Total Balance'
            />
          </Title>
          <Value>
            <div style={{ display: 'flex' }}>
              <FiatDisplay coin='ETH' size='14px' weight={600}>
                {ethBalance}
              </FiatDisplay>
              &nbsp;-&nbsp;
              <CoinDisplay coin='ETH' size='14px' weight={600}>
                {ethBalance}
              </CoinDisplay>
            </div>
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.deposit' defaultMessage='Deposit' />
          </Title>
          <Value>
            <Field name='amount' component={NumberBox} validate={[required]} />
            <div style={{ display: 'flex', marginTop: '12px' }}>
              <BlueCartridge
                cursor
                role='button'
                onClick={() =>
                  formActions.change(
                    'wrapEth',
                    'amount',
                    convertCoinToCoin({ baseToStandard: true, coin: 'ETH', value: max })
                  )
                }
              >
                <FormattedMessage id='copy.max' defaultMessage='Max' />
                &nbsp;
                <FiatDisplay cursor color='blue600' coin='ETH' size='14px' weight={600}>
                  {max}
                </FiatDisplay>
                &nbsp;-&nbsp;
                <CoinDisplay cursor color='blue600' coin='ETH' size='14px' weight={600}>
                  {max}
                </CoinDisplay>
              </BlueCartridge>
            </div>
          </Value>
        </Row>
        <Row>
          <Title>
            <b>
              <FormattedMessage id='copy.receive' defaultMessage='Receive' />
            </b>
          </Title>
          <Value>
            <div style={{ display: 'flex' }}>
              <Text size='14px' color='black' weight={600}>
                {formValues?.amount || 0} WETH -&nbsp;
              </Text>
              <FiatDisplay size='12px' color='grey600' weight={600} coin='WETH'>
                {convertCoinToCoin({
                  baseToStandard: false,
                  coin: 'WETH',
                  value: formValues?.amount || 0
                })}
              </FiatDisplay>
            </div>
          </Value>
        </Row>
        <StickyCTA>
          <WrapEthFees {...props} />
          <Button
            disabled={disabled}
            fullwidth
            jumbo
            nature='primary'
            data-e2e='wrapEth'
            onClick={() => nftActions.wrapEth({ amount: formValues.amount, gasData })}
          >
            Wrap ETH
          </Button>
        </StickyCTA>
      </Form>
    </>
  )
}

const mapStateToProps = (state) => ({
  ethBalanceR: getEthBalance(state),
  formValues: selectors.form.getFormValues('wrapEth')(state) as { amount: string }
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    form: 'wrapEth'
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(WrapEth) as React.FC<OwnProps>
