import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { FlyoutWrapper } from 'components/Flyout'
import { useShowConversionAlert } from 'hooks'

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
  display: ${(props) => (React.Children.count(props.children) > 0 ? 'flex' : 'none')};
  flex-direction: row;
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

const NoticeWrapper = styled.div`
  flex: 1;
  padding: 1rem 1rem 0 1rem;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 0.5rem;
  border: 1px solid #d46a00;

  ul {
    padding-inline-start: 1.5rem;
  }
`

type Props = OwnProps &
  SuccessStateType & {
    onClickBack: () => void
  }

export const InstructionDetails = ({ account, onClickBack }: Props) => {
  const { content, currency } = account
  const { coinfig } = window.coins[currency]

  const showConversionDisclaimer = useShowConversionAlert(coinfig)
  const footerActions = content.footers.filter((footer) => footer.actions)
  const footerNotices = content.footers.filter((footer) => !footer.actions)

  return (
    <FlyoutWrapper>
      <Header currency={account.currency} onClickBack={onClickBack} />

      {content.sections.map((section) => (
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
        {footerActions.map((footer) => (
          <ActionFooter key={footer.id} message={footer.message} actions={footer.actions!} />
        ))}

        <BottomRow>
          <NoticeWrapper>
            <Text size='14px' weight={600}>
              <span style={{ color: '#D46A00' }}>Important Information</span>
            </Text>
            <ul>
              {footerNotices.map((footer) => (
                <li key={footer.id}>
                  <Text size='12px' weight={500} color='grey900'>
                    {footer.message}
                  </Text>
                </li>
              ))}
              {showConversionDisclaimer && (
                <li>
                  <Text size='12px' weight={500} color='grey900'>
                    Your {coinfig.name} ({currency}) balance will be converted to USDC daily at
                    12:00 am UTC. To avoid any inconvenience buy crypto before the specified time.
                  </Text>
                </li>
              )}
            </ul>
          </NoticeWrapper>
        </BottomRow>
      </BottomInfoContainer>
    </FlyoutWrapper>
  )
}
