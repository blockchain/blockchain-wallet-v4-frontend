import { connect, ConnectedProps } from 'react-redux'
import { reduxForm } from 'redux-form'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { Props as BaseProps } from '..'
import { compose } from 'redux'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { InitSwapFormValuesType } from 'data/components/swap/types'
import { Option, StyledForm, TopText } from '../components'
import { selectors } from 'data'

class EnterAmount extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.swapActions.fetchQuote()
  }

  render () {
    if (
      !this.props.initSwapFormValues?.BASE ||
      !this.props.initSwapFormValues?.COUNTER
    ) {
      return this.props.swapActions.setStep({ step: 'INIT_SWAP' })
    }

    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween={false}>
            <Icon
              role='button'
              name='arrow-left'
              cursor
              size='24px'
              color='grey600'
              onClick={() =>
                this.props.swapActions.setStep({
                  step: 'INIT_SWAP'
                })
              }
            />{' '}
            <Text
              size='20px'
              color='grey900'
              weight={600}
              style={{ marginLeft: '24px' }}
            >
              <FormattedMessage id='copy.new_swap' defaultMessage='New Swap' />
            </Text>
          </TopText>
        </FlyoutWrapper>
        <StyledForm>
          <Option>{JSON.stringify(this.props.initSwapFormValues.BASE)}</Option>
          <Option>
            {JSON.stringify(this.props.initSwapFormValues.COUNTER)}
          </Option>
        </StyledForm>
      </>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  initSwapFormValues: selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
})

const connector = connect(mapStateToProps)

type OwnProps = BaseProps & { handleClose: () => void }
export type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(
  reduxForm<{}, Props>({ form: 'swapAmount', destroyOnUnmount: false }),
  connector
)

export default enhance(EnterAmount) as React.ComponentClass<OwnProps>
