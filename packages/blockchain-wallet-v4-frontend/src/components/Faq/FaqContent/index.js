import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

import styled from 'styled-components'
import { Link, Color } from 'blockchain-info-components'

const FaqDescription = styled.div`
  text-align: justify;
  padding: 10px 0;
  font-size: 12px;

  & > * { display: inline; margin-right: 5px; }
`

const FaqContent = [
  {
    groupTitleMsg: 'Wallet Functionality',
    groupTitleId: 'scenes.faq.group.walletfunctionality.title',
    groupQuestions: [{
      questionId: 'scenes.faq.group.walletfunctionality.question1',
      answerId: 'scenes.faq.group.walletfunctionality.answer1',
      question: 'How do I receive/send funds?',
      answer: <FormattedMessage id='scenes.faq.group.walletfunctionality.answer1' defaultMessage={'To receive funds, the sender needs your address. Your wallet will automatically generate a new address for each bitcoin or bitcoin cash transaction you make. For all ether transactions, your address will remain the same. Click on ‘Request’, select the currency you’d like to receive from the dropdown, and copy the address to share with the sender. To send funds, click ‘Send’, select the currency you want to send from the dropdown, and enter the recipient’s address in the ‘To’ field and enter how much you would like to send.'}/>
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question2',
      answerId: 'scenes.faq.group.walletfunctionality.answer2',
      question: 'How much does it cost to send funds?',
      answer: 'While our wallet is entirely free to use, the small fee included in your transaction goes to the miners, who help power the flow of transactions on the Bitcoin, Ethereum, and Bitcoin Cash networks. To ensure your transactions confirm consistently and reliably, your wallet will automatically include an appropriate fee based on your transaction’s size and the level of network traffic at the time. If you wish to specify your own fee for bitcoin transactions, you can do so under ‘Customize Fee’.'
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question3',
      answerId: 'scenes.faq.group.walletfunctionality.answer3',
      question: 'What is the difference between a wallet ID and an address?',
      answer: 'You can think of your wallet ID as a username that contains numbers, letters, and dashes. It is only used to log into your wallet and should be kept private. Your wallet ID can be found in the welcome email we sent you when you created your wallet or in Settings -> General. Addresses are what you share with others when you want to receive funds. To find your bitcoin, ether, or bitcoin cash address click on ‘Request’.'
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question4',
      answerId: 'scenes.faq.group.walletfunctionality.answer4',
      question: 'Why are my bitcoin and bitcoin cash addresses changing?',
      answer: 'Although you can reuse addresses, transacting with the same address makes it easy for people to track your payments history. We alleviate this by using a HD (hierarchical deterministic) framework which provides you endless different addresses to send and receive to for additional security.'
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question5',
      answerId: 'scenes.faq.group.walletfunctionality.answer5',
      question: 'Why are my bitcoin and bitcoin cash addresses changing?',
      answer: 'You can think of your wallet ID as a username that contains numbers, letters, and dashes. It is only used to log into your wallet and should be kept private. Your wallet ID can be found in the welcome email we sent you when you created your wallet or in Settings -> General. Addresses are what you share with others when you want to receive funds. To find your bitcoin, ether, or bitcoin cash address click on ‘Request’.'
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question6',
      answerId: 'scenes.faq.group.walletfunctionality.answer6',
      question: 'Can an address still receive funds even though it’s no longer displayed under ‘Request’?',
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer6.one' defaultMessage={'Yes. All public addresses generated from your wallet can still receive funds, even if they no longer appear under ‘Request’. As explained'}/>
        <Link href='https://support.blockchain.com/hc/en-us/articles/210353663-Why-is-my-bitcoin-address-changing-' target='_blank' size='12px' weight='200px'>here,</Link>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer6.two' defaultMessage={'a new address will automatically display under ‘Request’ once the previously displayed address receives a payment.'} />
        <br/>
        <br/>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer6.three' defaultMessage={'In Settings > Addresses, you can click on ‘Manage’ to the right of each wallet to view all of the labeled addresses that have been generated for that specific wallet. Clicking ‘Used Addresses’ allows you to see every receiving addressed ever generated within the wallet, as well as the current balance of each of these used addresses. Please note that when you send funds, your Blockchain wallet automatically selects addresses to spend from. That\'s why the current balance of an address can be different from the total received value'}/>
        </FaqDescription>
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question7',
      answerId: 'scenes.faq.group.walletfunctionality.answer7',
      question: 'How do I know if a transaction has been successfully received/sent?',
      answer: 'Transactions will appear almost instantly in your transaction feed. Each currency has its own feed, which you can find by clicking on the corresponding currency in the left navigation of your wallet. While your bitcoin and bitcoin cash transactions are considered complete once they have 3 network confirmations, your ether transactions will be considered complete after 12 confirmations. This typically takes about 30 minutes for bitcoin and bitcoin cash and 5 minutes for ether, but can vary. Until then, your transaction will show up as pending.'
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question8',
      answerId: 'scenes.faq.group.walletfunctionality.answer8',
      question: 'Can my transaction be canceled or reversed?',
      answer: <FaqDescription>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer8.one' defaultMessage={'No, unfortunately we are unable to cancel or reverse any transaction. Even advanced cryptocurrency users can recall an incident when they failed to double-check their transaction details and accidentally sent funds to the wrong recipient, or sent the wrong amount. As unfortunate as it is, cryptocurrency transactions on the Bitcoin, Ethereum, and Bitcoin Cash networks are designed to be       irreversible and we have no control over them. Knowing this, it is extremely important to make sure your transaction details are correct before you click send.'} />
          <br/>
          <br/>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer8.two' defaultMessage={'To learn more about why transactions can\'t be canceled and how this aspect of bitcoin and other similar cryptocurrencies compares to other methods of payment like credit cards and cash, check out our blog post on'} />
          <Link href='https://blog.blockchain.com/2016/06/16/support-team-tips-bitcoin-transactions-and-chargebacks/' target='_blank' size='12px' weight='200px'>Bitcoin Transactions & Chargebacks.</Link>
          </FaqDescription>
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question9',
      answerId: 'scenes.faq.group.walletfunctionality.answer9',
      question: 'Why hasn\'t my transaction confirmed yet?',
      answer: <FaqDescription>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer9.one' defaultMessage={'Every cryptocurrency transaction that’s sent will flow into what\'s called the mempool (short for memory pool) before it can be confirmed by miners. When there\'s a dramatic spike in transaction activity, the mempool can become congested because so many transactions are waiting to be included in the next block.'} />
          <br/>
          <br/>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer9.two' defaultMessage={'An unconfirmed transaction will eventually either be accepted into a block by a mining pool, or be rejected by the network. If it is eventually rejected, the funds will remain on the address they were sent from. At this point, we can only recommend that you wait to see if your transaction is accepted into a block. Clicking the ⬆ icon in your transaction feed will relay to you the details of thattransaction through its respective explorer.'} />
          <br/>
          <br/>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer9.three' defaultMessage={'Like all wallet providers, Blockchain has no control over the speed of confirmation, and unfortunately cannot expedite transactions. All we can suggest is using an appropriate transaction fee in order to incentivize a miner to include your transaction into a block. This is always dependent upon the network of miners. \n \nWe do everything we can to lessen the number of pending transactions.For this reason, your Blockchain wallet utilizes dynamic bitcoin and bitcoin cash fees that are dependent upon current network conditions. To learn more about how this works read our blog'}/>
          <Link href='https://blog.blockchain.com/2016/03/16/introducing-dynamic-fees/' target='_blank' size='12px' weight='200px'>here.</Link>
          </FaqDescription>
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question10',
      answerId: 'scenes.faq.group.walletfunctionality.answer10',
      question: 'What is a watch-only address?',
      answer: 'A watch-only address is a public key that you’ve imported into your wallet by navigating to Settings > Addresses > Import. With every public key, there is a private key behind it, and you need this key in order to spend the funds attached to the account. You can think of this private key as the ‘password’ to your public key. Watch-only addresses are a useful feature to monitor incoming and outgoing transactions or to keep track of an address for repeated payments like rent. Keep in mind— sending and receiving to the same address makes your transaction history easy to trace. Alternatively, you can import a private key from a different wallet provider (which has your public key attached) and spend from it freely within your Blockchain wallet. Since your funds in these addresses are not backup in your recovery phrase, we strongly recommend ‘transferring’ any funds from these addresses into your main accounts.'
    }, {
      questionId: 'scenes.faq.group.walletfunctionality.question11',
      answerId: 'scenes.faq.group.walletfunctionality.answer11',
      question: 'How can I look up a transaction on the blockchain?',
      answer: <FaqDescription>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer11.one' defaultMessage={'Block explorers provide a visually appealing and intuitive way to navigate different currencies’ blockchains. For any transactions within your wallet, you can navigate to that currency’s tab and click on the arrow icon to view your transaction.'} />
          <br/>
          <br/>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer11.two' defaultMessage={'Blockchain has our own bitcoin specific block explorer that launched in August 2011, and was created for as a way for anyone to study bitcoin transactions, along with a variety of helpful charts and statistics about activity on the network.'} />
          <br/>
          <br/>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer11.three' defaultMessage={'To look up a bitcoin transaction, users can visit'}/>
          <Link href='https://blockchain.info' target='_blank' size='12px' weight='200px'>https://blockchain.info</Link>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer11.four' defaultMessage={'and use the search bar on the upper right to learn more about a particular bitcoin address, transaction hash, or block number.'}/>
          </FaqDescription>

      }, {
      questionId: 'scenes.faq.group.walletfunctionality.question12',
      answerId: 'scenes.faq.group.walletfunctionality.answer12',
      question: 'Why did my bitcoin cash address change?',
      answer: 'Since bitcoin cash is a fork of the bitcoin block chain, its address format previously looked nearly identical to that of bitcoin, which was very confusing to those using it. Now, when you want to send or receive bitcoin cash, you can immediately identify that you’re using the correct address thanks to the added prefix that looks like this: bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a. Although you can technically still transact to and from legacy BCH addresses, we strongly recommend adopting this new format to eliminate confusion.'
    }]
      }, {
    groupTitleMsg: 'Wallet Security',
    groupTitleId: 'scenes.faq.group.walletsecurity.title',
    groupQuestions: [{
      questionId: 'scenes.faq.group.walletsecurity.question1',
      answerId: 'scenes.faq.group.walletsecurity.answer1',
      question: 'What do I need to keep my wallet safe?',
      answer: <FaqDescription>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer1.one' defaultMessage={'Our Security Center helps you to keep your wallet secure and ensure that you always have access to your funds - all in less than 5 minutes. A great place to start is to enable 2-Step Verification and write down your Backup Phrase to make sure you never lose access to your funds. We also recommend using a unique, random password that’s at least 16 characters or more.'}/>
          <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
            Click here
          </NavLink>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer1.two' defaultMessage={'to get started.'} />
          </FaqDescription>

    }, {
      questionId: 'scenes.faq.group.walletsecurity.question2',
      answerId: 'scenes.faq.group.walletsecurity.answer2',
      question: 'Can Blockchain see or access my funds?',
      answer: 'We are a noncustodial wallet and therefore do not have access to your funds. This means we cannot view your balances, make payments on your behalf, or prevent you from accessing your funds. With your Blockchain wallet, you retain complete ownership of your finances.'
    }, {
      questionId: 'scenes.faq.group.walletsecurity.question3',
      answerId: 'scenes.faq.group.walletsecurity.answer3',
      question: 'Can Blockchain reset my password?',
      answer: <FaqDescription>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer3.one' defaultMessage={'At Blockchain, we’re committed to letting customers maintain full control of their funds. In that spirit, we never see or store your password, so we can’t reset it for you. However, we do provide users a backup phrase that can be used to restore access to your funds. Head over to your'}/>
          <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
            Security Center
          </NavLink>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer3.two' defaultMessage={'to find yours. Make sure you store it somewhere secure offline and never share it.'} />
          </FaqDescription>
    }, {
      questionId: 'scenes.faq.group.walletsecurity.question4',
      answerId: 'scenes.faq.group.walletsecurity.answer4',
      question: 'Can I close/delete my Blockchain Wallet?',
      answer: <FaqDescription>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.one' defaultMessage={'It is currently not possible to delete a Blockchain digital currency wallet. All personally identifiable information, such as email address and sms phone number, can be removed in'}/>
          <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
            Security Center
          </NavLink>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.two' defaultMessage={'and'}/>
          <NavLink to='/settings/preferences' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
            Preferences
          </NavLink>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.three' defaultMessage={'by replacing them with an invalid submission. For example, one could use 555-5555 for the phone number, or abc@123.com as an email.'}/>
          <br/>
          <br/>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.four' defaultMessage={'After replacing this associated information, and archiving all imported addresses within the “Addresses” section, all information associated with the user personally has been removed. If you are the only one that knows your backup phrase, your wallet is essentially mute until you decide to use it again. We suggest keeping the wallet’s Backup Phrase in a safe place, in case you ever want to returto our wallet.'}/>
          <br/>
          <br/>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.five' defaultMessage={'If you’ve created an account with one of our exchange partners (Coinify, SFOX, Unocoin or Shapeshift), please reach out to their support teams for further assistance with removing your personal information from their records. For assistance with this, please reach out to our support team'}/>
          <Link href='https://support.blockchain.com/hc/en-us/requests/new' target='_blank' size='12px' weight='200px'>here.</Link>
          </FaqDescription>
    }]
    }, {
      groupTitleMsg: 'Educational Resources',
      groupTitleId: 'scenes.faq.group.educationalresources.title',
      groupQuestions: [{
        questionId: 'scenes.faq.group.educationalresources.question1',
        answerId: 'scenes.faq.group.educationalresources.answer1',
        question: 'What is block chain technology?',
        answer: 'The block chain is a uniquely architected database for digital transactions. To break it down— a block contains a record of new transactions and cnce that block is full, it is added to a chain of other blocks of transactions; hence the name “block chain”. This information is publicly viewable on an explorer, where eventually each transaction is approved or rejected by a network of computers (called miners). The block chain is considered immutable (meaning unchanging) because in order to alter a block, all previous blocks would have to also be altered. The vast majority of the community would have to agree on the change and be willing to update all subsequent blocks.'
      }, {
        questionId: 'scenes.faq.group.educationalresources.question2',
        answerId: 'scenes.faq.group.educationalresources.answer2',
        question: 'What is bitcoin?',
        answer: 'Bitcoin (BTC) is the first ever cryptocurrency and is used like other monetary assets in exchange for goods and services. Unlike traditional assets, bitcoin is easily portable, divisible, and irreversible. Bitcoin increases system efficiency and enables the provision of financial services at a drastically lower cost, giving users more power and freedom.'
      }, {
        questionId: 'scenes.faq.group.educationalresources.question3',
        answerId: 'scenes.faq.group.educationalresources.answer3',
        question: 'What is bitcoin cash?',
        answer: 'Bitcoin cash is a form of peer-to-peer electronic cash that was created after a fork of the Bitcoin block chain in August 2017. Bitcoin cash, or BCH, has since grown to be one of the top cryptocurrencies, along with bitcoin and ether.'
      }, {
        questionId: 'scenes.faq.group.educationalresources.question4',
        answerId: 'scenes.faq.group.educationalresources.answer4',
        question: 'What is ether?',
        answer: 'Ether is a decentralized digital currency, also known as ETH. In addition to being a tradeable cryptocurrency, ether powers the Ethereum network by paying for transaction fees and computational services. Ether is paving the way for a more intelligent financial platform.'
      }, {
        questionId: 'scenes.faq.group.educationalresources.question5',
        answerId: 'scenes.faq.group.educationalresources.answer5',
        question: 'What are contract addresses? ',
        answer: 'ontract addresses are programs that execute requirements set by their creators through running “if-this-then-that” conditions coded onto them. These contract codes can come in many forms, such as the transaction of money when certain conditions are met (think: paying artists a royalty fee every time their content is used), or the exchange of goods between parties (think: paying your monthly rent).'
      }, {
        questionId: 'scenes.faq.group.educationalresources.question6',
        answerId: 'scenes.faq.group.educationalresources.answer6',
        question: 'Does Blockchain support ERC20 tokens?',
        answer: 'We currently do not support ERC20 tokens, but we are working on adding this capability in the coming months. If you accidently send/receive funds from an ERC20 token to your Blockchain wallet, the funds will remain in the original address, you just won’t be able to access it on our platform (yet!).'
      }, {
        questionId: 'scenes.faq.group.educationalresources.question7',
        answerId: 'scenes.faq.group.educationalresources.answer7',
        question: 'What are ERC20 tokens?',
        answer: 'ERC-20 protocol is a standardized way of creating new tokens on the Ethereum block chain.'
      }, {
        questionId: 'scenes.faq.group.educationalresources.question8',
        answerId: 'scenes.faq.group.educationalresources.answer8',
        question: 'Where does Blockchain stand on hard forks?',
        answer: <FaqDescription>
          <FormattedMessage id='scenes.faq.group.educationalresources.answer8.one' defaultMessage={'At Blockchain, our priority is always our users. Our view on network upgrades and forks is two-fold. First, we will prioritize user safety throughout any network upgrade or instability above all else. Second, we believe our users should maximally benefit from forks wherever feasible. Meaning, if 2 block chains are formed through a fork, we will follow the chain with the most accumulated difficulty and refer to that chain as the main chain. If we find that the minority chain has significant value, we will make that value available for customers once evaluated. It may be necessary to temporarily suspend outgoing transactions for a period of time while the network is unstable, and if this is the case, you will be sufficiently notified. Please keep in mind that you always have access to your funds via your backup phrase'} />
          <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
              here.
          </NavLink>
          </FaqDescription>
      }, {
        questionId: 'scenes.faq.group.educationalresources.question9',
        answerId: 'scenes.faq.group.educationalresources.answer9',
        question: 'What are nodes?',
        answer: 'Nodes are powerful computers that run software and keep the network intact by approving or rejecting transactions and adding blocks to the chain.'
      }, {
        questionId: 'scenes.faq.group.educationalresources.question10',
        answerId: 'scenes.faq.group.educationalresources.answer10',
        question: 'What are miners?',
        answer: 'We refer to “mining nodes” as miners. Mining nodes group pending transactions into blocks and add them to the block chain. They do this by solving complex mathematical puzzles that come with the software, and include the answer into each block before adding it to the chain of other blocks. When funds are sent, every computer running a mining node receives the same transaction, and multiple people go to approve or deny it. If miners disagree on a transaction, the network automatically rejects the transaction that doesn’t match the rest: preventing fraud. It’s impossible for scammers to manipulate the system this way, since their copy of the block chain wouldn’t match the others, and each transaction has to be agreed upon.'
    }]
  }]
export default FaqContent
