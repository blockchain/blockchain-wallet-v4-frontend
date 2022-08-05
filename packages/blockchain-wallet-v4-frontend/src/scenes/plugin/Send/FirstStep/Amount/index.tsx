import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions, model } from 'data'

import FiatConverterContainer from './ConverterContainer'

const AmountWrapper = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  background: transparent;
`

const Label = styled(Text)`
  margin-top: 35px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.grey400};
`

const ConverterWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
`
const CurrencyWrapper = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`

const Amount: React.FC<Props> = ({ closeNotEnoughCoinsTooltip, coin }) => {
  return (
    <AmountWrapper>
      <Label>
        <FormattedMessage id='plugin.send.amount_label' defaultMessage='Amount' />
      </Label>
      <CurrencyWrapper>
        <ConverterWrapper>
          <Field
            name='amount'
            component={FiatConverterContainer}
            coin={coin}
            closeNotEnoughCoinsTooltip={closeNotEnoughCoinsTooltip}
            data-e2e={`plugin${coin}Send`}
            errorBottom
            disabled={false}
          />
        </ConverterWrapper>
      </CurrencyWrapper>
    </AmountWrapper>
  )
}

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  closeNotEnoughCoinsTooltip: () => void
  coin: string
}

type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: model.components.sendEth.FORM
  }),
  connector
)
export default enhance(Amount) as React.ComponentType<OwnProps>
