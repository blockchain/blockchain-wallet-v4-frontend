import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 200px;
  height: 50px;
`
const EditContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
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
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;

  & > * { height: 50%; }
`
const DisplayContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`

const EditDescription = props => {
  const { value, editValue, toggled, handleCancel, handleChange, handleConfirm, handleToggle } = props

  return (
    <Wrapper onClick={handleToggle}>
      {toggled ? (
        <EditContainer>
          <EditArea value={editValue} onChange={handleChange} />
          <EditButtons>
            <Icon name='checkmark' size='14px' weight={500} color='success' cursor onMouseDown={handleConfirm} />
            <Icon name='close' size='14px' weight={500} color='sent' cursor onMouseDown={handleCancel} />
          </EditButtons>
        </EditContainer>
      ) : (
        <DisplayContainer>
          <Text size='14px' weight={300} italic>
            {props.value || <FormattedMessage id='components.editdescription.add' defaultMessage='Add a description' />}
          </Text>
          <Icon name='pencil' cursor />
        </DisplayContainer>
      )}
    </Wrapper>
  )
}

EditDescription.propTypes = {
  value: PropTypes.string.isRequired,
  toggled: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleToggle: PropTypes.func.isRequired
}

export default EditDescription
