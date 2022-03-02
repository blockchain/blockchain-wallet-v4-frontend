import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { Icon, Text } from 'blockchain-info-components'
import { Title } from 'components/Flyout'
import { Row, Value } from 'components/Flyout/model'
import { Form, NumberBox } from 'components/Form'
import { selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { required } from 'services/forms'

import { StickyCTA } from '../../components'
import { Props as OwnProps } from '..'

const WrapEth: React.FC<Props> = (props) => {
  const { close, formValues, nftActions } = props

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Icon
          onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER })}
          name='arrow-left'
          cursor
          role='button'
          style={{ left: '40px', position: 'absolute', top: '40px' }}
        />
        <Icon
          onClick={() => close()}
          name='close'
          cursor
          role='button'
          style={{ position: 'absolute', right: '40px', top: '40px' }}
        />
      </div>
      <Text>Wrap Eth</Text>
      <Form>
        <Row>
          <Title>
            <b>
              <FormattedMessage id='copy.amount' defaultMessage='Amount' />
            </b>
          </Title>
          <Value>
            <Field
              onChange={(e) =>
                props.nftActions.fetchFees({
                  operation: GasCalculationOperations.WrapEth
                })
              }
              name='amount'
              component={NumberBox}
              validate={[required]}
            />
          </Value>
          <Text>Amount {formValues.amount} ETH</Text>
        </Row>
      </Form>
      <StickyCTA>{/* <WrapEthFees {...props} asset={val} /> */}</StickyCTA>
    </>
  )
}

const mapStateToProps = (state) => ({
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
