# Dream Wallet Front-End - Development guidelines

## Project structure

* `src`
  * [assets](#assets)
  * [components](#components)
  * [config](#config)
  * [data](#data)
  * [forms](#forms)
  * [layouts](#layouts)
  * [middleware](#middleware)
  * [modals](#modals)
  * [providers](#providers)
  * [scenes](#scenes)
  * [services](#services)
  * [store](#store)

### Assets

This  directory contains locale resources like locales and sass

* `images`
* `locales`

### Components

This directory contains shared/reusable components across the project.

### Config

The **config** folder contains the settings that are not retrieved from wallet-options

### Data

The **data** folder contains different redux modules specific to the front-end behavior.

It also encapsulates the redux modules available in the core.

Don't forget to update the entry points at the core of this folder whenever you add/update modules

### Forms

We use <https://redux-form.com/> to handle forms in the project. It's important to correctly pass the submit handler to your template. Please follow the below pattern.

in index.js:
```
onSubmit(){
  // do not call e.preventDefault()
  // do form submit stuff
}

---------

render () {
  return <Template 
    onSubmit={this.onSubmit}
  />
}
```

in template.js, redux-form will convert `onSubmit` to `handleSubmit` so all you need to do is:
```
const { handleSubmit } = this.props

<Form onSubmit={handleSubmit}>
  // form markup
  <Button type='submit'></Button>
</Form>
```

### Layouts

This directory contains different layouts used by the different scenes.

* `Public`
  * used by *Login*, *Register*, *Help*, ... pages
* `Wallet`
  * used by all *Wallet* pages

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
* ....

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
