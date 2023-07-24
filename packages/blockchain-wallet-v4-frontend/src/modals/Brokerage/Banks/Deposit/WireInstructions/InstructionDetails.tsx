import React from 'react'
import { AlertCard } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { DisplayIcon, DisplaySubTitle, DisplayTitle } from 'components/BuySell'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { FlyoutWrapper } from 'components/Flyout'

import { Props as OwnProps, SuccessStateType } from '.'
import { ActionFooter } from './ActionFooter'
import { Header } from './Header'

const RowCopy = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid white;
  padding: 16px;

  &:last-child {
    border-bottom: none;
  }
`
const BottomInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;

  & > * {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`
const BottomRow = styled.div`
  display: flex;
  flex-direction: row;

  > div.constellation {
    width: 100%;
    background: ${(props) => props.theme.grey100} !important;
  }
`
const BottomMultiRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.grey800};
  margin-left: 16px;
`
const Entries = styled.div`
  background-color: ${(props) => props.theme.grey000};
  border-radius: 16px;
`
const SectionTitle = styled.div`
  color: ${(props) => props.theme.grey700};
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 8px;
`
const EntryTitle = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.grey700};
  font-weight: 500;
  line-height: 1.5;
`
const EntryValue = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.grey900};
  font-weight: 600;
  line-height: 1.5;
`

type Props = OwnProps &
  SuccessStateType & {
    onClickBack: () => void
  }

export const InstructionDetails = (props: Props) => {
  return (
    <FlyoutWrapper>
      <Header currency={props.account.currency} onClickBack={props.onClickBack} />

      {props.account.content.sections.map((section) => (
        <div key={section.name}>
          <SectionTitle>{section.name}</SectionTitle>
          <Entries>
            {section.entries.map((entry) => (
              <RowCopy key={entry.id}>
                <div>
                  <EntryTitle>{entry.title}</EntryTitle>
                  <EntryValue>{entry.message}</EntryValue>
                </div>
                <CopyClipboardButton textToCopy={entry.message} />
              </RowCopy>
            ))}
          </Entries>
        </div>
      ))}

      <BottomInfoContainer>
        {props.account.content.footers.map((footer) => {
          if (footer.actions) {
            return (
              <ActionFooter key={footer.id} message={footer.message} actions={footer.actions} />
            )
          }

          return footer.isImportant ? (
            <BottomRow key={footer.id}>
              <AlertCard variant='warning' content={footer.message} title={footer.title} />
            </BottomRow>
          ) : (
            <BottomRow key={footer.id}>
              <DisplayIcon>
                <Icon size='18px' color='grey800' name='pending' />
              </DisplayIcon>
              <BottomMultiRowContainer>
                <DisplayTitle>{footer.title}</DisplayTitle>
                <DisplaySubTitle>{footer.message}</DisplaySubTitle>
              </BottomMultiRowContainer>
            </BottomRow>
          )
        })}
      </BottomInfoContainer>
    </FlyoutWrapper>
  )
}
