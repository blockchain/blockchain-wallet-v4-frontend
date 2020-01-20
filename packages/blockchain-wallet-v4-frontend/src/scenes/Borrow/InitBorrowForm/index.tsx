import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Box } from 'components/Box'
import { Button, Text } from 'blockchain-info-components'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { RootState } from 'data/rootReducer'
import Amount from './Amount'
import React, { PureComponent } from 'react'
import SelectBoxCoin from 'components/Form/SelectBoxCoin'
import styled from 'styled-components'

type LinkDispatchPropsType = {
  modalActions: typeof actions.modals
}
type LinkStatePropsType = {
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

const HorizontalBorder = styled.div`
  width: 100%;
  height: 1px;
  margin: 16px auto; 
  background-color: ${props => props.theme.grey000};
`

class InitBorrowForm extends PureComponent<Props> {
  state = {}

  render () {
    return (
      <CustomBox>
        <div>
          <Text size='14px' color='grey600' weight={600}>
            <FormattedMessage id='scenes.initborrow.youcan' defaultMessage='You can borrow' />
          </Text>
          <Amount {...this.props.values} />
          <HorizontalBorder />
          <Text size='14px' color='grey600' weight={600}>
            <FormattedMessage id='scenes.initborrow.collateral' defaultMessage='Collateral' />
          </Text>
          <Field
            component={SelectBoxCoin}
            name='coin'
            // TODO: Borrow - make type: borrow
            type='send'
          />
        </div>
        <Button style={{ marginTop: '16px' }} nature='primary' fullwidth onClick={() => this.props.modalActions.showModal('BORROW_MODAL')}>
          <FormattedMessage id='scenes.initborrow.borrow' defaultMessage='Borrow USD Pax' />
        </Button>
      </CustomBox>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  values: selectors.form.getFormValues('initBorrow')(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose<any>(
  reduxForm({ form: 'initBorrow', initialValues: { coin: 'BTC' } }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(InitBorrowForm)
