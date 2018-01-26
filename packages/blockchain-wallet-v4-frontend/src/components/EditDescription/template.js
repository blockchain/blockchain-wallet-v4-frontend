import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 50px;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  border: 1px solid ${props => props.theme['gray-2']};
`
const EditArea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  outline: none;
  border: none;
  padding: 5px;
  box-sizing: border-box;
`
const EditButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  padding: 5px;

  & > * { height: 50%; }
`

const EditDescription = props => {
  const { toggled, handleCancel, handleConfirm, handleToggle } = props

  return (
    <Wrapper onClick={handleToggle}>
      {toggled ? (
        <Container>
          <EditArea />
          <EditButtons>
            <Icon name='checkmark' size='14px' weight={500} color='success' cursor onMouseDown={handleConfirm} />
            <Icon name='close' size='14px' weight={500} color='sent' cursor onMouseDown={handleCancel} />
          </EditButtons>
        </Container>
      ) : (
        <Text size='14px' weight={300} italic cursor>
          <FormattedMessage id='components.editdescription.add' defaultMessage='Add a description' />
        </Text>
      )}
    </Wrapper>
  )
}

export default EditDescription
