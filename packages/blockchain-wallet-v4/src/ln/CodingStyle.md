# Coding Style

 - All binary data should be passed along and saved as node.js Buffers
 - Unless postfixed with `64`, all numbers should be represented as plain integers.
 - Variable naming
    - What data is it?
    - Whose data is it?
    - What is the encoding of the data?
    - Ex.
        - pubKeyLocalHex (right)
        - localPubKey (wrong)
    - All names should be abbreviated
        - public -> pub
        - private -> priv
        - transaction -> tx
        - ...
 - Peers should always be referenced by their `pubKey`
 - Key pairs should just be called `key`, compared to `pubKey`/`privKey`