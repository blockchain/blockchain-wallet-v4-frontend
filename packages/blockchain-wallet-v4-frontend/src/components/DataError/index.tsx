import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'

import ErrorHandler from './ErrorHandler'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Empty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`
const Header = styled(Text)`
  margin-top: 30px;
  margin-bottom: 20px;
`

const DataError = (props: {
  message?: { message: string | Error }
  onClick?: (a: any) => void
}) => {
  return (
    <Wrapper>
      <Empty>
        <Image name='empty-search' width='260px' />
        <Header size='18px' weight={500}>
          <FormattedMessage
            id='components.dataerror.header'
            defaultMessage='Oops, something went wrong here!'
          />
        </Header>
        <ErrorHandler {...props} />
      </Empty>
    </Wrapper>
  )
}

export default DataError
