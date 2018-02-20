# Dream Wallet Front-End - Development guidelines

## IMPORTANT
- Styling _should_ be abstracted from components at all but the most basic level (ui elements like Button, Text, etc)
- Layout components will be imported from _reactstrap_, which uses bootstrap 4 internally
- Components with highly-customized styles (Wallet layout, most angular 1.5 components, etc) will use styled-components
- General components will use _existing css_ where possible in the interest of speed, staying lean, and maintaining design backward-compatibility (Button, bootstrap Modal, etc)


## Structure

* `src`
  * [assets](#assets)
  * [components](#components)
  * [config](#config)
  * [data](#data)
  * [layouts](#layouts)
  * [legacy](#legacy)
  * [middleware](#middleware)
  * [modals](#modals)
  * [providers](#providers)
  * [scenes](#scenes)
  * [services](#services)
  * [store](#store)
  * [themes](#themes)

### Assets

This  directory contains locale resources like locales and sass

* `locales`
* `sass`

### Components

This directory contains shared/reusable components accross the project.

### Config

The **config** folder contains the settings for the development/production builds

You can switch the development build to *testnet*, *live* or *staging* endpoints by commenting out the non necessary configs.

### Data

The **data** folder contains different redux modules specific to the front-end behavior.

It also encapsulates the redux modules available in the core.

Don't forget to update the entry points at the core of this folder whenever you add/update modules

### Layouts

This directory contains different layouts used by the different scenes.

* `Public`
  * used by *Login*, *Register*, *Help*, ... pages
* `Landing`
  * used by *Landing* page
* `Wallet`
  * used by all *Wallet* pages

### Legacy ##

This directory contains some components using blockchain-css style

### Middleware

* `autoDisconnection`
  * manage the timer starting after a user logins and display the AutoDisconnection modal when needed.

### Modals

This directory contains different modals
* `AutoDisconnection`
* `PairingCode`
* `QRCode`
* `QRCodeCapture`
* `RequestBtc`
* `SecondPassword`
* `SendBtc`

### Providers

* `ConnectedIntlProvider`
  * HOC propagating localized messages through the application
* `FormProvider`
  * HOC handling single-screen and multi-screen forms
* `ModalEnhancer`
  * HOC handling modal registration

### Scenes

This directory contains the different pages that can be accessed through the router.

### Services

This direction contains different useful services that encapsulates business logic to keep components as pure as possible.

### Store

This directory contains the redux store configuration and the different middleware plugged in the pipeline.

### Themes

This directory contains the theme class (to discuss)
