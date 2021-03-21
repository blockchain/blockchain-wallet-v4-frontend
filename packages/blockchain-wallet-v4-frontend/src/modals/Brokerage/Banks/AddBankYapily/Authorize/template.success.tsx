import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import {
  FlyoutWrapper,
  Row,
  Title,
  Value as DropdownTitle
} from 'components/Flyout'

import { Props as _P } from '.'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const BackContainer = styled(Text)`
  display: flex;
  align-items: center;
  width: 100%;
  font-weight: 600;
  font-size: 20px;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
  flex-direction: column;
  height: 100%;
`
const RowCopy = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const DropdownText = styled(Title)`
  font-weight: 500;
  color: ${props => props.theme.grey600};
`

const Success: React.FC<Props> = props => {
  const { entity } = props

  return (
    <Wrapper>
      <div>
        <FlyoutWrapper>
          <BackContainer>
            <Image
              name='safe-connect'
              size='20px'
              style={{ marginRight: '28px' }}
            />
            <div>
              <FormattedMessage
                id='modals.brokerage.authorize.title'
                defaultMessage='{entityName}'
                values={{ entityName: entity }}
              />
            </div>
          </BackContainer>
        </FlyoutWrapper>
        <RowCopy>
          <div>
            <DropdownTitle>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.recipient'
                defaultMessage='Recipient'
              />
            </DropdownTitle>
            <DropdownText data-e2e='sbRecipientName'>
              Recipeint Name
            </DropdownText>
          </div>
        </RowCopy>
      </div>
      <Bottom />
    </Wrapper>
  )
}

type Props = _P

export default Success
