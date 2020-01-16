import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { Box } from 'components/Box'
import { Button, Text } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

interface Props {
  modalActions: typeof actions.modals
}
interface State {

}

const CustomBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Amount = styled(Text)`
  font-size: 32px;
  font-weight: 600;
  margin-top: 8px;
  color: ${props => props.theme.grey800};
`;

const HorizontalBorder = styled.div`
  width: 100%;
  height: 1px;
  margin: 16px auto; 
  background-color: ${props => props.theme.grey000};
`

class InitBorrowForm extends PureComponent<Props, State> {
  state = {}

  render () {
    return (
      <CustomBox>
        <div>
          <Text size='14px' color='grey600' weight={600}>
            <FormattedMessage id='scenes.initborrow.youcan' defaultMessage='You can borrow' />
          </Text>
          <Amount>
            $X
        </Amount>
          <HorizontalBorder />
          <Text size='14px' color='grey600' weight={600}>
            <FormattedMessage id='scenes.initborrow.collateral' defaultMessage='Collateral' />
          </Text>
          <div>selectbox</div>
        </div>
        <Button style={{ marginTop: '16px' }} nature='primary' fullwidth onClick={() => this.props.modalActions.showModal('BORROW_MODAL')}>
          <FormattedMessage id='scenes.initborrow.borrow' defaultMessage='Borrow USD Pax' />
        </Button>
      </CustomBox>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(null, mapDispatchToProps)(InitBorrowForm)
