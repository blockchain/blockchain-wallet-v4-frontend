import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import {
  FlyoutWrapper,
  Row,
  Title,
  Value as DropdownTitle
} from 'components/Flyout'
import { AddBankStepType } from 'data/types'

import { Props as _P } from '.'

const Wrapper = styled.div`
  display: flex;
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
const DropdownTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* caret icon rotation */
  > span:last-child {
    &.active {
      transform: rotate(90deg);
    }
  }
`

const InfoDropdown = styled.div<{ isToggled: boolean }>`
  max-height: ${props => (props.isToggled ? 'auto' : '0')};
  overflow: hidden;
  transition: max-height 0.3s;
`
const InfoText = styled(Title)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.grey600};
  line-height: 1.5;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Success: React.FC<Props> = props => {
  const [isToggled, handleToggle] = useState({
    sectionOne: false,
    sectionTwo: false,
    sectionThree: false,
    sectionFour: false
  })
  const { entity } = props
  const entityName = entity === 'Safeconnect(UK)' ? 'SafeConnect' : 'Fintecture'

  return (
    <Wrapper>
      <FlyoutWrapper>
        <BackContainer>
          <Image
            name='safe-connect'
            size='20px'
            style={{ marginRight: '28px' }}
          />
          <FormattedMessage
            id='modals.brokerage.authorize.title'
            defaultMessage='{entityName}'
            values={{ entityName }}
          />
        </BackContainer>
      </FlyoutWrapper>
      <Row>
        <DropdownTitleRow>
          <DropdownTitle>
            <FormattedMessage
              id='modals.brokerage.authorize.data_sharing'
              defaultMessage='Data Sharing'
            />
          </DropdownTitle>
          <Icon
            color='grey600'
            name='caret'
            size='10px'
            onClick={() =>
              handleToggle({ ...isToggled, sectionOne: !isToggled.sectionOne })
            }
            className={isToggled.sectionOne ? 'active' : ''}
          />
        </DropdownTitleRow>
        <InfoDropdown isToggled={isToggled.sectionOne}>
          <InfoText>
            <FormattedMessage
              id='modals.brokertitleage.authorize.data_sharing'
              defaultMessage='{entityName} will retrieve your bank data based on your request and provide this information to Blockchain.'
              values={{ entityName }}
            />
          </InfoText>
        </InfoDropdown>
      </Row>
      <Row>
        <DropdownTitleRow>
          <DropdownTitle>
            <FormattedMessage
              id='modals.brokerage.authorize.secure_connection.title'
              defaultMessage='Secure Connection'
            />
          </DropdownTitle>
          <Icon
            color='grey600'
            name='caret'
            size='10px'
            onClick={() =>
              handleToggle({ ...isToggled, sectionTwo: !isToggled.sectionTwo })
            }
            className={isToggled.sectionTwo ? 'active' : ''}
          />
        </DropdownTitleRow>
        <InfoDropdown isToggled={isToggled.sectionTwo}>
          <InfoText>
            <FormattedMessage
              id='modals.brokerage.authorize.secure_connection'
              defaultMessage='Data is securely retrieved in read-only format and only for the duration agreed with you. You have the right to withdraw your consent at any time.'
            />
          </InfoText>
        </InfoDropdown>
      </Row>
      <Row>
        <DropdownTitleRow>
          <DropdownTitle>
            <FormattedMessage
              id='modals.brokerage.authorize.fca.title'
              defaultMessage='FCA Authorisation'
            />
          </DropdownTitle>
          <Icon
            color='grey600'
            name='caret'
            size='10px'
            onClick={() =>
              handleToggle({
                ...isToggled,
                sectionThree: !isToggled.sectionThree
              })
            }
            className={isToggled.sectionThree ? 'active' : ''}
          />
        </DropdownTitleRow>
        <InfoDropdown isToggled={isToggled.sectionThree}>
          <InfoText>
            <FormattedMessage
              id='modals.brokerage.authorize.fca'
              defaultMessage='Blockchain is an agent of {entityName} Ltd. {entityName} Ltd is authorised and regulated by the Financial Conduct Authority under the Payment Service Regulations 2017 [827001] for the provision of Account Information and Payment Initiation services.'
              values={{ entityName }}
            />
          </InfoText>
        </InfoDropdown>
      </Row>
      <Row>
        <InfoText>
          <FormattedMessage
            id='modals.brokerage.authorize.data'
            defaultMessage='In order to share your {bankName} data with Blockchain, you will now be securely redirected to your bank to confirm your consent for {entityName} to read the following information:'
            values={{ bankName: 'Get this from data?', entityName }}
          />
        </InfoText>
        <InfoText>
          {'•'}{' '}
          <FormattedMessage
            id='modals.brokerage.authorize.identification_details'
            defaultMessage='Identification details'
          />
        </InfoText>
        <InfoText>
          {'•'}{' '}
          <FormattedMessage
            id='modals.brokerage.authorize.account_details'
            defaultMessage='Account(s) details'
          />
        </InfoText>
      </Row>
      <Row>
        <DropdownTitleRow>
          <DropdownTitle>
            <FormattedMessage
              id='modals.brokerage.authorize.about_access.title'
              defaultMessage='About the Access'
            />
          </DropdownTitle>
          <Icon
            color='grey600'
            name='caret'
            size='10px'
            onClick={() =>
              handleToggle({
                ...isToggled,
                sectionFour: !isToggled.sectionFour
              })
            }
            className={isToggled.sectionFour ? 'active' : ''}
          />
        </DropdownTitleRow>
        <InfoDropdown isToggled={isToggled.sectionFour}>
          <InfoText>
            <FormattedMessage
              id='modals.brokerage.authorize.about_access'
              defaultMessage='{entityName} will then use these details with Blockchain solely for the purposes of buying cryptocurrencies. This access is valid until 24th of January 2021, you can cancel consent at any time via the Blockchain settings or via your bank. This request is not a one-off, you will continue to receive consent requests as older versions expire.'
              values={{ entityName }}
            />
          </InfoText>
        </InfoDropdown>
      </Row>
      <Bottom>
        <Button
          nature='primary'
          data-e2e='obApprove'
          type='submit'
          fullwidth
          height='48px'
          onClick={() =>
            props.brokerageActions.setAddBankStep({
              addBankStep: AddBankStepType.ADD_BANK_HANDLER
            })
          }
        >
          <FormattedMessage id='copy.approve' defaultMessage='Approve' />
        </Button>
        <Button
          nature='light-red'
          data-e2e='obDeny'
          type='button'
          fullwidth
          height='48px'
          color='red400'
          style={{ marginTop: '16px' }}
          onClick={() => props.handleClose()}
        >
          <FormattedMessage id='copy.deny' defaultMessage='Deny' />
        </Button>
      </Bottom>
    </Wrapper>
  )
}

type Props = _P

export default Success
