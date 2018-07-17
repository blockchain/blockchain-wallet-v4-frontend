## Local SSL

### Overview
Certain features of the application require HTTPS/SSL to run properly. 
By default the Webpack dev server will use HTTP.  However, if the instructions below are followed
and this folder contains both `cert.pem` and `key.pem` files, the dev server will be started over HTTPS.

### Creating/Managing Certificates
Each developer will need to create their own self-signed certificate for use on their local machine.
Please see the following resources for doing so:

- (MacOS) https://certsimple.com/blog/localhost-ssl-fix
- (Windows) https://technet.microsoft.com/itpro/powershell/windows/pkiclient/new-selfsignedcertificate

Be sure to follow the instructions on how to separate your new `.pem` file into separate key and cert files. 
Name these files `cert.pem` and `key.pem` and place within this directory.

After that is all completed, the dev server will now auto-start with SSL enabled at [https://localhost:8080]()

