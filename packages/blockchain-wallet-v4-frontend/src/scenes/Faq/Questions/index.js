import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, TextGroup } from 'blockchain-info-components'

const title1 = () => <FormattedMessage id='scenes.faq.item1.question' defaultMessage='How do I buy bitcoin?' />

const description1 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item1.answer' defaultMessage='It’s simple, secure and seamless.' />
    <LinkContainer to='/buy-sell'>
      <FormattedMessage id='scenes.faq.item1.clickhere' defaultMessage='Click here to get started' />
    </LinkContainer>
  </TextGroup>
)

const title2 = () => <FormattedMessage id='scenes.faq.item2.question' defaultMessage='What do I need to do to keep my wallet safe?' />

const description2 = () => (
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

const title3 = () => <FormattedMessage id='scenes.faq.item3.question' defaultMessage='What is the difference between a wallet ID and a bitcoin address?' />

const description3 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item3.answer' defaultMessage='A wallet ID is like a username, and it contains numbers, letters, and dashes.' />
    <FormattedMessage id='scenes.faq.item3.answer2' defaultMessage='It is only used to log into your wallet and should be kept private.' />
    <FormattedMessage id='scenes.faq.item3.answer3' defaultMessage='Your wallet ID can be found in the welcome email we sent you when you created your wallet or under Wallet Information in Settings.' />
    <FormattedMessage id='scenes.faq.item3.answer4' defaultMessage='A bitcoin address is what you share with others when you want to receive funds. To generate a new bitcoin address click on Receive.' />
  </TextGroup>
)

const title4 = () => <FormattedMessage id='scenes.faq.item4.question' defaultMessage='How do I receive/send bitcoin?' />

const description4 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item4.answer' defaultMessage='To receive bitcoin, the sender needs your bitcoin address.' />
    <FormattedMessage id='scenes.faq.item4.answer2' defaultMessage='Our wallet will automatically generate a new address for each transaction you want to make.' />
    <FormattedMessage id='scenes.faq.item4.answer3' defaultMessage='Click on Receive and copy the address to share with the sender.' />
    <FormattedMessage id='scenes.faq.item4.answer4' defaultMessage='To send bitcoin, click Send, enter the recipient’s bitcoin address in the ‘To’ field and how much you want to send.' />
  </TextGroup>
)

const title5 = () => <FormattedMessage id='scenes.faq.item5.question' defaultMessage='How much does it cost to send bitcoin?' />

const description5 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item5.answer' defaultMessage='While our wallet is entirely free to use, the small fee included in your transaction goes to the miners, who help power the flow of transactions on the Bitcoin network.' />
    <FormattedMessage id='scenes.faq.item5.answer2' defaultMessage='To ensure your transactions confirm consistently and reliably, our wallet will automatically include an appropriate fee based on your transaction’s size and the level of network traffic at the time.' />
    <FormattedMessage id='scenes.faq.item5.answer3' defaultMessage='Before you send your transaction, you can view the included fee that we recommend.' />
    <FormattedMessage id='scenes.faq.item5.answer4' defaultMessage='If you wish to specify your own fee, you can do so under Advanced Send.' />
  </TextGroup>
)

const title6 = () => <FormattedMessage id='scenes.faq.item6.question' defaultMessage='How do I know a transaction has been successfully received/sent?' />

const description6 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item6.answer' defaultMessage='Transactions will appear almost instantly in your transaction feed which you can find on the left navigation of the wallet.' />
    <FormattedMessage id='scenes.faq.item6.answer2' defaultMessage='Your transaction is considered complete once it has received 3 network confirmations.' />
    <FormattedMessage id='scenes.faq.item6.answer3' defaultMessage='This typically takes about 30 minutes, but can vary. Until then your transaction will show up as pending.' />
  </TextGroup>
)
const title7 = () => <FormattedMessage id='scenes.faq.item7.question' defaultMessage='Can Blockchain see or access my funds?' />

const description7 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item7.answer' defaultMessage='We are a noncustodial wallet and do not have access to your bitcoins.' />
    <FormattedMessage id='scenes.faq.item7.answer2' defaultMessage='This means we cannot view your total balance, make payments on your behalf, or prevent you from accessing your wallet.' />
    <FormattedMessage id='scenes.faq.item7.answer3' defaultMessage='With a Blockchain wallet, you retain complete ownership of your bitcoin.' />
  </TextGroup>
)

const title8 = () => <FormattedMessage id='scenes.faq.item8.question' defaultMessage='Can Blockchain reset my password?' />

const description8 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item4.answer' defaultMessage='At Blockchain, we’re committed to letting customers maintain full control of their funds.' />
    <FormattedMessage id='scenes.faq.item4.answer2' defaultMessage='In that spirit, we never see or store your password, so we can’t reset it for you.' />
    <FormattedMessage id='scenes.faq.item4.answer3' defaultMessage='However, we do provide users a recovery phrase that can be used to restore access to your bitcoins.' />
    <FormattedMessage id='scenes.faq.item4.answer4' defaultMessage='Head over to our Security Center to get yours and make sure you store it somewhere secure and never share it.' />
  </TextGroup>
)

const title9 = () => <FormattedMessage id='scenes.faq.item9.question' defaultMessage='How can I exchange between currencies' />

const description9 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item9.answer' defaultMessage='Navigate to the exchange tab and exchange between currencies via our partner, ShapeShift' />
    {/* <FormattedMessage id='scenes.faq.item4.answer2' defaultMessage='In that spirit, we never see or store your password, so we can’t reset it for you.' />
    <FormattedMessage id='scenes.faq.item4.answer3' defaultMessage='However, we do provide users a recovery phrase that can be used to restore access to your bitcoins.' />
    <FormattedMessage id='scenes.faq.item4.answer4' defaultMessage='Head over to our Security Center to get yours and make sure you store it somewhere secure and never share it.' /> */}
  </TextGroup>
)

const title10 = () => <FormattedMessage id='scenes.faq.item10.question' defaultMessage='How do I buy or sell bitcoin?' />

const description10 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item10.answer' defaultMessage='We partner with exchanges across the world to make buying and selling bitcoin easier for you. You can get started now by creating an account with our partner. Once your account has been verified, you can begin buying or selling bitcoin with a credit card or bank transfer.' />
    <LinkContainer to='/buy-sell'>
      <Link size='14px' weight={300}>
        <FormattedMessage id='scenes.faq.item10.answer2' defaultMessage='Click here to get started' />
      </Link>
    </LinkContainer>
  </TextGroup>
)

const title11 = () => <FormattedMessage id='scenes.faq.item11.question' defaultMessage='How do I buy ether or Bitcoin Cash?
' />

const description11 = () => (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item11.answer' defaultMessage='We’re working on that! In the meantime, you can exchange bitcoin for ether or Bitcoin Cash in the Exchange tab of your wallet.' />
    <LinkContainer to='/exchange'>
      <Link size='14px' weight={300}>
        <FormattedMessage id='scenes.faq.item2.answer4' defaultMessage='Click here to get started' />
      </Link>
    </LinkContainer>
  </TextGroup>
)

const Questions = [
  { title: title1(), description: description1() },
  { title: title2(), description: description2() },
  { title: title3(), description: description3() },
  { title: title4(), description: description4() },
  { title: title5(), description: description5() },
  { title: title6(), description: description6() },
  { title: title7(), description: description7() },
  { title: title8(), description: description8() },
  { title: title9(), description: description9(), filter: 'exchange' },
  { title: title10(), description: description10(), filter: 'buy' },
  { title: title11(), description: description11(), filter: 'exchange' }
]

export default Questions
