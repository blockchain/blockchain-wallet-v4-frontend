import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon, Link, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: ${props => props.theme['blue000']};
  border-radius: 4px;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
`
const TextGroup = styled(Text)`
  display: flex;
  align-items: flex-end;
`
const CustomLink = styled(Link)`
  display: flex;
  align-items: center;
`
const BitPayIcon = styled(Icon)`
  margin: 0 3px;
`
const ArrowIcon = styled(Icon)`
  margin-left: 8px;
  margin-top: 1px;
`

const BitPayCTA = ({ coin, modalActions }) => {
  const handleClick = () => {
    modalActions.showModal('BitPayInformational')
  }

  return (
    <Wrapper>
      <TextGroup size='12px' weight={500} color='grey600'>
        <FormattedMessage
          id='bitpaycta.nowsupporting'
          defaultMessage='Your {coin} wallet now supports'
          values={{ coin }}
        />{' '}
        <BitPayIcon size='12px' name='bitpay-logo' color='#2A3F90' /> <>urls.</>
      </TextGroup>
      <CustomLink size='12px' weight={600} onClick={handleClick}>
        <FormattedMessage id='buttons.learnmore' defaultMessage='Learn more' />
        <ArrowIcon
          size='10px'
          weight={800}
          color='blue'
          name='chevron-right-large'
        />
      </CustomLink>
    </Wrapper>
  )
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(BitPayCTA)
