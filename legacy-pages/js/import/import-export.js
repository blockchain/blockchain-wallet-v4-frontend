function _ImportExport() {

    this.init = function(container, success, error) {
        MyWallet.setLoadingText('Loading Import Export View');

        if (!container.is(':empty')) {
            bind();
            success();
            return;
        }

        $.ajax({
            type: "GET",
            url: root + 'wallet/import-export-template',
            timeout: 60000,
            data : {format : 'plain', language : MyWallet.getLanguage()},
            success: function(html) {
                try {
                    container.html(html);

                    bind();

                    success();
                } catch (e) {
                    console.log(e);

                    error();
                }
            },
            error : function() {
                MyWallet.makeNotice('error', 'misc-error', 'Error Downloading Import Export Template');

                error();
            }
        });
    }

    function showWatchOnlyWarning(address, success) {
        var modal = $('#watch-only-modal');

        modal.modal({
            keyboard: true,
            backdrop: "static",
            show: true
        });


        modal.center();

        modal.find('.address').text(address);

        modal.find('.btn.btn-secondary').unbind().click(function() {
            modal.modal('hide');
        });

        modal.find('.btn.btn-primary').unbind().click(function() {
            success();

            modal.modal('hide');
        });
    }

    function showPrivateKeyWarningModal(address, import_direct, sweep) {
        var modal = $('#import-private-key-warning-modal');

        modal.modal({
            keyboard: true,
            backdrop: "static",
            show: true
        });

        modal.center();

        modal.find('.address').text(address);

        BlockchainAPI.get_balance([address], function(balance) {
            modal.find('.address').text(address + " - " + formatBTC(balance));
        }, function(e) {
            MyWallet.makeNotice('error', 'misc-error', e);
        });

        modal.find('.btn.btn-secondary').unbind().click(function() {
            import_direct();
            modal.modal('hide');
        });

        modal.find('.btn.btn-primary').unbind().click(function() {
            sweep();
            modal.modal('hide');
        });
    }

    function bind() {
        $('a[data-toggle="tab"]').unbind().on('show', function(e) {
            $(e.target.hash).trigger('show');
        });

        $("#import-json-btn").unbind().click(function() {

            $(this).prop("disabled", true);

            importTextArea($('#import-json'));

            $(this).prop("disabled", false);
        });

        $('#import-address-btn').unbind().click(function() {
            var value = $.trim($('#import-address-address').val());

            if (value.length = 0) {
                MyWallet.makeNotice('error', 'misc-error', 'You must enter an address to import');
                return;
            }

            try {
                var address = new Bitcoin.Address(value);

                if (address.toString() != value) {
                    throw 'Inconsistency between addresses';
                }

                $('#import-address-address').val('');

                showWatchOnlyWarning(value, function() {
                    try {
                        if (MyWallet.addWatchOnlyAddress(value)) {
                            MyWallet.makeNotice('success', 'added-address', 'Successfully Added Address ' + address);

                            try {
                                ws.send('{"op":"addr_sub", "addr":"'+address+'"}');
                            } catch (e) { }

                            //Backup
                            MyWallet.backupWallet('update', function() {
                                MyWallet.get_history();
                            });
                        } else {
                            throw 'Wallet Full Or Addresses Exists'
                        }
                    } catch (e) {
                        MyWallet.makeNotice('error', 'misc-error', e);
                    }
                });
            } catch (e) {
                MyWallet.makeNotice('error', 'misc-error', 'Error importing address: ' + e);
                return;
            }
        });

        $('#import-private-scan').unbind().click(function() {
            MyWallet.getSecondPassword(function() {
                loadScript('wallet-legacy/signer', function() {
                    showPrivateKeyModal(function (key, compressed) {
                        if (MyWallet.addPrivateKey(key, {compressed : compressed, app_name : IMPORTED_APP_NAME, app_version : IMPORTED_APP_VERSION})) {

                            //Perform a wallet backup
                            MyWallet.backupWallet('update', function() {
                                MyWallet.get_history();
                            });

                            MyWallet.makeNotice('success', 'added-address', 'Imported Bitcoin Address ' + key.getBitcoinAddress());
                        } else {
                            throw 'Unable to add private key for bitcoin address ' + key.getBitcoinAddress();
                        }

                    }, function(e) {
                        MyWallet.makeNotice('error', 'misc-error', e);
                    }, 'Any Private Key');
                });
            });
        });

        $('#import-private-btn').unbind().click(function() {
            var input = $('#import-private-key');

            try {
                importPrivateKeyUI($.trim(input.val()));
            } catch(e) {
                MyWallet.makeNotice('error', 'misc-error', 'Error importing private key: ' + e);
            }

            input.val('');
        });

        $('#export-priv-format').change(function (e) {
            $("#json-unencrypted-export").val(MyWallet.makeWalletJSON($('#export-priv-format').val()));
        });

        $('#export-crypted').on('show', function() {
            $("#json-crypted-export").val(MyWallet.getEncryptedWalletData());
        });

        $('#export-unencrypted').on('show', function() {
            MyWallet.getSecondPassword(function() {
                $('#export-priv-format').val('base58');
                $("#json-unencrypted-export").val(MyWallet.makeWalletJSON($('#export-priv-format').val()));
            });
        });

        $('#import-backup').on('show', function() {
            var self = this;

            loadBackupsList($(self));
        });

        $('.paper-wallet-btn').unbind().click(function() {
            loadScript('wallet-legacy/paper-wallet', function() {
                PaperWallet.showModal();
            });
        });
    }

    this.importJSON = function(input_text, opt, success, error) {
        try {
            var nKeysFound = 0;

            if (input_text == null || input_text.length == 0) {
                throw 'No import data provided!';
            }
            var obj = null;

            try {
                //First try a simple decode
                obj = $.parseJSON(input_text);

                if (obj == null)
                    throw 'null input_text';

                if (obj.payload)
                    throw 'version 2 wallet';
            } catch(e) {

                //Maybe it's encrypted?
                MyWallet.decryptWallet(input_text, opt.main_password, function(obj, root) {
                    ImportExport.importJSON(JSON.stringify(obj), opt, success, error);
                }, error);
                return;
            }

            var key_n = 0;
            var really_import = function() {
                try {
                    //Parse the  wallet backup
                    var json_key = obj.keys[key_n];

                    var addr = json_key.addr;

                    if (addr != null && addr.length > 0 && addr != 'undefined') {
                        try {
                            var priv = json_key.priv;
                            if (!priv)
                                priv = json_key.sec;

                            //If there is a private key we first need to decrypt it, detect the format then re-insert
                            if (priv != null) {

                                var tmp_pbkdf2_iterations = 10;
                                if (obj.options && obj.options.pbkdf2_iterations)
                                    tmp_pbkdf2_iterations = obj.options.pbkdf2_iterations;

                                //If the wallet is double encrypted we need to decrypt the key first
                                if (obj.double_encryption) {
                                    if (opt.second_password) {
                                        var decrypted = MyWallet.decrypt(priv, obj.sharedKey + opt.second_password, tmp_pbkdf2_iterations, MyWallet.isBase58);

                                        if (decrypted == null)
                                            throw 'Error decrypting private key for address ' + addr;

                                        priv = decrypted;
                                    } else {
                                        MyWallet.getPassword($('#import-second-password-modal'), function(__password) {
                                            opt.second_password = __password;

                                            ImportExport.importJSON(input_text, opt, success, error)
                                        });
                                        return;
                                    }
                                }

                                var format = MyWallet.detectPrivateKeyFormat(priv);
                                var key = MyWallet.privateKeyStringToKey(priv, format);

                                if (key.getBitcoinAddress().toString() == addr || key.getBitcoinAddressCompressed().toString() == addr) {

                                    try {
                                        MyWallet.addPrivateKey(key,{
                                            compressed : format == 'compsipa',
                                            app_name : obj.created_device_name ? obj.created_device_name : IMPORTED_APP_NAME,
                                            app_version : obj.created_device_version ? obj.created_device_version : IMPORTED_APP_VERSION,
                                            created_time : obj.created_time ? obj.created_time : 0
                                        });
                                    } catch (e) {}

                                    ++nKeysFound;
                                } else {
                                    throw 'Not importing ' + addr + ' because it is inconsistent with the decoded address ';
                                }
                            }

                            //Copy over the tag and label
                            if (MyWallet.addressExists(addr)) {
                                if (json_key.label && $.trim(json_key.label.length) > 0)
                                    MyWallet.setAddressLabel(addr, $.trim(json_key.label));

                                if (json_key.tag)
                                    MyWallet.setAddressTag(addr, json_key.tag);
                                else
                                    MyWallet.setAddressTag(addr, 1); //Mark as unsynced
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }

                    if (key_n < obj.keys.length-1) {
                        ++key_n;
                        setTimeout(really_import, 10);
                        return;
                    }

                    if (obj.address_book != null) {
                        for (var i2 = 0; i2 < obj.address_book.length; ++i2) {
                            var addressbook_obj = obj.address_book[i2];
                            if (addressbook_obj.addr && addressbook_obj.label)
                                MyWallet.addAddressBookEntry(addressbook_obj.addr, addressbook_obj.label);
                        }
                    }

                    //Clear the old value
                    $('#import-input_text').val('');

                    if (nKeysFound > 0)
                        success();
                    else
                        throw 'No Private Keys Imported. Unknown Format Incorrect Password';
                } catch (e) {
                    console.log(e);

                    try {
                        error(e);
                    } catch (e) {}
                }
            }

            if (obj == null) {
                nKeysFound = parsePrivateKeysFromText(input_text);

                //Clear the old value
                $('#import-input_text').val('');

                if (nKeysFound > 0)
                    success();
                else
                    throw 'No Private Keys Imported. Unknown Format or Incorrect Password';
            } else if (obj != null && obj.keys != null && obj.keys.length > 0) {

                if (obj.keys.length > 500) {
                    MyWallet.makeNotice('info', 'keys-skipped', 'Some keys may have been skipped');

                    var ii = 0;
                    var test_balances=[];
                    var keys_copy = obj.keys.slice(0);

                    var do_part = function() {
                        try {
                            for (; ii < keys_copy.length; ++ii) {
                                var json_key = keys_copy[ii];
                                var addr = json_key.addr;

                                if (addr == null || addr.length == 0 || addr == 'undefined')
                                    continue;

                                test_balances.push(json_key.addr);

                                if (test_balances.length == 500 || (ii == obj.keys.length-1 && test_balances.length > 0)) {
                                    BlockchainAPI.get_balances(test_balances, function(response) {
                                        try {
                                            for (var key in response) {
                                                if (response[key].final_balance == 0) {
                                                    for (var iii = 0; iii < obj.keys.length; ++iii) {
                                                        var _addr = obj.keys[iii].addr;

                                                        if (_addr == key) {
                                                            if (obj.keys.length > 1) {
                                                                obj.keys.splice(iii, 1);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } catch (e) {
                                            console.log(e);

                                            try {
                                                error(e);
                                            } catch (e) {}
                                        }
                                    }, function(e) {
                                        console.log(e);

                                        try {
                                            error(e);
                                        } catch (e) {}
                                    });

                                    test_balances = [];

                                    if (ii == obj.keys.length-1) {
                                        really_import();
                                    } else {
                                        setTimeout(do_part, 100);
                                    }

                                    return;
                                }
                            }
                        } catch (e) {
                            console.log(e);

                            try {
                                error(e);
                            } catch (e) {}
                        }
                    };

                    do_part();
                } else {
                    really_import();
                }
            } else {
                throw 'Unknown Format'
            }
        } catch (e) {
            console.log(e);

            try {
                error(e);
            } catch (e) {}
        }
    }

    function parsePrivateKeysFromText(input_text) {
        var components = input_text.split(/\W+/g);

        try {
            var nKeysFound = 0;

            for (var i in components) {
                var word = components[i];

                try {
                    var format = MyWallet.detectPrivateKeyFormat(word);

                    var key = MyWallet.privateKeyStringToKey(word, format);

                    var compressed = format == 'compsipa';

                    try {
                        MyWallet.addPrivateKey(key, {compressed : compressed, app_name : IMPORTED_APP_NAME, app_version : IMPORTED_APP_VERSION});
                    } catch (e) {}

                    ++nKeysFound;
                } catch (e) { }
            }

            return nKeysFound;

        } catch (e) {
            MyWallet.makeNotice('error', 'misc-error', e);
        }

        return false;
    }

    function importTextArea(area) {
        MyWallet.getMainPassword(function(main_password) {
            MyWallet.getSecondPassword(function(second_password) {
                ImportExport.importJSON(area.val(), {main_password : main_password, second_password : second_password},
                    function() {
                        //Perform a wallet backup
                        MyWallet.backupWallet('update', function() {
                            MyWallet.get_history();
                        });
                    }, function(e) {
                        MyWallet.makeNotice('error', 'misc-error', e);
                    });
            });
        });
    }

    function showCompressedPrivateKeyWarning(success, error) {
        var modal = $('#compressed-private-key-modal');

        modal.modal({
            keyboard: true,
            backdrop: "static",
            show: true
        });

        modal.center();

        modal.find('.btn.btn-secondary').unbind().click(function() {
            success();
            modal.modal('hide');
        });

        modal.find('.btn.btn-primary').unbind().click(function() {
            error();
            modal.modal('hide');
        });
    }

    function importS3WalletBackup(id) {
        MyWallet.setLoadingText('Importing Backup');

        MyWallet.securePost('wallet', {method: 'get-backup', id : id, format : 'json'}, function(obj) {
            try {
                var payload = obj.payload;

                MyWallet.getMainPassword(function(main_password) {
                    MyWallet.getSecondPassword(function(second_password) {
                        ImportExport.importJSON(payload, {main_password : main_password, second_password : second_password}, function() {
                            //Perform a wallet backup
                            MyWallet.backupWallet('update', function() {
                                MyWallet.get_history();
                            });
                        }, function(e) {
                            MyWallet.makeNotice('error', 'misc-error', e);
                        });
                    });
                });
            } catch (e) {
                MyWallet.makeNotice('error', 'misc-error', e);
            }
        }, function(data) {
            MyWallet.makeNotice('error', 'misc-error', data.responseText);
        });
    }

    function loadBackupsList(el) {
        MyWallet.setLoadingText('Loading Backup List');

        MyWallet.securePost('wallet', {method : 'list-backups', format : 'json'}, function(obj) {
            try {
                if (obj == null) {
                    throw 'Failed to get backups';
                }

                var tbody = el.find('table tbody').empty();

                var results = obj.results;

                if (results.length == 0) {
                    throw 'No backups found';
                }

                for (var i in results) {
                    var result = results[i];

                    var tr = $('<tr><td>'+result.name+'</td><td>'+dateToString(new Date(result.last_modified))+'</td><td>'+result.size+'</td><td><a class="act-import">Import</a></td></tr>');

                    (function(result) {
                        tr.find('.act-import').click(function() {
                            importS3WalletBackup(result.id);
                        });
                    })(result);

                    tbody.append(tr);
                }
            } catch (e) {
                MyWallet.makeNotice('error', 'misc-error', e);
            }
        }, function(data) {
            MyWallet.makeNotice('error', 'misc-error', data.responseText);
        });
    }

    function importPrivateKeyUI(value, label, success, app_name) {
        MyWallet.getSecondPassword(function() {
            try {
                if (!value || value.length == 0) {
                    throw 'You must enter a private key to import';
                }

                function reallyInsertKey(key, compressed) {
                    try {
                        if (MyWallet.addPrivateKey(key, {compressed : compressed, app_name : app_name ? app_name : IMPORTED_APP_NAME, app_version : IMPORTED_APP_VERSION})) {

                            var addr = compressed ? key.getBitcoinAddressCompressed().toString() : key.getBitcoinAddress().toString();

                            if (label && label.length > 0)
                                MyWallet.setAddressLabel(addr, label);

                            //Perform a wallet backup
                            MyWallet.backupWallet('update', function() {
                                MyWallet.get_history();
                            });

                            if (success) success();

                            MyWallet.makeNotice('success', 'added', 'Added Bitcoin Address ' + addr);
                        } else {
                            throw 'Unable to add private key for bitcoin address ' + addr;
                        }
                    } catch (e) {
                        MyWallet.makeNotice('error', 'misc-error', e);
                    }
                }

                var format = MyWallet.detectPrivateKeyFormat(value);

                if (format == 'bip38') {
                    MyWallet.getPassword($('#import-private-key-password'), function(_password) {
                        ImportExport.parseBIP38toECKey(value, _password, function(key, isCompPoint) {
                            //success
                            reallyInsertKey(key, isCompPoint);
                        }, function(e) {
                            //error
                            MyWallet.makeNotice('error', 'misc-error', e);
                        });
                    });

                    return;
                }

                var key = MyWallet.privateKeyStringToKey(value, format);

                var addr = null;
                if (format == 'compsipa') {
                    addr = key.getBitcoinAddressCompressed().toString();
                } else {
                    addr = key.getBitcoinAddress().toString();
                }

                if (addr == null || addr.length == 0 || addr == 'undefined')
                    throw 'Unable to decode bitcoin addresses from private key';

                if (MyWallet.addressExists(addr) && !MyWallet.isWatchOnly(addr))
                    throw 'Address already exists in the wallet';

                function sweep() {
                    loadScript('wallet-legacy/signer', function() {
                        BlockchainAPI.get_balance([addr], function(value) {
                            var obj = initNewTx();

                            obj.fee = obj.base_fee; //Always include a fee
                            obj.to_addresses.push({address: new Bitcoin.Address(MyWallet.getPreferredAddress()), value : BigInteger.valueOf(value).subtract(obj.fee)});
                            obj.from_addresses = [addr];
                            obj.extra_private_keys[addr] = B58.encode(key.priv);

                            obj.start();

                        }, function() {
                            MyWallet.makeNotice('error', 'misc-error', 'Error Getting Address Balance');
                        });
                    });
                };

                showPrivateKeyWarningModal(addr, function() {
                    if (format == 'compsipa') {
                        showCompressedPrivateKeyWarning(function() {
                            reallyInsertKey(key, true);
                        }, function() {
                            sweep();
                        });
                    } else {
                        reallyInsertKey(key, false);
                    }
                }, function() {
                    //Sweep
                    sweep();
                });


            } catch (e) {
                MyWallet.makeNotice('error', 'misc-error', 'Error importing private key: ' + e);
            }
        });
    }

    this.parseBIP38toECKey = function(base58Encrypted, passphrase, success, error) {
        var hex;
        try {
            hex = Bitcoin.Base58.decode(base58Encrypted);
        } catch (e) {
            error('Invalid Private Key');
            return;
        }

        if (hex.length != 43) {
            error('Invalid Private Key');
            return;
        } else if (hex[0] != 0x01) {
            error('Invalid Private Key');
            return;
        }

        var expChecksum = hex.slice(-4);
        hex = hex.slice(0, -4);

        var checksum =  Crypto.SHA256(Crypto.SHA256(hex, { asBytes: true }), { asBytes: true });
        if (checksum[0] != expChecksum[0] || checksum[1] != expChecksum[1] || checksum[2] != expChecksum[2] || checksum[3] != expChecksum[3]) {
            error('Invalid Private Key');
            return;
        }

        var isCompPoint = false;
        var isECMult = false;
        var hasLotSeq = false;
        if (hex[1] == 0x42) {
            if (hex[2] == 0xe0) {
                isCompPoint = true;
            } else if (hex[2] != 0xc0) {
                error('Invalid Private Key');
                return;
            }
        } else if (hex[1] == 0x43) {
            isECMult = true;
            isCompPoint = (hex[2] & 0x20) != 0;
            hasLotSeq = (hex[2] & 0x04) != 0;
            if ((hex[2] & 0x24) != hex[2]) {
                error('Invalid Private Key');
                return;
            }
        } else {
            error('Invalid Private Key');
            return;
        }

        var decrypted;
        var AES_opts = {mode: new Crypto.mode.ECB(Crypto.pad.NoPadding), asBytes: true};

        var verifyHashAndReturn = function() {
            var tmpkey = new Bitcoin.ECKey(decrypted);
            var base58AddrText = isCompPoint ? tmpkey.getBitcoinAddressCompressed() : tmpkey.getBitcoinAddress();

            checksum = Crypto.SHA256(Crypto.SHA256(base58AddrText.toString(), { asBytes: true }), { asBytes: true });

            if (checksum[0] != hex[3] || checksum[1] != hex[4] || checksum[2] != hex[5] || checksum[3] != hex[6]) {
                error('Incorrect Passphrase');
                return;
            }

            success(tmpkey, isCompPoint);
        };

        if (!isECMult) {
            var addresshash = hex.slice(3, 7);
            ImportExport.Crypto_scrypt(passphrase, addresshash, 16384, 8, 8, 64, function(derivedBytes) {
                var k = derivedBytes.slice(32, 32+32);
                decrypted = Crypto.AES.decrypt(hex.slice(7, 7+32), k, AES_opts);
                for (var x = 0; x < 32; x++) decrypted[x] ^= derivedBytes[x];
                verifyHashAndReturn();
            });
        } else {
            var ownerentropy = hex.slice(7, 7+8);
            var ownersalt = !hasLotSeq ? ownerentropy : ownerentropy.slice(0, 4);
            ImportExport.Crypto_scrypt(passphrase, ownersalt, 16384, 8, 8, 32, function(prefactorA) {
                var passfactor;
                if (!hasLotSeq) {
                    passfactor = prefactorA;
                } else {
                    var prefactorB = prefactorA.concat(ownerentropy);
                    passfactor = Crypto.SHA256(Crypto.SHA256(prefactorB, { asBytes: true }), { asBytes: true });
                }
                var kp = new Bitcoin.ECKey(passfactor);
                var passpoint = kp.getPubCompressed();

                var encryptedpart2 = hex.slice(23, 23+16);

                var addresshashplusownerentropy = hex.slice(3, 3+12);
                ImportExport.Crypto_scrypt(passpoint, addresshashplusownerentropy, 1024, 1, 1, 64, function(derived) {
                    var k = derived.slice(32);

                    var unencryptedpart2 = Crypto.AES.decrypt(encryptedpart2, k, AES_opts);
                    for (var i = 0; i < 16; i++) { unencryptedpart2[i] ^= derived[i+16]; }

                    var encryptedpart1 = hex.slice(15, 15+8).concat(unencryptedpart2.slice(0, 0+8));
                    var unencryptedpart1 = Crypto.AES.decrypt(encryptedpart1, k, AES_opts);
                    for (var i = 0; i < 16; i++) { unencryptedpart1[i] ^= derived[i]; }

                    var seedb = unencryptedpart1.slice(0, 0+16).concat(unencryptedpart2.slice(8, 8+8));

                    var factorb = Crypto.SHA256(Crypto.SHA256(seedb, { asBytes: true }), { asBytes: true });

                    var ps = secp256k1();
                    var privateKey = BigInteger.fromByteArrayUnsigned(passfactor).multiply(BigInteger.fromByteArrayUnsigned(factorb)).remainder(ps.getN());

                    decrypted = privateKey.toByteArrayUnsigned();
                    verifyHashAndReturn();
                });
            });
        }
    }

    var MAX_VALUE = 2147483647;
    var workerUrl = null;

    this.Crypto_scrypt = function(passwd, salt, N, r, p, dkLen, callback) {
        if (N == 0 || (N & (N - 1)) != 0) throw Error("N must be > 0 and a power of 2");

        if (N > MAX_VALUE / 128 / r) throw Error("Parameter N is too large");
        if (r > MAX_VALUE / 128 / p) throw Error("Parameter r is too large");

        var PBKDF2_opts = {iterations: 1, hasher: Crypto.SHA256, asBytes: true};

        var B = Crypto.PBKDF2(passwd, salt, p * 128 * r, PBKDF2_opts);

        try {
            var i = 0;
            var worksDone = 0;
            var makeWorker = function() {
                if (!workerUrl) {
                    var code = '('+scryptCore.toString()+')()';
                    var blob;
                    try {
                        blob = new Blob([code], {type: "text/javascript"});
                    } catch(e) {
                        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
                        blob = new BlobBuilder();
                        blob.append(code);
                        blob = blob.getBlob("text/javascript");
                    }
                    workerUrl = URL.createObjectURL(blob);
                }
                var worker = new Worker(workerUrl);
                worker.onmessage = function(event) {
                    var Bi = event.data[0], Bslice = event.data[1];
                    worksDone++;

                    if (i < p) {
                        worker.postMessage([N, r, p, B, i++]);
                    }

                    var length = Bslice.length, destPos = Bi * 128 * r, srcPos = 0;
                    while (length--) {
                        B[destPos++] = Bslice[srcPos++];
                    }

                    if (worksDone == p) {
                        callback(Crypto.PBKDF2(passwd, B, dkLen, PBKDF2_opts));
                    }
                };
                return worker;
            };
            var workers = [makeWorker()];
            workers[0].postMessage([N, r, p, B, i++]);
            if (p > 1) {
                workers[1].postMessage([N, r, p, B, i++]);
            }
        } catch (e) {
            window.setTimeout(function() {
                scryptCore();
                callback(Crypto.PBKDF2(passwd, B, dkLen, PBKDF2_opts));
            }, 0);
        }

        // using this function to enclose everything needed to create a worker (but also invokable directly for synchronous use)
        function scryptCore() {
            var XY = [], V = [];

            if (typeof B === 'undefined') {
                onmessage = function(event) {
                    var data = event.data;
                    var N = data[0], r = data[1], p = data[2], B = data[3], i = data[4];

                    var Bslice = [];
                    arraycopy32(B, i * 128 * r, Bslice, 0, 128 * r);
                    smix(Bslice, 0, r, N, V, XY);

                    postMessage([i, Bslice]);
                };
            } else {
                for(var i = 0; i < p; i++) {
                    smix(B, i * 128 * r, r, N, V, XY);
                }
            }

            function smix(B, Bi, r, N, V, XY) {
                var Xi = 0;
                var Yi = 128 * r;
                var i;

                arraycopy32(B, Bi, XY, Xi, Yi);

                for (i = 0; i < N; i++) {
                    arraycopy32(XY, Xi, V, i * Yi, Yi);
                    blockmix_salsa8(XY, Xi, Yi, r);
                }

                for (i = 0; i < N; i++) {
                    var j = integerify(XY, Xi, r) & (N - 1);
                    blockxor(V, j * Yi, XY, Xi, Yi);
                    blockmix_salsa8(XY, Xi, Yi, r);
                }

                arraycopy32(XY, Xi, B, Bi, Yi);
            }

            function blockmix_salsa8(BY, Bi, Yi, r) {
                var X = [];
                var i;

                arraycopy32(BY, Bi + (2 * r - 1) * 64, X, 0, 64);

                for (i = 0; i < 2 * r; i++) {
                    blockxor(BY, i * 64, X, 0, 64);
                    salsa20_8(X);
                    arraycopy32(X, 0, BY, Yi + (i * 64), 64);
                }

                for (i = 0; i < r; i++) {
                    arraycopy32(BY, Yi + (i * 2) * 64, BY, Bi + (i * 64), 64);
                }

                for (i = 0; i < r; i++) {
                    arraycopy32(BY, Yi + (i * 2 + 1) * 64, BY, Bi + (i + r) * 64, 64);
                }
            }

            function R(a, b) {
                return (a << b) | (a >>> (32 - b));
            }

            function salsa20_8(B) {
                var B32 = new Array(32);
                var x   = new Array(32);
                var i;

                for (i = 0; i < 16; i++) {
                    B32[i]  = (B[i * 4 + 0] & 0xff) << 0;
                    B32[i] |= (B[i * 4 + 1] & 0xff) << 8;
                    B32[i] |= (B[i * 4 + 2] & 0xff) << 16;
                    B32[i] |= (B[i * 4 + 3] & 0xff) << 24;
                }

                arraycopy(B32, 0, x, 0, 16);

                for (i = 8; i > 0; i -= 2) {
                    x[ 4] ^= R(x[ 0]+x[12], 7);  x[ 8] ^= R(x[ 4]+x[ 0], 9);
                    x[12] ^= R(x[ 8]+x[ 4],13);  x[ 0] ^= R(x[12]+x[ 8],18);
                    x[ 9] ^= R(x[ 5]+x[ 1], 7);  x[13] ^= R(x[ 9]+x[ 5], 9);
                    x[ 1] ^= R(x[13]+x[ 9],13);  x[ 5] ^= R(x[ 1]+x[13],18);
                    x[14] ^= R(x[10]+x[ 6], 7);  x[ 2] ^= R(x[14]+x[10], 9);
                    x[ 6] ^= R(x[ 2]+x[14],13);  x[10] ^= R(x[ 6]+x[ 2],18);
                    x[ 3] ^= R(x[15]+x[11], 7);  x[ 7] ^= R(x[ 3]+x[15], 9);
                    x[11] ^= R(x[ 7]+x[ 3],13);  x[15] ^= R(x[11]+x[ 7],18);
                    x[ 1] ^= R(x[ 0]+x[ 3], 7);  x[ 2] ^= R(x[ 1]+x[ 0], 9);
                    x[ 3] ^= R(x[ 2]+x[ 1],13);  x[ 0] ^= R(x[ 3]+x[ 2],18);
                    x[ 6] ^= R(x[ 5]+x[ 4], 7);  x[ 7] ^= R(x[ 6]+x[ 5], 9);
                    x[ 4] ^= R(x[ 7]+x[ 6],13);  x[ 5] ^= R(x[ 4]+x[ 7],18);
                    x[11] ^= R(x[10]+x[ 9], 7);  x[ 8] ^= R(x[11]+x[10], 9);
                    x[ 9] ^= R(x[ 8]+x[11],13);  x[10] ^= R(x[ 9]+x[ 8],18);
                    x[12] ^= R(x[15]+x[14], 7);  x[13] ^= R(x[12]+x[15], 9);
                    x[14] ^= R(x[13]+x[12],13);  x[15] ^= R(x[14]+x[13],18);
                }

                for (i = 0; i < 16; ++i) B32[i] = x[i] + B32[i];

                for (i = 0; i < 16; i++) {
                    var bi = i * 4;
                    B[bi + 0] = (B32[i] >> 0  & 0xff);
                    B[bi + 1] = (B32[i] >> 8  & 0xff);
                    B[bi + 2] = (B32[i] >> 16 & 0xff);
                    B[bi + 3] = (B32[i] >> 24 & 0xff);
                }
            }

            function blockxor(S, Si, D, Di, len) {
                var i = len>>6;
                while (i--) {
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];

                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];

                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];

                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];

                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];

                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];

                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];

                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                    D[Di++] ^= S[Si++]; D[Di++] ^= S[Si++];
                }
            }

            function integerify(B, bi, r) {
                var n;

                bi += (2 * r - 1) * 64;

                n  = (B[bi + 0] & 0xff) << 0;
                n |= (B[bi + 1] & 0xff) << 8;
                n |= (B[bi + 2] & 0xff) << 16;
                n |= (B[bi + 3] & 0xff) << 24;

                return n;
            }

            function arraycopy(src, srcPos, dest, destPos, length) {
                while (length-- ){
                    dest[destPos++] = src[srcPos++];
                }
            }

            function arraycopy32(src, srcPos, dest, destPos, length) {
                var i = length>>5;
                while(i--) {
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];

                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];

                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];

                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++]; dest[destPos++] = src[srcPos++];
                }
            }
        } // scryptCore
    };
}

var ImportExport = new _ImportExport();
