# Blockchain-Info-Components

A shared UI components library for blockchain.info applications.

## Deprecation Warning

This library will soon be fully deprecated and removed. New and existing applications should now use/migrate to the new
components [library](https://github.com/blockchain/components).

## Adding New Icons

1. Open an incognito window
2. Navigate to https://icomoon.io/app/#/select
3. Drag and drop src/Fonts/Icomoon/selection.json
4. Add your new icon
5. Find 'View/Edit Info' in hamburger menu, click 'Remove All Colors' (it's under the properties option)
6. Select the contents from selection.json and the new icon.
7. Generate the font family/files
8. Make sure to replace the old selection.json with the new one
9. Update src/Icons/Icomoon.js with the new icon (the old icons should not need to change)
