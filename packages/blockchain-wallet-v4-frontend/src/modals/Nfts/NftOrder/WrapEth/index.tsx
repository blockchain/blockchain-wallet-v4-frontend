import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { Button, Icon } from 'blockchain-info-components'
import { getEthBalance } from 'components/Balances/nonCustodial/selectors'
import { FlyoutWrapper, StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import { Form, NumberBox } from 'components/Form'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { required } from 'services/forms'

import { StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import WrapEthFees from './fees'

const WrapEth: React.FC<Props> = (props) => {
  const { ethBalanceR, formValues, nftActions } = props
  const ethBalance = ethBalanceR.getOrElse(new BigNumber(0))

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
            <b>
              <FormattedMessage id='copy.deposit' defaultMessage='Deposit' />
            </b>
          </Title>
          <Value>
            <Field name='amount' component={NumberBox} validate={[required]} />
          </Value>
        </Row>
        <Row>
          <Title>
            <b>
              <FormattedMessage id='copy.receive' defaultMessage='Receive' />
            </b>
          </Title>
          <Value>{formValues?.amount || 0} WETH</Value>
        </Row>
      </Form>
      <StickyCTA>
        <WrapEthFees {...props} />
        <Button fullwidth jumbo nature='primary' data-e2e='wrapEth'>
          Wrap ETH
        </Button>
      </StickyCTA>
    </>
  )
}

const mapStateToProps = (state) => ({
  ethBalanceR: getEthBalance(state),
  formValues: selectors.form.getFormValues('wrapEth')(state) as { amount: string }
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    form: 'wrapEth'
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(WrapEth) as React.FC<OwnProps>
