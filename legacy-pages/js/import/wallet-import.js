(function() {
    //Save the javascript wallet to the remote server
    function reallyInsertWallet(guid, sharedKey, password, extra, successcallback, errorcallback) {
        var _errorcallback = function(e) {
            MyWallet.makeNotice('error', 'misc-error', 'Error Saving Wallet: ' + e, 10000);

            if (errorcallback != null)
                errorcallback(e);
            else throw e;
        };

        try {
            var data = MyWallet.makeCustomWalletJSON(null, guid, sharedKey);

            //Everything looks ok, Encrypt the JSON output
            var crypted = MyWallet.encryptWallet(data, password);

            if (crypted.length == 0) {
                throw 'Error encrypting the JSON output';
            }

            //Now Decrypt the it again to double check for any possible corruption
            MyWallet.decryptWallet(crypted, password, function(obj) {
                try {
                    //SHA256 new_checksum verified by server in case of curruption during transit
                    var new_checksum = Crypto.util.bytesToHex(Crypto.SHA256(crypted, {asBytes: true}));

                    MyWallet.setLoadingText('Saving wallet');

                    if (extra == null)
                        extra = '';

                    MyWallet.securePost('wallet' + extra, { length: crypted.length, payload: crypted, checksum: new_checksum, method : 'insert', format : 'plain', sharedKey : sharedKey, guid : guid }, function(data) {
                        MyWallet.makeNotice('success', 'misc-success', data);

                        if (successcallback != null)
                            successcallback();
                    }, function(e) {
                        _errorcallback(e.responseText);
                    });

                } catch (e) {
                    _errorcallback(e);
                };
            }, _errorcallback);
        } catch (e) {
            _errorcallback(e);
        }
    }

    function uploadWallet(url, file, success, error, password, kaptcha) {

        $('.loading-indicator').fadeIn(200);

        var formData = new FormData();

        formData.append('file', file);
        formData.append('password', password);
        formData.append('kaptcha', kaptcha);

        var xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                $('.loading-indicator').fadeOut(200);

                if (xhr.status == 200 ) {
                    success(xhr.responseText);
                } else {
                    error(xhr.responseText, xhr.status);
                }
            }
        }

        xhr.onerror = function () {
            $('.loading-indicator').fadeOut(200);

            error(xhr.responseText, xhr.status);
        };

        xhr.send(formData);  // multipart/form-data
    }

    function showKaptchaModal(success) {
        var modal = $('#kaptcha-modal');

        $('#captcha-value').val('');

        $("#captcha").attr("src", root + "kaptcha.jpg?timestamp=" + new Date().getTime());

        modal.modal({
            keyboard: true,
            backdrop: "static",
            show: true
        });

        //Center
        modal.center();

        modal.find('.btn.btn-primary').unbind().click(function() {
            modal.modal('hide');

            var code = $.trim($('#captcha-value').val());

            if (code.length == 0) {
                MyWallet.makeNotice('error', 'misc-error', 'You must enter a captcha code');
                return;
            }

            success(code);
        });

        modal.find('.btn.btn-secondary').unbind().click(function() {
            modal.modal('hide');
        });
    }

    function getNewPassword(success) {

        var modal = $('#new-password-modal');

        modal.modal({
            keyboard: true,
            backdrop: "static",
            show: true
        });

        //Center
        modal.center();

        modal.find('.btn.btn-primary').unbind().click(function() {
            modal.modal('hide');

            var tpassword = $.trim(modal.find('input[name="password"]').val());
            var tpassword2 = $.trim(modal.find('input[name="password2"]').val());

            if (tpassword == null || tpassword.length == 0 || tpassword.length < 10 || tpassword.length > 255) {
                MyWallet.makeNotice('error', 'misc-error', 'Password must be 10 characters or more in length');
                return;
            }

            if (tpassword != tpassword2) {
                MyWallet.makeNotice('error', 'misc-error', 'Passwords do not match.');
                return;
            }

            success(tpassword);
        });

        modal.find('.btn.btn-secondary').unbind().click(function() {
            modal.modal('hide');
        });
    }


    function generateUUIDs(n, success, error) {
        $.ajax({
            type: "GET",
            url: 'https://blockchain.info/uuid-generator',
            data: {
                api_code: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8',
                ct: new Date().getTime(),
                format : 'json',
                n : n
            },
            success: function(data) {

                if (data.uuids && data.uuids.length == n)
                    success(data.uuids);
                else
                    error('Unknown Error');
            },
            error : function(data) {
                error(data.responseText);
            }
        });
    }

    function insertWallet() {
        getNewPassword(function(password) {
            showKaptchaModal(function(kaptcha) {
                generateUUIDs(2, function(uuids) {
                    try {
                        var guid = uuids[0];
                        var sharedKey = uuids[1];

                        if (guid.length != 36) {
                            throw 'Error generating wallet identifier';
                        }

                        reallyInsertWallet(guid, sharedKey, password, '?kaptcha='+ $.trim($('#captcha-value').val()), function(){
                            MyStore.clear();

                            MyStore.put('guid', guid);

                            window.confirm(`Your wallet has been recovered successfully! \n\nIMPORTANT: Copy your new Wallet ID below and use it, along with your new password, to login on the next page. \n\n${guid}`)

                            window.location = root + 'wallet/login/' + guid;
                        }, function() {
                            $("#captcha").attr("src", root + "kaptcha.jpg?timestamp=" + new Date().getTime());
                        });
                    } catch (e) {
                        MyWallet.makeNotice('error', 'misc-error', e);
                    }
                }, function(error) {
                    console.error(error)
                });
            });
        });
    }

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.
        var r = new FileReader();

        // files is a FileList of File objects. List some properties.
        for (var i = 0, f; f = files[i]; i++) {

            if (f.size > 10485760) {
                MyWallet.makeNotice('error', 'misc-error', 'The maximum file size is 10MB');
                return;
            }

            if (f.name) {
                if (f.name.indexOf('.aes.json') == f.name.length - 9) {
                    r.onload = function(e) {

                        MyWallet.getPassword($('#import-password-modal'), function(password) {
                            $('.loading-indicator').fadeIn(200);

                            ImportExport.importJSON(e.target.result, {main_password : password}, function() {
                                $('.loading-indicator').fadeOut(200);

                                insertWallet();
                            }, function(e) {
                                $('.loading-indicator').fadeOut(200);

                                MyWallet.makeNotice('error', 'misc-error', e);
                            });
                        });
                    };

                    r.readAsText(f);

                    return;
                } else if (f.name.indexOf('.dat') == f.name.length - 4) {
                    showKaptchaModal(function(kaptcha) {
                        MyWallet.getPassword($('#import-password-modal'), function(password) {
                            uploadWallet(root + 'upload_wallet', f, function(response) {
                                $('.loading-indicator').fadeIn(200);

                                ImportExport.importJSON(response, {}, function() {
                                    $('.loading-indicator').fadeOut(200);

                                    insertWallet();
                                }, function(e) {
                                    $('.loading-indicator').fadeOut(200);

                                    MyWallet.makeNotice('error', 'misc-error', e);
                                });
                            }, function(response) {
                                MyWallet.makeNotice('error', 'misc-error', response);
                            }, password, kaptcha);
                        });
                    });
                } else {
                    MyWallet.makeNotice('error', 'misc-error', 'Unknown File Type ' + f.name);
                }

                return;
            }
        }
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    $(document).ready(function() {
        $('body').ajaxStart(function() {
            $('.loading-indicator').fadeIn(200);
        });

        $('body').ajaxStop(function() {
            $('.loading-indicator').fadeOut(200);
        });

        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.

            // Setup the dnd listeners.
            var dropZone = document.getElementById('holder');
            dropZone.addEventListener('dragover', handleDragOver, false);
            dropZone.addEventListener('drop', handleFileSelect, false);

        } else {
            MyWallet.makeNotice('error', 'misc-error', 'The File APIs are not fully supported in this browser.');
        }
    });
})();
