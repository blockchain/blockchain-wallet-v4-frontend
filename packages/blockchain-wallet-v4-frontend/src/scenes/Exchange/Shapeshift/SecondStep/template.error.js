import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import { Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  border: 1px solid ${props => props.theme['gray-2']};

  & > * { margin-bottom: 20px; }
`

const Error = props => (
  <Wrapper>
    <Text size='12px' weight={300} color='red'>
      {props.children === 'exchange_order_error'
        ? <FormattedMessage id='scenes.shapeshift.secondstep.shapeshiftordererror' defaultMessage='Your order could not be placed. Please try again later.' />
        : <FormattedMessage id='scenes.shapeshift.secondstep.shapeshifterror' defaultMessage='An unexpected error occured. Please try again later.' />
      }
    </Text>
    <Link size='13px' weight={300} onClick={() => props.actions.secondStepGoBack()}>
      <FormattedMessage id='scenes.shapeshift.secondstep.goback' defaultMessage='Go back' />
    </Link>
  </Wrapper>
)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(undefined, mapDispatchToProps)(Error)
