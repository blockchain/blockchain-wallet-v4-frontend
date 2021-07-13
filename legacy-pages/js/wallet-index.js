function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

//JQuery Count To
//https://github.com/mhuggins/jquery-countTo
(function($) {
    $.fn.countTo = function(options) {
        // merge the default plugin settings with the custom options
        options = $.extend({}, $.fn.countTo.defaults, options || {});

        // how many times to update the value, and how much to increment the value on each update
        var loops = Math.ceil(options.speed / options.refreshInterval),
            increment = (options.to - options.from) / loops;

        var self = this,
            loopCount = 0,
            value = options.from;

        if (self.interval) {
            clearInterval(self.interval);
            self.interval = null;
        }

        self.target_value = options.to;

        self.interval = setInterval(updateTimer, options.refreshInterval);

        function updateTimer() {
            value += increment;
            loopCount++;

            if (isNaN(value)) {
                return;
            }

            self.original_value = value;

            $(self).html(formatSymbol(value, symbol_local));

            if (typeof(options.onUpdate) == 'function') {
                options.onUpdate.call(self, value);
            }

            if (loopCount >= loops) {
                clearInterval(self.interval);
                self.interval = null;

                value = options.to;

                if (typeof(options.onComplete) == 'function') {
                    options.onComplete.call(self, value);
                }
            }
        }
    };

    $.fn.countTo.defaults = {
        from: 0,  // the number the element should start at
        to: 100,  // the number the element should end at
        speed: 1000,  // how long it should take to count between the target numbers
        refreshInterval: 200,  // how often the element should be updated
        decimals: 0,  // the number of decimal places to show
        onUpdate: null,  // callback method for every time the element is updated,
        onComplete: null  // callback method for when the element finishes updating
    };
}(jQuery));

$(document).ready(function() {

    //Iframe breakout
    if (top.location!= self.location) {
        top.location = self.location.href
    }

    try {
        $('.slidedeck').slidedeck();
    } catch(err) {}

    try {
        //Popovers!
        $("a[rel=popover]")
            .popover({
                offset: 10
            })
            .click(function(e) {
                e.preventDefault()
            });
    } catch(err) {}

    setInterval(function() {
        if ($('#fade1').is(':visible')) {
            $('#fade1').hide();
            $('#fade2').fadeIn();
        } else {
            $('#fade1').fadeIn();
            $('#fade2').hide();
        }
    }, 5000);

    var transacted = $('.transacted:first-child');
    if (transacted.length > 0) {
        webSocketConnect(function(ws) {
            ws.onmessage = function(e) {
                var obj = $.parseJSON(e.data);

                symbol = symbol_local;

                if (obj.op == 'utx') {
                    var tx = TransactionFromJSON(obj.x);

                    var total_received = 0;
                    for (var i = 0; i < tx.out.length; i++) {
                        total_received += parseInt(tx.out[i].value);
                    }

                    var original_value = parseInt(transacted.original_value);

                    if (!original_value || isNaN(original_value))
                        original_value = transacted.find('span').data('c');

                    var target_val = parseInt(transacted.target_value);
                    if (!isNaN(target_val) && target_val > original_value)
                        total_received += target_val - original_value;

                    var new_value = original_value + total_received;

                    transacted.countTo({
                        from: original_value,
                        to: new_value,
                        speed: 10000,
                        refreshInterval: 50
                    });
                }
            };

            ws.onopen = function() {
                ws.send('{"op":"ip_sub", "ip":"127.0.0.1"}');
            };
        });
    }

    $('#youtube-preview').click(function() {
        $(this).empty().append('<iframe width="100%" height="256" src="https://www.youtube.com/embed/Um63OQz3bjo?autohide=1&controls=0&showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    });

    setTimeout(function() {
        $('#download-instructions-btn').click(function () {
            $('#download-instructions').toggle(400);
        });

        if ($('#slideshow').length > 0) {
            var i = 0;
            var changeImage = function() {
                ++i;

                if (i == 3)
                    i = 0;

                $('#slideshow img').hide();

                $('#slideshow img').eq(i).fadeIn();
            };

            setInterval(changeImage, 7000);
        }
    }, 500);
});