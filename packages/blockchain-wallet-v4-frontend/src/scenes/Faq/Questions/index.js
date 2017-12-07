import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, TextGroup } from 'blockchain-info-components'

export const title1 = () => <FormattedMessage id='scenes.faq.item1.question' defaultMessage='How do I buy bitcoin?' />

export const description1 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item1.answer' defaultMessage='It’s simple, secure and seamless.' />
    <LinkContainer to='/buy-sell'>
      <FormattedMessage id='scenes.faq.item1.clickhere' defaultMessage='Click here to get started' />
    </LinkContainer>
  </TextGroup>
)

export const title2 = () => <FormattedMessage id='scenes.faq.item2.question' defaultMessage='What do I need to do to keep my wallet safe?' />

export const description2 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item2.answer' defaultMessage='Our Security Center can help you keep your wallet secure and ensure that you can access your funds even if you lose your password - all in less than 5 minutes.' />
    <FormattedMessage id='scenes.faq.item2.answer2' defaultMessage='A great place to start is to enable 2-Step Verification to help prevent unauthorized access to your wallet and write down your Recovery Phrase to make sure you never lose access to your funds.' />
    <FormattedMessage id='scenes.faq.item2.answer3' defaultMessage='We also recommend using a unique, random password that’s at least 16 characters or more.' />
    <LinkContainer to='/security-center'>
      <Link size='14px' weight={300}>
        <FormattedMessage id='scenes.faq.item2.answer4' defaultMessage='Click here to get started' />
      </Link>
    </LinkContainer>
  </TextGroup>
)

export const title3 = () => <FormattedMessage id='scenes.faq.item3.question' defaultMessage='What is the difference between a wallet ID and a bitcoin address?' />

export const description3 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item3.answer' defaultMessage='A wallet ID is like a username, and it contains numbers, letters, and dashes.' />
    <FormattedMessage id='scenes.faq.item3.answer2' defaultMessage='It is only used to log into your wallet and should be kept private.' />
    <FormattedMessage id='scenes.faq.item3.answer3' defaultMessage='Your wallet ID can be found in the welcome email we sent you when you created your wallet or under Wallet Information in Settings.' />
    <FormattedMessage id='scenes.faq.item3.answer4' defaultMessage='A bitcoin address is what you share with others when you want to receive funds. To generate a new bitcoin address click on Receive.' />
  </TextGroup>
)

export const title4 = () => <FormattedMessage id='scenes.faq.item4.question' defaultMessage='How do I receive/send bitcoin?' />

export const description4 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item4.answer' defaultMessage='To receive bitcoin, the sender needs your bitcoin address.' />
    <FormattedMessage id='scenes.faq.item4.answer2' defaultMessage='Our wallet will automatically generate a new address for each transaction you want to make.' />
    <FormattedMessage id='scenes.faq.item4.answer3' defaultMessage='Click on Receive and copy the address to share with the sender.' />
    <FormattedMessage id='scenes.faq.item4.answer4' defaultMessage='To send bitcoin, click Send, enter the recipient’s bitcoin address in the ‘To’ field and how much you want to send.' />
  </TextGroup>
)

export const title5 = () => <FormattedMessage id='scenes.faq.item5.question' defaultMessage='How much does it cost to send bitcoin?' />

export const description5 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item5.answer' defaultMessage='While our wallet is entirely free to use, the small fee included in your transaction goes to the miners, who help power the flow of transactions on the Bitcoin network.' />
    <FormattedMessage id='scenes.faq.item5.answer2' defaultMessage='To ensure your transactions confirm consistently and reliably, our wallet will automatically include an appropriate fee based on your transaction’s size and the level of network traffic at the time.' />
    <FormattedMessage id='scenes.faq.item5.answer3' defaultMessage='Before you send your transaction, you can view the included fee that we recommend.' />
    <FormattedMessage id='scenes.faq.item5.answer4' defaultMessage='If you wish to specify your own fee, you can do so under Advanced Send.' />
  </TextGroup>
)

export const title6 = () => <FormattedMessage id='scenes.faq.item6.question' defaultMessage='How do I know a transaction has been successfully received/sent?' />

export const description6 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item6.answer' defaultMessage='Transactions will appear almost instantly in your transaction feed which you can find on the left navigation of the wallet.' />
    <FormattedMessage id='scenes.faq.item6.answer2' defaultMessage='Your transaction is considered complete once it has received 3 network confirmations.' />
    <FormattedMessage id='scenes.faq.item6.answer3' defaultMessage='This typically takes about 30 minutes, but can vary. Until then your transaction will show up as pending.' />
  </TextGroup>
)
export const title7 = () => <FormattedMessage id='scenes.faq.item7.question' defaultMessage='Can Blockchain see or access my funds?' />

export const description7 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item7.answer' defaultMessage='We are a noncustodial wallet and do not have access to your bitcoins.' />
    <FormattedMessage id='scenes.faq.item7.answer2' defaultMessage='This means we cannot view your total balance, make payments on your behalf, or prevent you from accessing your wallet.' />
    <FormattedMessage id='scenes.faq.item7.answer3' defaultMessage='With a Blockchain wallet, you retain complete ownership of your bitcoin.' />
  </TextGroup>
)

export const title8 = () => <FormattedMessage id='scenes.faq.item8.question' defaultMessage='Can Blockchain reset my password?' />

export const description8 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item4.answer' defaultMessage='At Blockchain, we’re committed to letting customers maintain full control of their funds.' />
    <FormattedMessage id='scenes.faq.item4.answer2' defaultMessage='In that spirit, we never see or store your password, so we can’t reset it for you.' />
    <FormattedMessage id='scenes.faq.item4.answer3' defaultMessage='However, we do provide users a recovery phrase that can be used to restore access to your bitcoins.' />
    <FormattedMessage id='scenes.faq.item4.answer4' defaultMessage='Head over to our Security Center to get yours and make sure you store it somewhere secure and never share it.' />
  </TextGroup>
)
