## Dream Wallet Front-end

# Commands

1. `yarn install`: restore the npm dependencies
2. `yarn run build`: build the project
3. `yarn run start`: start the website on http://localhost:8080

# Development mode

Since `dream-wallet` is not published as an npm package yet, when you install the frontend the dream-wallet transpiled files are not build properly.

For now, the only way to make it work is cloning `dream-wallet` locally too.

1. `cd dream-wallet && npm link`
2. `cd dream-wallet-frontend && npm link dream-wallet`
3. `cd dream-wallet && npm run watch`

# Todo

1. use yarn for `dream-wallet`
2. use yarn instead of npm-link?

# Important

**Two small changes in the npm package blockchain-css should be done** (until this one is updated) **or the build will break!**

1. blockchain-css/sass/elements/_forms.scss

```
select {
  height: 40px;
  background: white;
  @extend .form-control;
  border: 1px solid #ccc;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background-size: 12px;
  background-repeat: no-repeat;
  background-position: center right 10px;
  // background-image: url('../img/select-arrow.png');
}
```

2. blockchain/css/sass/_fonts.scss

```
@if($blockchain_fonts_path == null) { $blockchain_fonts_path: '../fonts'; }

@mixin declare-font-face($font-name, $font-family, $font-filename, $font-weight : normal, $font-style :normal, $font-stretch : normal) {
  @font-face {
    font-family: '#{$font-family}';
    src: url('#{$blockchain_fonts_path}/#{$font-name}/#{$font-filename}.eot');
    src: url('#{$blockchain_fonts_path}/#{$font-name}/#{$font-filename}.eot?#iefix') format('embedded-opentype'),
         url('#{$blockchain_fonts_path}/#{$font-name}/#{$font-filename}.ttf') format('truetype'),
         url('#{$blockchain_fonts_path}/#{$font-name}/#{$font-filename}.svg') format('svg');
    font-weight: $font-weight;
    font-style: $font-style;
    font-stretch: $font-stretch;
  }
}
```
