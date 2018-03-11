# Blockchain Info Components

## Commands

1. `yarn build`: build the release
2. `yarn watch`: build the release and watch for changes
3. `yarn storybook`: start the storybook website at http://localhost:6006
4. `yarn build-storybook`: rebuild the storybook

## Adding Icons

1. Open an incognito window
2. Navigate to https://icomoon.io/app/#/select
3. Drag and drop src/Fonts/Icomoon/selection.json
4. Add your new icon
5. Find 'View/Edit Info' in hamburger menu, click 'Remove All Colors'
6. Select the contents from selection.json and the new icon.
7. Generate the font family/files
8. Make sure to replace the old selection.json with the new one
9. Update src/Icons/Icomoon.js with the new icon (the old icons should not need to change)
