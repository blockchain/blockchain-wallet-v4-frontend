import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text, Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-top: 10px;
`
const EditContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 25px;
`
const EditInputContainer = styled.div`
  width: 75%;
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid ${props => props.theme['gray-2']};
`
const EditInputArea = styled.textarea`
  width: 100%;
  resize: none;
  outline: none;
  border: none;
  box-sizing: border-box;
  padding-top: 4px;
  font-size: 14px;
`
const EditCancelButton = styled.div`
  padding: 2px 6px;
`
const DisplayContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`
const SaveButton = styled(Button)`
  margin-left: 10px;
`
const PencilIcon = styled(Icon)`
  padding-left: 10px;
`

const EditableDescription = props => {
  const { editValue, toggled, handleCancel, handleChange, handleConfirm, handleToggle } = props

  return (
    <Wrapper onClick={handleToggle}>
      {toggled ? (
        <EditContainer>
          <EditInputContainer>
            <EditInputArea value={editValue} onChange={handleChange}/>
            <EditCancelButton>
              <Icon name='close' size='10px' weight={500} color='gray-5' cursor onMouseDown={handleCancel} />
            </EditCancelButton>
          </EditInputContainer>
          <SaveButton name='checkmark' height='25px' width='40px' nature='primary' padding='0px' onMouseDown={handleConfirm}>
            <Text size='12px' weight={200} cursor='pointer' color='white'>
              <FormattedMessage id='components.editdescription.save' defaultMessage='Save' />
            </Text>
          </SaveButton>
        </EditContainer>
      ) : (props.value ? (
        <DisplayContainer>
          <Text size='12px' weight={200}>{ props.value }</Text>
          <PencilIcon name='pencil' color='received' size='14px' cursor />
        </DisplayContainer>
      ) : (
        <DisplayContainer>
          <Text size='12px' weight={200} cursor='pointer'>
            <FormattedMessage id='components.editdescription.add' defaultMessage='Add a description' />
          </Text>
        </DisplayContainer>
      ))}
    </Wrapper>
  )
}

EditableDescription.propTypes = {
  value: PropTypes.string.isRequired,
  toggled: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleToggle: PropTypes.func.isRequired
}

export default EditableDescription
