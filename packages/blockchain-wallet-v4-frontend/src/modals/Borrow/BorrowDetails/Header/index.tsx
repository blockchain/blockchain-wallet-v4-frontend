import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

import { Props } from '../template.success'

const TopText = styled(Text)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const Header: React.FC<Props> = props => {
  return (
    <TopText color='grey800' size='20px' weight={600}>
      {props.loan.status === 'PENDING_EXECUTION' ||
      props.loan.status === 'PENDING_COLLATERAL_DEPOSIT' ? (
        <FormattedMessage
          id='modals.borrow.newloan'
          defaultMessage='New Loan'
        />
      ) : (
        <FormattedMessage
          id='modals.borrow.details'
          defaultMessage='Borrow Details'
        />
      )}
      <Icon
        onClick={props.handleClose}
        cursor
        name='close'
        size='20px'
        color='grey600'
      />
    </TopText>
  )
}

export default Header
