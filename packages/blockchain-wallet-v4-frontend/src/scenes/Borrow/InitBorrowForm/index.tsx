import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Box } from 'components/Box'
import { Button, Text } from 'blockchain-info-components'
import { CoinType, NabuApiErrorType, RemoteDataType } from 'core/types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { FormGroup, FormLabel } from 'components/Form'
import { OfferType } from 'data/types'
import { OrangeCartridge } from 'components/Cartridge'
import { RootState } from 'data/rootReducer'
import Amount from './Amount'
import React, { PureComponent } from 'react'
import SelectBoxCoin from 'components/Form/SelectBoxCoin'
import styled from 'styled-components'

type LinkDispatchPropsType = {
  modalActions: typeof actions.modals
}
type LinkStatePropsType = {
  offersR: RemoteDataType<NabuApiErrorType, Array<OfferType>>
  values: {
    coin: CoinType
  }
}

type Props = LinkDispatchPropsType & LinkStatePropsType

const CustomBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const CustomFormLabel = styled(FormLabel)`
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
`

const HorizontalBorder = styled.div`
  width: 100%;
  height: 1px;
  margin: 16px auto 8px auto;
  background-color: ${props => props.theme.grey000};
`

const CustomOrangeCartridge = styled<{ show: boolean }>(OrangeCartridge)`
  opacity: ${props => (props.show ? 1 : 0)};
`

class InitBorrowForm extends PureComponent<Props> {
  state = {}

  isDisabled = () => {
    const offers = this.props.offersR.getOrElse([])
    const values = this.props.values

    if (!values) return true
    const offer = offers.find(
      offer => offer.terms.collateralCcy === values.coin
    )
    return !offer
  }

  render () {
    return (
      <CustomBox>
        <div>
          <Text size='14px' color='grey600' weight={600}>
            <FormattedMessage
              id='scenes.initborrow.youcanborrow'
              defaultMessage='You can borrow up to'
            />
          </Text>
          <Amount {...this.props.values} />
          <HorizontalBorder />
          <FormGroup>
            <CustomFormLabel>
              <Text size='14px' color='grey600' weight={600}>
                <FormattedMessage
                  id='scenes.initborrow.collateral'
                  defaultMessage='Collateral'
                />
              </Text>
              <CustomOrangeCartridge
                show={!!this.props.values && this.props.values.coin !== 'BTC'}
              >
                <FormattedMessage
                  id='scenes.initborrow.comingsoon'
                  defaultMessage='Coming Soon'
                />
              </CustomOrangeCartridge>
            </CustomFormLabel>
            <Field
              component={SelectBoxCoin}
              name='coin'
              // TODO: Borrow - make type: borrow
              type='send'
            />
          </FormGroup>
        </div>
        <Button
          disabled={this.isDisabled()}
          style={{ marginTop: '16px' }}
          nature='primary'
          fullwidth
          onClick={() => this.props.modalActions.showModal('BORROW_MODAL')}
        >
          <FormattedMessage
            id='scenes.initborrow.borrow'
            defaultMessage='Borrow USD Pax'
          />
        </Button>
      </CustomBox>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  offersR: selectors.components.borrow.getOffers(state),
  values: selectors.form.getFormValues('initBorrow')(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose<any>(
  reduxForm({ form: 'initBorrow', initialValues: { coin: 'BTC' } }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(InitBorrowForm)
