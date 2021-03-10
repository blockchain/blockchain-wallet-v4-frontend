import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

import { RowValue } from '../../components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const DisplayContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`
const PencilIcon = styled(Icon)`
  padding-left: 10px;
`

const EditDescription = props => {
  const { handleChange, value } = props

  return (
    <Wrapper onClick={handleChange}>
      {value ? (
        <DisplayContainer>
          <RowValue data-e2e='transactionListItemDescription'>{value}</RowValue>
          <PencilIcon name='pencil' color='received' size='14px' cursor />
        </DisplayContainer>
      ) : (
        <DisplayContainer data-e2e='transactionListItemAddDescription'>
          <RowValue data-e2e='editTransactionDescriptionLink'>
            <FormattedMessage
              id='components.editdescription.add'
              defaultMessage='Add a description'
            />
          </RowValue>
          <PencilIcon name='pencil' color='received' size='14px' cursor />
        </DisplayContainer>
      )}
    </Wrapper>
  )
}

type OwnProps = {
  handleChange: (value?: string) => void
  value?: string
}

export default EditDescription
