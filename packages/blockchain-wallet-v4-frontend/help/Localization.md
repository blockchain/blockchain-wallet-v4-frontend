# Wallet V4 - Localization guidelines

## Introduction
* The project is using the popular **react-intl** package for localization
* Take a look at [this address](https://github.com/yahoo/react-intl/wiki) to get more details

## Translations

Two components can be used for translations:

* **FormattedMessage**
    * id:
        * Mandatory
        * Must be unique
        * Conventions: `the.path.to.this.component.myrelevantkey`
    * defaultMessage
        * Mandatory
        * Must be the english value (for fallback)
        * Conventions
            * Should stay on 1 line in the code
            * Should never be longer than 1 sentence
            * Can contain dynamic values encapsulated in brackets: **{dynamicValue}**
            * If the value contains a single quote, you can use double quote to define your defaultMessage
    * values:
        * Optional
        * Allows us to inject a text/number variable in the translation
        * Conventions: `{{firstName:'Guillaume', lastName: 'Marquilly'}}`
    * description
        * Optional
        * Can contain some details about this translation that we could transfer to the translation agency

* **FormattedHtmlMessage** 
    * **FORBIDDEN**
    *  it is using internally React `setDangerousHtml` and we should not render any html with potential malicious injections
    *  if you need to style the translations, just use a surrounding div

### Examples

*Example 1: short translation*
```
<FormattedMessage id='scenes.landing.main.transactions' defaultMessage='Transactions' />
```

*Example 2: styled translation*
```
<div className='text-uppercase'>
    <FormattedMessage id='scenes.landing.main.transactions' defaultMessage='Transactions' />
</div>
```

*Example 3: translation containing a single quote*
```
<FormattedMessage id='scenes.faq.needmorehelp' defaultMessage="Can't find what you're looking for?" />
```

*Example 4: long translation*
```
<FormattedMessage id='scenes.faq.item4.answer' defaultMessage='To receive bitcoin, the sender needs your bitcoin address.' />
<FormattedMessage id='scenes.faq.item4.answer2' defaultMessage='Our wallet will automatically generate a new address for each transaction.' />
<FormattedMessage id='scenes.faq.item4.answer3' defaultMessage='Click on Receive and copy the address to share with the sender.' />
<FormattedMessage id='scenes.faq.item4.answer4' defaultMessage='To send bitcoin, click Send, enter the recipient’s bitcoin address in the ‘To’ field and how much you want to send.' />
```

*Example 5: translation with dynamic value*
```
<FormattedMessage id='scenes.landing.main.walletsamount' defaultMessage='{nbWallets} Million+' values={{nbWallets: 14}} />
```
