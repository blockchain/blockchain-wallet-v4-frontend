## Local SSL

### Overview
Certain features of the application require HTTPS/SSL to run properly. 
By default the Webpack dev server will use HTTP.  However, if the instructions below are followed
and this folder contains both `cert.pem` and `key.pem` files, the dev server will be started over HTTPS.

### Creating/Managing Certificates
Each developer will need to create their own self-signed certificate for use on their local machine.

Follow these steps for MacOs:
1) From the application root run the following command: 
    ```$sh
    cd ./config/ssl
    ```
2) Next generate pem files by running the following command:
    ```$sh
    openssl req -x509 -out cert.pem -keyout key.pem \
      -newkey rsa:2048 -nodes -sha256 \
      -subj '/CN=localhost' -extensions EXT -config <( \
       printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
    ```
3) Open Chrome and navigate to `chrome://flags/#allow-insecure-localhost` via the URL
4) Enable the "Allow invalid certificates for resources loaded from localhost." setting
5) Now simply start the HTTPS enabled server via `yarn start` and navigate to [https://localhost:8080]()

NOTE: Chrome will still warn you that the connection is "Not Secure" via red letters but that is OK for our purposes

Windows
- TODO
