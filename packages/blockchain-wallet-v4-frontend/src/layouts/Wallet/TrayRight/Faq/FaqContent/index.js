import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

import styled from 'styled-components'
import { Link, Color } from 'blockchain-info-components'

const FaqDescription = styled.div`
  & > * { display: inline; }
`

const FaqContent = [
  {
    groupTitleMsg: <FormattedMessage id='scenes.faq.group.walletfunctionality.title' defaultMessage='Wallet Functionality' />,
    groupQuestions: [{
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question1' defaultMessage='How do I receive/send funds?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer1.one' defaultMessage='To receive funds, the sender needs your address. Your wallet will automatically generate a new address for each bitcoin or bitcoin cash transaction you make. For all ether transactions, your address will remain the same.' />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer1.two' defaultMessage='Click on ‘Request’, select the currency you’d like to receive from the dropdown, and copy the address to share with the sender. To send funds, click ‘Send’, select the currency you want to send from the dropdown, enter the recipient’s address in the ‘To’ field and enter how much you would like to send.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question2' defaultMessage='How much does it cost to send funds?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer2.one' defaultMessage='While our wallet is entirely free to use, the small fee included in your transaction goes to the miners, who help power the flow of transactions on the Bitcoin, Ethereum, and Bitcoin Cash networks.' />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer2.two' defaultMessage='To ensure your transactions confirm consistently and reliably, your wallet will automatically include an appropriate fee based on your transaction’s size and the level of network traffic at the time. If you wish to specify your own fee for bitcoin transactions, you can do so under ‘Customize Fee’.' />'
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question3' defaultMessage='What is the difference between a wallet ID and an address?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer3.one' defaultMessage='You can think of your wallet ID as a username that contains numbers, letters, and dashes. It is only used to log into your wallet and should be kept private.' />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer3.two' defaultMessage='Your wallet ID can be found in the welcome email we sent you when you created your wallet or in Settings -> General. Addresses are what you share with others when you want to receive funds. To find your bitcoin, ether, or bitcoin cash address click on ‘Request’.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question5' defaultMessage='Why do we generate new addresses for each bitcoin and bitcoin cash transaction?' />,
      answer: <FormattedMessage id='scenes.faq.group.walletfunctionality.answer5' defaultMessage='Although you can reuse addresses, transacting with the same address makes it easy for people to track your payments history. We alleviate this by using a HD (hierarchical deterministic) framework which provides you endless different addresses to send and receive to for additional security.' />
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question6' defaultMessage='Can an address still receive funds even though it’s no longer displayed under ‘Request’?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer6.one' defaultMessage='Yes. All public addresses generated from your wallet can still receive funds, even if they no longer appear under ‘Request’. As explained ' />
        <Link href='https://support.blockchain.com/hc/en-us/articles/210353663-Why-is-my-bitcoin-address-changing-' target='_blank' size='13px' weight={200}>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer6.link' defaultMessage='here' />
        </Link>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer6.two' defaultMessage=', a new address will automatically display under ‘Request’ once the previously displayed address receives a payment.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer6.three' defaultMessage='In Settings > Addresses, you can click on ‘Manage’ to the right of each wallet to view all of the labeled addresses that have been generated for that specific wallet. Clicking ‘Used Addresses’ allows you to see every receiving addressed ever generated within the wallet, as well as the current balance of each of these used addresses.' />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer6.four' defaultMessage="Please note that when you send funds, your Blockchain wallet automatically selects addresses to spend from. That's why the current balance of an address can be different from the total received value." />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question7' defaultMessage='How do I know if a transaction has been successfully received/sent?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer7.one' defaultMessage='Transactions will appear almost instantly in your transaction feed. Each currency has its own feed, which you can find by clicking on the corresponding currency in the left navigation of your wallet. While your bitcoin and bitcoin cash transactions are considered complete once they have 3 network confirmations, your ether transactions will be considered complete after 12 confirmations.' />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer7.two' defaultMessage='This typically takes about 30 minutes for bitcoin and bitcoin cash and 5 minutes for ether, but can vary. Until then, your transaction will show up as pending.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question8' defaultMessage='Can my transaction be canceled or reversed?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer8.one' defaultMessage='No, unfortunately we are unable to cancel or reverse any transaction. Even advanced cryptocurrency users can recall an incident when they failed to double-check their transaction details and accidentally sent funds to the wrong recipient, or sent the wrong amount. As unfortunate as it is, cryptocurrency transactions on the Bitcoin, Ethereum, and Bitcoin Cash networks are designed to be       irreversible and we have no control over them. Knowing this, it is extremely important to make sure your transaction details are correct before you click send.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer8.two' defaultMessage="To learn more about why transactions can't be canceled and how this aspect of bitcoin and other similar cryptocurrencies compares to other methods of payment like credit cards and cash, check out our blog post on " />
        <Link href='https://blog.blockchain.com/2016/06/16/support-team-tips-bitcoin-transactions-and-chargebacks/' target='_blank' size='13px' weight={200}>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer8.link' defaultMessage='Bitcoin Transactions & Chargebacks' />
        </Link>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer8.three' defaultMessage='.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question9' defaultMessage="Why hasn't my transaction confirmed yet?" />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer9.one' defaultMessage="Every cryptocurrency transaction that’s sent will flow into what's called the mempool (short for memory pool) before it can be confirmed by miners. When there's a dramatic spike in transaction activity, the mempool can become congested because so many transactions are waiting to be included in the next block." />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer9.two' defaultMessage='An unconfirmed transaction will eventually either be accepted into a block by a mining pool, or be rejected by the network. If it is eventually rejected, the funds will remain on the address they were sent from. At this point, we can only recommend that you wait to see if your transaction is accepted into a block. Clicking the ⬆ icon in your transaction feed will relay to you the details of that  transaction through its respective explorer.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer9.three' defaultMessage='Like all wallet providers, Blockchain has no control over the speed of confirmation, and unfortunately cannot expedite transactions. All we can suggest is using an appropriate transaction fee in order to incentivize a miner to include your transaction into a block. This is always dependent upon the network of miners. To learn more about how this works read our blog ' />
        <Link href='https://blog.blockchain.com/2016/03/16/introducing-dynamic-fees/' target='_blank' size='13px' weight={200}>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer9.link' defaultMessage='here' />
        </Link>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer8.four' defaultMessage='.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question10' defaultMessage='What is a watch-only address?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer10.one' defaultMessage='A watch-only address is a public key that you’ve imported into your wallet by navigating to Settings > Addresses > Import. With every public key, there is a private key behind it, and you need this key in order to spend the funds attached to the account. You can think of this private key as the ‘password’ to your public key.' />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer10.two' defaultMessage='Watch-only addresses are a useful feature to monitor incoming and outgoing transactions or to keep track of an address for repeated payments like rent. Keep in mind— sending and receiving to the same address makes your transaction history easy to trace.' />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer10.three' defaultMessage='Alternatively, you can import a private key from a different wallet provider (which has your public key attached) and spend from it freely within your Blockchain wallet. Since your funds in these addresses are not backed up in your recovery phrase, we strongly recommend ‘transferring’ any funds from these addresses into your main accounts.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question11' defaultMessage='How can I look up a transaction on the blockchain?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer11.one' defaultMessage='Block explorers provide a visually appealing and intuitive way to navigate different currencies’ block chains. For any transactions within your wallet, you can navigate to that currency’s tab and click on the ⬆ icon to view your transaction.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer11.two' defaultMessage='Blockchain has our own bitcoin specific block explorer that launched in August 2011, and was created as a way for anyone to study bitcoin transactions, along with a variety of helpful charts and statistics about activity on the network.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer11.three' defaultMessage='To look up a bitcoin transaction, users can visit' />
        <Link href='https://blockchain.info' target='_blank' size='13px' weight={200}>
          <FormattedMessage id='scenes.faq.group.walletfunctionality.answer11.link' defaultMessage=' https://blockchain.info ' />
        </Link>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer11.four' defaultMessage='and use the search bar on the upper right to learn more about a particular bitcoin address, transaction hash, or block number.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletfunctionality.question12' defaultMessage='Why did my bitcoin cash address change?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer12.one' defaultMessage='Since bitcoin cash is a fork of the bitcoin block chain, its address format previously looked nearly identical to that of bitcoin, which was very confusing to those using it. Now, when you want to send or receive bitcoin cash, you can immediately identify that you’re using the correct address thanks to the added prefix that looks like this: bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a.' />
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer12.one' defaultMessage='Although you can technically still transact to and from legacy BCH addresses, we strongly recommend adopting this new format to eliminate confusion.' />
      </FaqDescription>
    }]
  }, {
    groupTitleMsg: <FormattedMessage id='scenes.faq.group.walletsecurity.title' defaultMessage='Wallet Security' />,
    groupQuestions: [{
      question: <FormattedMessage id='scenes.faq.group.walletsecurity.question1' defaultMessage='What do I need to keep my wallet safe?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer1.one' defaultMessage='Our Security Center helps you to keep your wallet safe and ensures that you always have access to your funds - all in less than 5 minutes. A great place to start is to enable 2-Step Verification and write down your Backup Phrase to make sure you never lose access to your funds. We also recommend using a unique, random password that’s at least 16 characters or more.' />
        <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer1.navlink' defaultMessage=' Click here ' />
        </NavLink>
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer1.two' defaultMessage='to get started.' />
      </FaqDescription>

    }, {
      question: <FormattedMessage id='scenes.faq.group.walletsecurity.question2' defaultMessage='Can Blockchain see or access my funds?' />,
      answer: <FormattedMessage id='scenes.faq.group.walletsecurity.answer2' defaultMessage='We are a noncustodial wallet and therefore do not have access to your funds. This means we cannot view your balances, make payments on your behalf, or prevent you from accessing your funds. With your Blockchain wallet, you retain complete ownership of your finances.' />
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletsecurity.question3' defaultMessage='Can Blockchain reset my password?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer3.one' defaultMessage='At Blockchain, we’re committed to letting customers maintain full control of their funds. In that spirit, we never see or store your password, so we can’t reset it for you. However, we do provide users a backup phrase that can be used to restore access to your funds. Head over to your' />
        <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer3.navlink' defaultMessage=' Security Center ' />
        </NavLink>
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer3.two' defaultMessage='to find yours. Make sure you store it somewhere secure offline and never share it.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.walletsecurity.question4' defaultMessage='Can I close/delete my Blockchain Wallet?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.one' defaultMessage='It is currently not possible to delete a Blockchain digital currency wallet. All personally identifiable information, such as email address and sms phone number, can be removed in' />
        <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.navlink' defaultMessage=' Security Center ' />
        </NavLink>
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.two' defaultMessage='and' />
        <NavLink to='/settings/preferences' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer3.navlink2' defaultMessage=' Preferences ' />
        </NavLink>
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.three' defaultMessage='by replacing them with an invalid submission. For example, one could use 555-5555 for the phone number, or abc@123.com as an email.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.four' defaultMessage='After replacing this associated information, and archiving all imported addresses within the “Addresses” section, all information pertaining to you has been removed. If you are the only one that knows your backup phrase, your wallet is essentially mute until you decide to use it again. We suggest keeping the wallet’s Backup Phrase in a safe place, in case you ever want to return to your wallet.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.five' defaultMessage='If you’ve created an account with one of our exchange partners (Coinify, SFOX, Unocoin or Shapeshift), please reach out to their support teams for further assistance with removing your personal information from their records. For assistance with this, please reach out to our support team' />
        <Link href='https://support.blockchain.com/hc/en-us/requests/new' target='_blank' size='13px' weight={200}>
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.link' defaultMessage=' here' />
        </Link>
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer4.six' defaultMessage='.' />
      </FaqDescription>
    }]
  }, {
    groupTitleMsg: <FormattedMessage id='scenes.faq.group.educationalresources.title' defaultMessage='Educational Resources' />,
    groupQuestions: [{
      answerId: '',
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question1' defaultMessage='What is block chain technology?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.educationalresources.answer1.one' defaultMessage='The block chain is a uniquely architected database for digital transactions. To break it down— a block contains a record of new transactions and once that block is full, it is added to a chain of other blocks of transactions; hence the name “block chain”. This information is publicly viewable on an explorer,' />
        <FormattedMessage id='scenes.faq.group.educationalresources.answer1.two' defaultMessage='where eventually each transaction is approved or rejected by a network of computers (called miners). The block chain is considered immutable (meaning unchanging) because in order to alter a block, all previous blocks would have to also be altered. The vast majority of the community would have to agree on the change and be willing to update all subsequent blocks.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question2' defaultMessage='What is bitcoin?' />,
      answer: <FormattedMessage id='scenes.faq.group.educationalresources.answer2' defaultMessage='Bitcoin (BTC) is the first ever cryptocurrency and is used like other monetary assets in exchange for goods and services. Unlike traditional assets, bitcoin is easily portable, divisible, and irreversible. Bitcoin increases system efficiency and enables the provision of financial services at a drastically lower cost, giving users more power and freedom.' />
    }, {
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question3' defaultMessage='What is bitcoin cash?' />,
      answer: <FormattedMessage id='scenes.faq.group.educationalresources.answer3' defaultMessage='Bitcoin cash is a form of peer-to-peer electronic cash that was created after a fork of the Bitcoin block chain in August 2017. Bitcoin cash, or BCH, has since grown to be one of the top cryptocurrencies, along with bitcoin and ether.' />
    }, {
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question4' defaultMessage='What is ether?' />,
      answer: <FormattedMessage id='scenes.faq.group.educationalresources.answer4' defaultMessage='Ether is a decentralized digital currency, also known as ETH. In addition to being a tradeable cryptocurrency, ether powers the Ethereum network by paying for transaction fees and computational services. Ether is paving the way for a more intelligent financial platform.' />
    }, {
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question5' defaultMessage='What are contract addresses?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.educationalresources.answer5' defaultMessage='Contract addresses are programs that execute requirements set by their creators through running “if-this-then-that” conditions coded onto them. These contract codes can come in many forms, such as the transaction of money when certain conditions are met (think: paying artists a royalty fee every time their content is used), or the exchange of goods between parties (think: paying your monthly rent).' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question6' defaultMessage='Does Blockchain support ERC20 tokens?' />,
      answer: <FormattedMessage id='scenes.faq.group.educationalresources.answer6' defaultMessage='We currently do not support ERC20 tokens, but we are working on adding this capability in the coming months. If you accidently send/receive funds from an ERC20 token to your Blockchain wallet, the funds will remain in the original address, you just won’t be able to access it on our platform (yet!).' />
    }, {
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question7' defaultMessage='What are ERC20 tokens?' />,
      answer: <FormattedMessage id='scenes.faq.group.educationalresources.answer7' defaultMessage='ERC-20 protocol is a standardized way of creating new tokens on the Ethereum block chain.' />
    }, {
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question8' defaultMessage='Where does Blockchain stand on hard forks?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.educationalresources.answer8.one' defaultMessage='At Blockchain, our priority is always our users. Our view on network upgrades and forks is two-fold. First, we will prioritize user safety throughout any network upgrade or instability above all else. Second, we believe our users should maximally benefit from forks wherever feasible. Meaning, if 2 block chains are formed through a fork, we will follow the chain with the most accumulated difficulty and refer to that chain as the main chain. If we find that the minority chain has significant value, we will make that value available for customers once evaluated. It may be necessary to temporarily suspend outgoing transactions for a period of time while the network is unstable, and if this is the case, you will be sufficiently notified. Please keep in mind that you always have access to your funds via your backup phrase' />
        <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
          <FormattedMessage id='scenes.faq.group.walletsecurity.answer8.link' defaultMessage=' here' />
        </NavLink>
        <FormattedMessage id='scenes.faq.group.walletsecurity.answer8.two' defaultMessage='.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question9' defaultMessage='What are nodes?' />,
      answer: <FormattedMessage id='scenes.faq.group.educationalresources.answer9' defaultMessage='Nodes are powerful computers that run software and keep the network intact by approving or rejecting transactions and adding blocks to the chain.' />
    }, {
      question: <FormattedMessage id='scenes.faq.group.educationalresources.question10' defaultMessage='What are miners?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.educationalresources.answer10.one' defaultMessage='We refer to “mining nodes” as miners. Mining nodes group pending transactions into blocks and add them to the block chain. They do this by solving complex mathematical puzzles that come with the software, and include the answer into each block before adding it to the chain of other blocks. When funds are sent, every computer running a mining node receives the same transaction,' />
        <FormattedMessage id='scenes.faq.group.educationalresources.answer10.two' defaultMessage='and multiple people go to approve or deny it. If miners disagree on a transaction, the network automatically rejects the transaction that doesn’t match the rest: preventing fraud. It’s impossible for scammers to manipulate the system this way, since their copy of the block chain wouldn’t match the others, and each transaction has to be agreed upon.' />
      </FaqDescription>
    }]
  }, {
    groupTitleMsg: <FormattedMessage id='scenes.faq.group.coinify.title' defaultMessage='Exchange Services (Coinify)' />,
    groupQuestions: [{
      answerId: '',
      question: <FormattedMessage id='scenes.faq.group.coinify.question1' defaultMessage='What can I buy and sell?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.coinify.answer1.one' defaultMessage='We currently only support buying and selling bitcoin with fiat currency. We’re working on expanding to ether and bitcoin cash soon! In the meantime, you can exchange bitcoin for ether or bitcoin cash in the' />
        <NavLink to='/exchange' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
          <FormattedMessage id='scenes.faq.group.coinify.answer1.navlink' defaultMessage=' Exchange tab ' />
        </NavLink>
        <FormattedMessage id='scenes.faq.group.coinify.answer1.two' defaultMessage='of your wallet.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.coinify.question2' defaultMessage='How do I create a buy order?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.coinify.answer2.one' defaultMessage='Get started by navigating to the Buy & Sell tab of your wallet. Once there, select your country, verify your email address, and begin the identity verification process to set up your account. You’ll need your government issued ID, drivers license, or passport handy for this process. Please note: while Coinify is reviewing your information, you can still buy using a credit card.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.coinify.answer2.two' defaultMessage='Begin your order by entering the amount you would like to buy, selecting your payment method, and entering your bank details. Bank transfers take between 2-3 days with no fees, whereas credit card orders are initiated immediately with a 3% convenience fee. When entering your bank information, be sure that the name on your bank account matches the name on your government issued ID. ' />
        <FormattedMessage id='scenes.faq.group.coinify.answer2.three' defaultMessage='Once you’ve double checked your bank information, you’ll be taken to a confirmation screen to review your order details. Don’t forget, if you’ve chosen bank transfer as your payment method, the allotted funds must be sent to Coinfy’s bank within 48 hours for the trade to initiate. ' />
        <FormattedMessage id='scenes.faq.group.coinify.answer2.four' defaultMessage='You will receive an email from Coinify once the transfer has been completed.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.coinify.question3' defaultMessage='How do I create a sell order?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.coinify.answer3.one' defaultMessage='Get started by navigating to the Buy & Sell tab of your wallet. Once there, select your country, verify your email address, and begin the identity verification portion to set up your account. You’ll need your government issued ID, drivers license, or passport handy for this process. Please note: while Coinify is reviewing your information, you can still sell with a lower daily limit.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.coinify.answer3.two' defaultMessage='To begin your order, enter the amount you’d like to sell and add the bank account you’d like your funds sent to. Make sure your billing and bank details are entered correctly, with no misspellings or inconsistencies, or your order will be rejected. Don’t worry, Blockchain does not store this information in your wallet, it is stored on Coinify’s servers and can be deleted at any time. ' />
        <FormattedMessage id='scenes.faq.group.coinify.answer3.three' defaultMessage='Complete your order by reviewing the details and selecting ‘confirm’. Once you confirm, your funds will be sent from your wallet automatically. You can view this transaction in your ‘Bitcoin’ tab. Depending on your bank— you will see your funds deposited within 1-3 business days. You’ll receive an email from Coinify confirming the transfer once it has been completed.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.coinify.question4' defaultMessage='How can I increase my daily limit?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.coinify.answer4' defaultMessage='You can increase your initial daily limit by completing the identity verification process. To do so, click ‘Increase Your Limit’ or ‘Complete Verification’ on the right hand side of your Buy & Sell tab. To increase your limits even further, you’ll need to complete €1,000 worth of bank transfer trades and wait 14 days for approval.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.coinify.question5' defaultMessage='Why am I blocked from buying?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.coinify.answer5.one' defaultMessage='Buy may not be accessible if you have reached your daily limit or after your initial purchase. After your first credit card order, buy will temporarily be blocked by our exchange partner while they verify your payment information. This will only happen once. Please feel free to reach out to our' />
        <Link href='https://support.blockchain.com/hc/en-us/requests/new' target='_blank' size='13px' weight={200}>
          <FormattedMessage id='scenes.faq.group.coinify.answer5.link' defaultMessage=' support team ' />
        </Link>
        <FormattedMessage id='scenes.faq.group.coinify.two' defaultMessage='with any questions.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.coinify.question6' defaultMessage='Why was my trade rejected?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.coinify.answer6' defaultMessage='Your trade may have been rejected for several reasons including (but not limited to) the inability to verify the provided account information via public databases. As per our companies’ compliance policies, neither Coinify nor Blockchain are able to disclose more detailed information about the decision. We apologize for any inconvenience this may cause you.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.coinify.question7' defaultMessage='Where is my personal information stored?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.coinify.answer7.one' defaultMessage='Your personal information is stored with Coinify, not in your Blockchain wallet. To read more about how your information is stored, visit ' />
        <Link href='https://www.coinify.com/legal/' target='_blank' size='13px' weight={200}>
          <FormattedMessage id='scenes.faq.group.coinify.answer7.link' defaultMessage=' privay policy' />
        </Link>
        <FormattedMessage id='scenes.faq.group.coinify.answer7.two' defaultMessage='.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.coinify.question8' defaultMessage='How can I exchange cryptocurrencies within my Blockchain wallet?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.coinify.answer8.one' defaultMessage='We support exchanging between currencies in most regions across the globe. If you are in a supported region, you can navigate to your Exchange dashboard where you will see an option to exchange between BTC, ETH, and BCH. Enter the amount you would like to exchange, confirm your trade details, and wait for the exchange to complete. ' />
        <FormattedMessage id='scenes.faq.group.coinify.answer8.two' defaultMessage='Pro tip: there are minimum and maximum buttons on the dashboard to quickly see your trading limits.' />
      </FaqDescription>
    }]
  }, {
    groupTitleMsg: <FormattedMessage id='scenes.faq.group.sfox.title' defaultMessage='Exchange Services (SFOX)' />,
    groupQuestions: [{
      answerId: '',
      question: <FormattedMessage id='scenes.faq.group.sfox.question1' defaultMessage='What can I buy and sell?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.sfox.answer1.one' defaultMessage='We currently only support buying and selling bitcoin with fiat currency. We’re working on expanding to ether and bitcoin cash soon! In the meantime, you can exchange bitcoin for ether or bitcoin cash in the' />
        <NavLink to='/exchange' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
          <FormattedMessage id='scenes.faq.group.coinify.answer1.navlink' defaultMessage=' Exchange tab ' />
        </NavLink>
        <FormattedMessage id='scenes.faq.group.sfox.answer1.two' defaultMessage='of your wallet.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.sfox.question2' defaultMessage='How do I create a buy trade?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.sfox.answer2.one' defaultMessage='To create a Buy trade, head over to the Buy & Sell tab in your wallet and select your place of residence. You’ll be prompted to verify your email addresses and phone number, if you haven’t already. Once verified, you will be asked to enter some identification details to set up your account. To make sure you can trade at your maximum limit— you’ll be instructed to upload your government issued ID' />
        <FormattedMessage id='scenes.faq.group.sfox.answer2.two' defaultMessage='and proof of address. Please make sure your name and address matches what’s on your uploaded documents. If they don’t, your account may be rejected.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.sfox.answer2.one' defaultMessage='Once you’ve uploaded your documents, you may either sign into your bank account directly (a crowd favorite), or manually enter your account & routing number, which takes a little longer to process. Then comes the fun stuff. From the Buy dashboard, enter the amount you would like to purchase, confirm your order details, and let the magic happen.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.sfox.question3' defaultMessage='How do I create a sell trade?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.sfox.answer3.one' defaultMessage='Head over to the Buy & Sell tab in your wallet and select your place of residence to create a sell trade. You’ll be prompted to verify your email and phone number if you haven’t already. Once verified, you will be asked to enter some identification details to set up your account. To make sure you can trade at your maximum limit— you’ll be instructed to upload your government issued ID and proof of address.' />
        <FormattedMessage id='scenes.faq.group.sfox.answer3.two' defaultMessage='To connect your bank account, you may either sign into your account directly, or manually enter your account & routing number, which takes a little longer to process. Then comes the fun stuff.' />
        <br />
        <br />
        <FormattedMessage id='scenes.faq.group.sfox.answer3.three' defaultMessage='From the Sell dashboard, enter the amount you would like to sell, confirm your order details, and let the magic happen. Your bitcoin will be sent from your wallet automatically. You can view this transaction in your wallet’s ‘Bitcoin’ tab.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.sfox.question4' defaultMessage='Where is my personal information stored?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.sfox.answer4.one' defaultMessage='Your personal information is stored with SFOX, not in your Blockchain wallet. To read more about how your information is stored, visit SFOX’s' />
        <Link href='https://www.sfox.com/privacy.html' target='_blank' size='13px' weight={200}>
          <FormattedMessage id='scenes.faq.group.sfox.answer4.link' defaultMessage=' privay policy' />
        </Link>
        <FormattedMessage id='scenes.faq.group.sfox.answer4.two' defaultMessage='.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.sfox.question5' defaultMessage='My account was rejected, what do I do now?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.sfox.answer5.one' defaultMessage='If your account was rejected, it’s because SFOX’s risk engine found an issue with your identity verification. Please re-submit these details and triple check they match your uploaded documents. If you’re still having trouble with your trading limits, reach out to our' />
        <Link href='https://support.blockchain.com/hc/en-us/requests/new' target='_blank' size='13px' weight={200}>
          <FormattedMessage id='scenes.faq.group.coinify.answer5.link' defaultMessage=' support team' />
        </Link>
        <FormattedMessage id='scenes.faq.group.sfox.answer5.two' defaultMessage='.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.sfox.question6' defaultMessage='How can I exchange cryptocurrencies within my Blockchain wallet?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.sfox.answer6.one' defaultMessage='We support exchanging between currencies in most regions across the globe. If you are in a supported region, you can navigate to your Exchange dashboard where you will see an option to exchange between BTC, ETH, and BCH. Enter the amount you would like to exchange, confirm your trade details, and wait for the exchange to complete. ' />
        <FormattedMessage id='scenes.faq.group.sfox.answer6.two' defaultMessage='Pro tip: there are minimum and maximum buttons on the dashboard to quickly see your trading limits.' />
      </FaqDescription>
    }]
  }, {
    groupTitleMsg: <FormattedMessage id='scenes.faq.group.noexchange.title' defaultMessage='Exchange Services (not available)' />,
    groupQuestions: [{
      answerId: '',
      question: <FormattedMessage id='scenes.faq.group.noexchange.question1' defaultMessage='Where can I buy and sell?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.noexchange.answer1' defaultMessage='We partner with exchanges across the world to make buying and selling digital assets easier for you. If you’re located in select states across the US or SEPA, you can get started now by creating an account with one of our partners.' />
      </FaqDescription>
    }, {
      question: <FormattedMessage id='scenes.faq.group.noexchange.question2' defaultMessage='How can I exchange cryptocurrencies within my Blockchain wallet?' />,
      answer: <FaqDescription>
        <FormattedMessage id='scenes.faq.group.noexchange.question6.one' defaultMessage='We support exchanging between currencies in most regions across the globe. If you are in a supported region, you can navigate to your Exchange dashboard where you will see an option to exchange between BTC, ETH, and BCH. Enter the amount you would like to exchange, confirm your trade details, and wait for the exchange to complete. ' />
        <FormattedMessage id='scenes.faq.group.noexchange.answer6.two' defaultMessage='Pro tip: there are minimum and maximum buttons on the dashboard to quickly see your trading limits.' />
      </FaqDescription>
    }]
  }]
export default FaqContent
