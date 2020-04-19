import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Box } from 'components/Box'
import {
  Button,
  Icon,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  CoinType,
  LoanType,
  NabuApiErrorType,
  OfferType,
  RemoteDataType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { FormGroup, FormLabel } from 'components/Form'
import { OrangeCartridge } from 'components/Cartridge'
import { RootState } from 'data/rootReducer'
import { USER_BLOCKED } from 'data/components/borrow/model'
import Amount from './Amount'
import React, { PureComponent } from 'react'
import SelectBoxCoin from 'components/Form/SelectBoxCoin'
import styled from 'styled-components'

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

const AbsoluteWarning = styled(Text)`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: -40px;
  left: 0;
`

class InitBorrowForm extends PureComponent<Props> {
  state = {}

  getOfferForCoin = () => {
    const offers = this.props.offersR.getOrElse([])
    const values = this.props.values

    if (!values) return null
    const offer = offers.find(
      offer =>
        offer.terms.collateralCcy === values.coin &&
        offer.terms.principalCcy === 'PAX'
    )
    return offer
  }

  getIsUserBlocked = () => {
    return this.props.userHistoryR.cata({
      Success: () => false,
      Loading: () => false,
      NotAsked: () => false,
      Failure: e => typeof e === 'object' && e.description === USER_BLOCKED
    })
  }

  isDisabled = () => {
    const offer = this.getOfferForCoin()
    const userBlocked = this.getIsUserBlocked() === true
    return !offer || this.props.isDisabled || userBlocked
  }

  initBorrow = () => {
    const offer = this.getOfferForCoin()
    if (!offer) return
    this.props.borrowActions.setStep({ step: 'CHECKOUT', offer })
    this.props.modalActions.showModal('BORROW_MODAL')
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
            <TooltipHost id='borrow.amount.tooltip'>
              <TooltipIcon name='info' size='12px' />
            </TooltipHost>
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
            <Field component={SelectBoxCoin} name='coin' type='send' />
          </FormGroup>
        </div>
        <Button
          disabled={this.isDisabled()}
          style={{ marginTop: '16px' }}
          nature='primary'
          fullwidth
          onClick={this.initBorrow}
          data-e2e='initBorrowPax'
        >
          <FormattedMessage
            id='scenes.initborrow.borrow1'
            defaultMessage='Borrow USD Digital'
          />
        </Button>
        {this.getIsUserBlocked() && (
          <AbsoluteWarning size='12px' weight={500} color='grey600'>
            <Icon name='info' color='grey600' />
            <div style={{ marginLeft: '8px' }}>
              <FormattedMessage
                id='scenes.initborrow.userblocked'
                defaultMessage='Blockchain Borrow is not available in your country or region at the moment.'
              />{' '}
              <Link
                size='12px'
                weight={500}
                href='https://support.blockchain.com/hc/en-us/articles/360040444691-How-it-works'
              >
                <FormattedMessage
                  id='buttons.learn_more'
                  defaultMessage='Learn More'
                />
              </Link>
            </div>
          </AbsoluteWarning>
        )}
      </CustomBox>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  offersR: selectors.components.borrow.getOffers(state),
  userHistoryR: selectors.components.borrow.getBorrowHistory(state),
  values: selectors.form.getFormValues('initBorrow')(state) as {
    coin: CoinType
  }
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type OwnProps = {
  isDisabled: boolean
}
type LinkStatePropsType = {
  offersR: RemoteDataType<NabuApiErrorType, Array<OfferType>>
  userHistoryR: RemoteDataType<NabuApiErrorType, Array<LoanType>>
  values: {
    coin: CoinType
  }
}

type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose<any>(
  reduxForm({ form: 'initBorrow', initialValues: { coin: 'BTC' } }),
  connector
)

export default enhance(InitBorrowForm)
