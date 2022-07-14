import React, { useState } from 'react'
import CopyToClipBoard from 'react-copy-to-clipboard'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Link, Text, TooltipHost } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import {
  BackIconWrapper,
  Bottom,
  ButtonWrapper,
  HiddenPhraseBlock,
  InfoIconWrapper,
  PhraseContainer,
  TitleWrapper,
  VisibilityIconWrapper
} from '../model'

const CopyButtonWrapper = styled(ButtonWrapper)`
  cursor: copy;
`
const PointerButtonWrapper = styled(ButtonWrapper)`
  cursor: pointer;
`
const TextWrapper = styled(Text)`
  margin-bottom: 5px;
`
const RecoveryWords = (props) => {
  const [isPhraseVisible, setIsPhraseVisible] = useState<boolean>(true)
  const [isPhraseCopied, setIsPhraseCopied] = useState<boolean>(false)
  const { handleClick, recoveryPhrase } = props

  const RecoveryPhrase = styled(Text)`
    padding-right: 15px;
    color: ${isPhraseVisible ? 'transparent' : 'white'};
    text-shadow: ${isPhraseVisible && '0 0 5px rgb(255 255 255 / 50%)'};
  `
  const downloadBackupSeedPhrase = () => {
    const element = document.createElement('a')
    const file = new Blob([recoveryPhrase], {
      type: 'text/plain'
    })
    element.href = URL.createObjectURL(file)
    element.download = 'backup-seed-phrase.txt'
    document.body.appendChild(element)
    element.click()
  }

  const handleNextButton = () => {
    props.recoveryPhraseActions.setStep('CONFIRM_WORDS')
  }

  const copyBackupPhrase = () => {
    setIsPhraseCopied(true)
  }

  return (
    <Flex flexDirection='column'>
      <Flex alignItems='center' justifyContent='space-between'>
        <BackIconWrapper width={24} height={24} onClick={props.handleBackArrow} />
        <Link target='_blank' href='https://support.blockchain.com/hc/en-us/'>
          <InfoIconWrapper width={20} height={20} />
        </Link>
      </Flex>
      <TitleWrapper color='white' size='20px' weight={600}>
        <FormattedMessage id='plugin.backup-seed-phrase' defaultMessage='Backup Seed Phrase' />
      </TitleWrapper>
      <TextWrapper color='grey400' size='14px' weight={500} lineHeight='150%'>
        <FormattedMessage
          id='plugin.backup-seed-phrase.text.firstsetwords'
          defaultMessage='Your Secret Private Key protects your account.'
        />
        <FormattedMessage
          id='plugin.backup-seed-phrase.text.secondsetwords'
          defaultMessage='You will need it if you lose or reinstall your wallet.'
        />
        <FormattedMessage
          id='plugin.backup-seed-phrase.text.thirdsetwords'
          defaultMessage='Write it down and keep it safe.'
        />
      </TextWrapper>
      <Link
        size='14px'
        weight={500}
        target='_blank'
        href='https://support.blockchain.com/hc/en-us/'
      >
        <FormattedMessage id='buttons.learn_more_arrow' defaultMessage='Learn more' />
      </Link>
      <Flex>
        {props.step === 'FIRST_SET_WORDS' && (
          <PhraseContainer>
            <HiddenPhraseBlock onClick={() => setIsPhraseVisible(!isPhraseVisible)}>
              {isPhraseVisible && <VisibilityIconWrapper width={24} height={24} />}
            </HiddenPhraseBlock>
            {recoveryPhrase &&
              recoveryPhrase.map((phrase: string) => (
                <RecoveryPhrase color='white' key={phrase}>
                  <>{phrase}</>
                </RecoveryPhrase>
              ))}
          </PhraseContainer>
        )}
      </Flex>
      <Flex alignItems='center' justifyContent='space-between'>
        <CopyToClipBoard text={recoveryPhrase} onCopy={handleClick}>
          <CopyButtonWrapper onClick={copyBackupPhrase}>
            <FormattedMessage
              defaultMessage={`${isPhraseCopied ? 'Copied' : 'Copy'}`}
              id={`${isPhraseCopied ? 'tooltip.copied' : 'modals.airdropsuccess.copy'}`}
            />
          </CopyButtonWrapper>
        </CopyToClipBoard>
        <TooltipHost id='copy.on_chain_txs'>
          <PointerButtonWrapper data-e2e='generateTxReport' onClick={downloadBackupSeedPhrase}>
            <FormattedMessage id='copy.download' defaultMessage='Download' />
          </PointerButtonWrapper>
        </TooltipHost>
      </Flex>
      <Bottom>
        <Button
          capitalize
          data-e2e='continueToSend'
          fullwidth
          height='48px'
          nature={`${!isPhraseVisible ? 'light' : 'grey800'}`}
          size='16px'
          type='submit'
          disabled={isPhraseVisible}
          onClick={handleNextButton}
        >
          <Text color={`${!isPhraseVisible ? 'grey900' : 'grey600'}`} size='16px' weight={600}>
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Text>
        </Button>
      </Bottom>
    </Flex>
  )
}

export default RecoveryWords
