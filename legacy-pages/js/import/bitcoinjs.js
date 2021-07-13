/*
 * Crypto-JS v2.0.0
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */

var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

if (typeof window == "undefined" || !window)
    var _window = {};
else
    var _window = window;

// Global Crypto object
var Crypto = _window.Crypto = {};

// Crypto utilities
var util = Crypto.util = {

	// Bit-wise rotate left
	rotl: function (n, b) {
		return (n << b) | (n >>> (32 - b));
	},

	// Bit-wise rotate right
	rotr: function (n, b) {
		return (n << (32 - b)) | (n >>> b);
	},

	// Swap big-endian to little-endian and vice versa
	endian: function (n) {

		// If number given, swap endian
		if (n.constructor == Number) {
			return util.rotl(n,  8) & 0x00FF00FF |
			       util.rotl(n, 24) & 0xFF00FF00;
		}

		// Else, assume array and swap all items
		for (var i = 0; i < n.length; i++)
			n[i] = util.endian(n[i]);
		return n;

	},

	// Generate an array of any length of random bytes
	randomBytes: function (n) {
		for (var bytes = []; n > 0; n--)
			bytes.push(Math.floor(Math.random() * 256));
		return bytes;
	},

	// Convert a byte array to big-endian 32-bit words
	bytesToWords: function (bytes) {
		for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
			words[b >>> 5] |= bytes[i] << (24 - b % 32);
		return words;
	},

	// Convert big-endian 32-bit words to a byte array
	wordsToBytes: function (words) {
		for (var bytes = [], b = 0; b < words.length * 32; b += 8)
			bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
		return bytes;
	},

	// Convert a byte array to a hex string
	bytesToHex: function (bytes) {
		for (var hex = [], i = 0; i < bytes.length; i++) {
			hex.push((bytes[i] >>> 4).toString(16));
			hex.push((bytes[i] & 0xF).toString(16));
		}
		return hex.join("");
	},

	// Convert a hex string to a byte array
	hexToBytes: function (hex) {
		for (var bytes = [], c = 0; c < hex.length; c += 2)
			bytes.push(parseInt(hex.substr(c, 2), 16));
		return bytes;
	},

	// Convert a byte array to a base-64 string
	bytesToBase64: function (bytes) {

		// Use browser-native function if it exists
		if (typeof btoa == "function") return btoa(Binary.bytesToString(bytes));

		for(var base64 = [], i = 0; i < bytes.length; i += 3) {
			var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
			for (var j = 0; j < 4; j++) {
				if (i * 8 + j * 6 <= bytes.length * 8)
					base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
				else base64.push("=");
			}
		}

		return base64.join("");

	},

	// Convert a base-64 string to a byte array
	base64ToBytes: function (base64) {

		// Use browser-native function if it exists
		if (typeof atob == "function") return Binary.stringToBytes(atob(base64));

		// Remove non-base-64 characters
		base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

		for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
			if (imod4 == 0) continue;
			bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
			           (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
		}

		return bytes;

	}

};

// Crypto mode namespace
Crypto.mode = {};

// Crypto character encodings
var charenc = Crypto.charenc = {};

// UTF-8 encoding
var UTF8 = charenc.UTF8 = {

	// Convert a string to a byte array
	stringToBytes: function (str) {
		return Binary.stringToBytes(unescape(encodeURIComponent(str)));
	},

	// Convert a byte array to a string
	bytesToString: function (bytes) {
		return decodeURIComponent(escape(Binary.bytesToString(bytes)));
	}

};

// Binary encoding
var Binary = charenc.Binary = {

	// Convert a string to a byte array
	stringToBytes: function (str) {
		for (var bytes = [], i = 0; i < str.length; i++)
			bytes.push(str.charCodeAt(i));
		return bytes;
	},

	// Convert a byte array to a string
	bytesToString: function (bytes) {
		for (var str = [], i = 0; i < bytes.length; i++)
			str.push(String.fromCharCode(bytes[i]));
		return str.join("");
	}

};

/*
 * Crypto-JS v2.0.0
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */

// Shortcuts
var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8,
    Binary = charenc.Binary;

// Constants
var K = [ 0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
          0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
          0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
          0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
          0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
          0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
          0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
          0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
          0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
          0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
          0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
          0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
          0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
          0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
          0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
          0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2 ];

// Public API
var SHA256 = C.SHA256 = function (message, options) {
	var digestbytes = util.wordsToBytes(SHA256._sha256(message));
	return options && options.asBytes ? digestbytes :
	       options && options.asString ? Binary.bytesToString(digestbytes) :
	       util.bytesToHex(digestbytes);
};

// The core
SHA256._sha256 = function (message) {

	// Convert to byte array
	if (message.constructor == String) message = UTF8.stringToBytes(message);
	/* else, assume byte array already */

	var m = util.bytesToWords(message),
	    l = message.length * 8,
	    H = [ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
	          0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ],
	    w = [],
	    a, b, c, d, e, f, g, h, i, j,
	    t1, t2;

	// Padding
	m[l >> 5] |= 0x80 << (24 - l % 32);
	m[((l + 64 >> 9) << 4) + 15] = l;

	for (var i = 0; i < m.length; i += 16) {

		a = H[0];
		b = H[1];
		c = H[2];
		d = H[3];
		e = H[4];
		f = H[5];
		g = H[6];
		h = H[7];

		for (var j = 0; j < 64; j++) {

			if (j < 16) w[j] = m[j + i];
			else {

				var gamma0x = w[j - 15],
				    gamma1x = w[j - 2],
				    gamma0  = ((gamma0x << 25) | (gamma0x >>>  7)) ^
				              ((gamma0x << 14) | (gamma0x >>> 18)) ^
				               (gamma0x >>> 3),
				    gamma1  = ((gamma1x <<  15) | (gamma1x >>> 17)) ^
				              ((gamma1x <<  13) | (gamma1x >>> 19)) ^
				               (gamma1x >>> 10);

				w[j] = gamma0 + (w[j - 7] >>> 0) +
				       gamma1 + (w[j - 16] >>> 0);

			}

			var ch  = e & f ^ ~e & g,
			    maj = a & b ^ a & c ^ b & c,
			    sigma0 = ((a << 30) | (a >>>  2)) ^
			             ((a << 19) | (a >>> 13)) ^
			             ((a << 10) | (a >>> 22)),
			    sigma1 = ((e << 26) | (e >>>  6)) ^
			             ((e << 21) | (e >>> 11)) ^
			             ((e <<  7) | (e >>> 25));


			t1 = (h >>> 0) + sigma1 + ch + (K[j]) + (w[j] >>> 0);
			t2 = sigma0 + maj;

			h = g;
			g = f;
			f = e;
			e = d + t1;
			d = c;
			c = b;
			b = a;
			a = t1 + t2;

		}

		H[0] += a;
		H[1] += b;
		H[2] += c;
		H[3] += d;
		H[4] += e;
		H[5] += f;
		H[6] += g;
		H[7] += h;

	}

	return H;

};

// Package private blocksize
SHA256._blocksize = 16;

/*
 * Crypto-JS v2.5.4
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function(){

// Shortcuts
var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8,
    Binary = charenc.Binary;

// Public API
var SHA1 = C.SHA1 = function (message, options) {
	var digestbytes = util.wordsToBytes(SHA1._sha1(message));
	return options && options.asBytes ? digestbytes :
	       options && options.asString ? Binary.bytesToString(digestbytes) :
	       util.bytesToHex(digestbytes);
};

// The core
SHA1._sha1 = function (message) {

	// Convert to byte array
	if (message.constructor == String) message = UTF8.stringToBytes(message);
	/* else, assume byte array already */

	var m  = util.bytesToWords(message),
	    l  = message.length * 8,
	    w  =  [],
	    H0 =  1732584193,
	    H1 = -271733879,
	    H2 = -1732584194,
	    H3 =  271733878,
	    H4 = -1009589776;

	// Padding
	m[l >> 5] |= 0x80 << (24 - l % 32);
	m[((l + 64 >>> 9) << 4) + 15] = l;

	for (var i = 0; i < m.length; i += 16) {

		var a = H0,
		    b = H1,
		    c = H2,
		    d = H3,
		    e = H4;

		for (var j = 0; j < 80; j++) {

			if (j < 16) w[j] = m[i + j];
			else {
				var n = w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16];
				w[j] = (n << 1) | (n >>> 31);
			}

			var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
			         j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
			         j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
			         j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
			                  (H1 ^ H2 ^ H3) - 899497514);

			H4 =  H3;
			H3 =  H2;
			H2 = (H1 << 30) | (H1 >>> 2);
			H1 =  H0;
			H0 =  t;

		}

		H0 += a;
		H1 += b;
		H2 += c;
		H3 += d;
		H4 += e;

	}

	return [H0, H1, H2, H3, H4];

};

// Package private blocksize
SHA1._blocksize = 16;

SHA1._digestsize = 20;

})();
/*
 * Crypto-JS v2.0.0
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 *
 * A JavaScript implementation of the RIPEMD-160 Algorithm
 * Version 2.2 Copyright Jeremy Lin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://www.ocf.berkeley.edu/~jjlin/jsotp/
 * Ported to Crypto-JS by Stefan Thomas.
 */

	// Shortcuts
	var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8,
    Binary = charenc.Binary;

	// Convert a byte array to little-endian 32-bit words
	util.bytesToLWords = function (bytes) {

		var output = Array(bytes.length >> 2);
		for (var i = 0; i < output.length; i++)
			output[i] = 0;
		for (var i = 0; i < bytes.length * 8; i += 8)
			output[i>>5] |= (bytes[i / 8] & 0xFF) << (i%32);
		return output;
	};

	// Convert little-endian 32-bit words to a byte array
	util.lWordsToBytes = function (words) {
		var output = [];
		for (var i = 0; i < words.length * 32; i += 8)
			output.push((words[i>>5] >>> (i % 32)) & 0xff);
		return output;
	};

	// Public API
	var RIPEMD160 = C.RIPEMD160 = function (message, options) {
		var digestbytes = util.lWordsToBytes(RIPEMD160._rmd160(message));
		return options && options.asBytes ? digestbytes :
			options && options.asString ? Binary.bytesToString(digestbytes) :
			util.bytesToHex(digestbytes);
	};

	// The core
	RIPEMD160._rmd160 = function (message)
	{
		// Convert to byte array
		if (message.constructor == String) message = UTF8.stringToBytes(message);

		var x = util.bytesToLWords(message),
		    len = message.length * 8;

		/* append padding */
		x[len >> 5] |= 0x80 << (len % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var h0 = 0x67452301;
		var h1 = 0xefcdab89;
		var h2 = 0x98badcfe;
		var h3 = 0x10325476;
		var h4 = 0xc3d2e1f0;

		for (var i = 0; i < x.length; i += 16) {
			var T;
			var A1 = h0, B1 = h1, C1 = h2, D1 = h3, E1 = h4;
			var A2 = h0, B2 = h1, C2 = h2, D2 = h3, E2 = h4;
			for (var j = 0; j <= 79; ++j) {
				T = safe_add(A1, rmd160_f(j, B1, C1, D1));
				T = safe_add(T, x[i + rmd160_r1[j]]);
				T = safe_add(T, rmd160_K1(j));
				T = safe_add(bit_rol(T, rmd160_s1[j]), E1);
				A1 = E1; E1 = D1; D1 = bit_rol(C1, 10); C1 = B1; B1 = T;
				T = safe_add(A2, rmd160_f(79-j, B2, C2, D2));
				T = safe_add(T, x[i + rmd160_r2[j]]);
				T = safe_add(T, rmd160_K2(j));
				T = safe_add(bit_rol(T, rmd160_s2[j]), E2);
				A2 = E2; E2 = D2; D2 = bit_rol(C2, 10); C2 = B2; B2 = T;
			}
			T = safe_add(h1, safe_add(C1, D2));
			h1 = safe_add(h2, safe_add(D1, E2));
			h2 = safe_add(h3, safe_add(E1, A2));
			h3 = safe_add(h4, safe_add(A1, B2));
			h4 = safe_add(h0, safe_add(B1, C2));
			h0 = T;
		}
		return [h0, h1, h2, h3, h4];
	}

	function rmd160_f(j, x, y, z)
	{
		return ( 0 <= j && j <= 15) ? (x ^ y ^ z) :
			(16 <= j && j <= 31) ? (x & y) | (~x & z) :
			(32 <= j && j <= 47) ? (x | ~y) ^ z :
			(48 <= j && j <= 63) ? (x & z) | (y & ~z) :
			(64 <= j && j <= 79) ? x ^ (y | ~z) :
			"rmd160_f: j out of range";
	}
	function rmd160_K1(j)
	{
		return ( 0 <= j && j <= 15) ? 0x00000000 :
			(16 <= j && j <= 31) ? 0x5a827999 :
			(32 <= j && j <= 47) ? 0x6ed9eba1 :
			(48 <= j && j <= 63) ? 0x8f1bbcdc :
			(64 <= j && j <= 79) ? 0xa953fd4e :
			"rmd160_K1: j out of range";
	}
	function rmd160_K2(j)
	{
		return ( 0 <= j && j <= 15) ? 0x50a28be6 :
			(16 <= j && j <= 31) ? 0x5c4dd124 :
			(32 <= j && j <= 47) ? 0x6d703ef3 :
			(48 <= j && j <= 63) ? 0x7a6d76e9 :
			(64 <= j && j <= 79) ? 0x00000000 :
			"rmd160_K2: j out of range";
	}
	var rmd160_r1 = [
		0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
		7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
		3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
		1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
		4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13
	];
	var rmd160_r2 = [
		5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
		6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
		15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
		8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
		12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11
	];
	var rmd160_s1 = [
		11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
		7,  6,  8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
		11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
		11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
		9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6
	];
	var rmd160_s2 = [
		8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
		9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
		9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
		15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
		8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11
	];

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
		return (num << cnt) | (num >>> (32 - cnt));
	}
/*
 * Crypto-JS v2.5.4
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
/*!
 * Crypto-JS contribution from Simon Greatrix
 */

(function(C){

// Create pad namespace
var C_pad = C.pad = {};

// Calculate the number of padding bytes required.
function _requiredPadding(cipher, message) {
    var blockSizeInBytes = cipher._blocksize * 4;
    var reqd = blockSizeInBytes - message.length % blockSizeInBytes;
    return reqd;
}

// Remove padding when the final byte gives the number of padding bytes.
var _unpadLength = function(cipher, message, alg, padding) {
	var pad = message.pop();
	if (pad == 0) {
		throw new Error("Invalid zero-length padding specified for " + alg
				+ ". Wrong cipher specification or key used?");
	}
	var maxPad = cipher._blocksize * 4;
	if (pad > maxPad) {
		throw new Error("Invalid padding length of " + pad
				+ " specified for " + alg
				+ ". Wrong cipher specification or key used?");
	}
	for ( var i = 1; i < pad; i++) {
		var b = message.pop();
		if (padding != undefined && padding != b) {
			throw new Error("Invalid padding byte of 0x" + b.toString(16)
					+ " specified for " + alg
					+ ". Wrong cipher specification or key used?");
		}
	}
};

// No-operation padding, used for stream ciphers
C_pad.NoPadding = {
        pad : function (cipher,message) {},
        unpad : function (cipher,message) {}
    };

// Zero Padding.
//
// If the message is not an exact number of blocks, the final block is
// completed with 0x00 bytes. There is no unpadding.
C_pad.ZeroPadding = {
    pad : function (cipher, message) {
        var blockSizeInBytes = cipher._blocksize * 4;
        var reqd = message.length % blockSizeInBytes;
        if( reqd!=0 ) {
            for(reqd = blockSizeInBytes - reqd; reqd>0; reqd--) {
                message.push(0x00);
            }
        }
    },

    unpad : function (cipher, message) {
        while (message[message.length - 1] == 0) {
            message.pop();
        }
    }
};

// ISO/IEC 7816-4 padding.
//
// Pads the plain text with an 0x80 byte followed by as many 0x00
// bytes are required to complete the block.
C_pad.iso7816 = {
    pad : function (cipher, message) {
        var reqd = _requiredPadding(cipher, message);
        message.push(0x80);
        for (; reqd > 1; reqd--) {
            message.push(0x00);
        }
    },

    unpad : function (cipher, message) {
    	var padLength;
    	for(padLength = cipher._blocksize * 4; padLength>0; padLength--) {
    		var b = message.pop();
    		if( b==0x80 ) return;
    		if( b!=0x00 ) {
    			throw new Error("ISO-7816 padding byte must be 0, not 0x"+b.toString(16)+". Wrong cipher specification or key used?");
    		}
    	}
    	throw new Error("ISO-7816 padded beyond cipher block size. Wrong cipher specification or key used?");
    }
};

// ANSI X.923 padding
//
// The final block is padded with zeros except for the last byte of the
// last block which contains the number of padding bytes.
C_pad.ansix923 = {
    pad : function (cipher, message) {
        var reqd = _requiredPadding(cipher, message);
        for (var i = 1; i < reqd; i++) {
            message.push(0x00);
        }
        message.push(reqd);
    },

    unpad : function (cipher,message) {
    	_unpadLength(cipher,message,"ANSI X.923",0);
    }
};

// ISO 10126
//
// The final block is padded with random bytes except for the last
// byte of the last block which contains the number of padding bytes.
C_pad.iso10126 = {
    pad : function (cipher, message) {
        var reqd = _requiredPadding(cipher, message);
        for (var i = 1; i < reqd; i++) {
            message.push(Math.floor(Math.random() * 256));
        }
        message.push(reqd);
    },

    unpad : function (cipher,message) {
    	_unpadLength(cipher,message,"ISO 10126",undefined);
    }
};

// PKCS7 padding
//
// PKCS7 is described in RFC 5652. Padding is in whole bytes. The
// value of each added byte is the number of bytes that are added,
// i.e. N bytes, each of value N are added.
C_pad.pkcs7 = {
    pad : function (cipher, message) {
        var reqd = _requiredPadding(cipher, message);
        for (var i = 0; i < reqd; i++) {
            message.push(reqd);
        }
    },

    unpad : function (cipher,message) {
    	_unpadLength(cipher,message,"PKCS 7",message[message.length-1]);
    }
};

// Create mode namespace
var C_mode = C.mode = {};

/**
 * Mode base "class".
 */
var Mode = C_mode.Mode = function (padding) {
    if (padding) {
        this._padding = padding;
    }
};

Mode.prototype = {
    encrypt: function (cipher, m, iv) {
        this._padding.pad(cipher, m);
        this._doEncrypt(cipher, m, iv);
    },

    decrypt: function (cipher, m, iv) {
        this._doDecrypt(cipher, m, iv);
        this._padding.unpad(cipher, m);
    },

    // Default padding
    _padding: C_pad.iso7816
};


/**
 * Electronic Code Book mode.
 * 
 * ECB applies the cipher directly against each block of the input.
 * 
 * ECB does not require an initialization vector.
 */
var ECB = C_mode.ECB = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
};

// Inherit from Mode
var ECB_prototype = ECB.prototype = new Mode;

// Concrete steps for Mode template
ECB_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;
    // Encrypt each block
    for (var offset = 0; offset < m.length; offset += blockSizeInBytes) {
        cipher._encryptblock(m, offset);
    }
};
ECB_prototype._doDecrypt = function (cipher, c, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;
    // Decrypt each block
    for (var offset = 0; offset < c.length; offset += blockSizeInBytes) {
        cipher._decryptblock(c, offset);
    }
};

// ECB never uses an IV
ECB_prototype.fixOptions = function (options) {
    options.iv = [];
};


/**
 * Cipher block chaining
 * 
 * The first block is XORed with the IV. Subsequent blocks are XOR with the
 * previous cipher output.
 */
var CBC = C_mode.CBC = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
};

// Inherit from Mode
var CBC_prototype = CBC.prototype = new Mode;

// Concrete steps for Mode template
CBC_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;

    // Encrypt each block
    for (var offset = 0; offset < m.length; offset += blockSizeInBytes) {
        if (offset == 0) {
            // XOR first block using IV
            for (var i = 0; i < blockSizeInBytes; i++)
            m[i] ^= iv[i];
        } else {
            // XOR this block using previous crypted block
            for (var i = 0; i < blockSizeInBytes; i++)
            m[offset + i] ^= m[offset + i - blockSizeInBytes];
        }
        // Encrypt block
        cipher._encryptblock(m, offset);
    }
};
CBC_prototype._doDecrypt = function (cipher, c, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;

    // At the start, the previously crypted block is the IV
    var prevCryptedBlock = iv;

    // Decrypt each block
    for (var offset = 0; offset < c.length; offset += blockSizeInBytes) {
        // Save this crypted block
        var thisCryptedBlock = c.slice(offset, offset + blockSizeInBytes);
        // Decrypt block
        cipher._decryptblock(c, offset);
        // XOR decrypted block using previous crypted block
        for (var i = 0; i < blockSizeInBytes; i++) {
            c[offset + i] ^= prevCryptedBlock[i];
        }
        prevCryptedBlock = thisCryptedBlock;
    }
};


/**
 * Cipher feed back
 * 
 * The cipher output is XORed with the plain text to produce the cipher output,
 * which is then fed back into the cipher to produce a bit pattern to XOR the
 * next block with.
 * 
 * This is a stream cipher mode and does not require padding.
 */
var CFB = C_mode.CFB = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
};

// Inherit from Mode
var CFB_prototype = CFB.prototype = new Mode;

// Override padding
CFB_prototype._padding = C_pad.NoPadding;

// Concrete steps for Mode template
CFB_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4,
        keystream = iv.slice(0);

    // Encrypt each byte
    for (var i = 0; i < m.length; i++) {

        var j = i % blockSizeInBytes;
        if (j == 0) cipher._encryptblock(keystream, 0);

        m[i] ^= keystream[j];
        keystream[j] = m[i];
    }
};
CFB_prototype._doDecrypt = function (cipher, c, iv) {
    var blockSizeInBytes = cipher._blocksize * 4,
        keystream = iv.slice(0);

    // Encrypt each byte
    for (var i = 0; i < c.length; i++) {

        var j = i % blockSizeInBytes;
        if (j == 0) cipher._encryptblock(keystream, 0);

        var b = c[i];
        c[i] ^= keystream[j];
        keystream[j] = b;
    }
};


/**
 * Output feed back
 * 
 * The cipher repeatedly encrypts its own output. The output is XORed with the
 * plain text to produce the cipher text.
 * 
 * This is a stream cipher mode and does not require padding.
 */
var OFB = C_mode.OFB = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
};

// Inherit from Mode
var OFB_prototype = OFB.prototype = new Mode;

// Override padding
OFB_prototype._padding = C_pad.NoPadding;

// Concrete steps for Mode template
OFB_prototype._doEncrypt = function (cipher, m, iv) {

    var blockSizeInBytes = cipher._blocksize * 4,
        keystream = iv.slice(0);

    // Encrypt each byte
    for (var i = 0; i < m.length; i++) {

        // Generate keystream
        if (i % blockSizeInBytes == 0)
            cipher._encryptblock(keystream, 0);

        // Encrypt byte
        m[i] ^= keystream[i % blockSizeInBytes];

    }
};
OFB_prototype._doDecrypt = OFB_prototype._doEncrypt;

/**
 * Counter
 * @author Gergely Risko
 *
 * After every block the last 4 bytes of the IV is increased by one
 * with carry and that IV is used for the next block.
 *
 * This is a stream cipher mode and does not require padding.
 */
var CTR = C_mode.CTR = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
};

// Inherit from Mode
var CTR_prototype = CTR.prototype = new Mode;

// Override padding
CTR_prototype._padding = C_pad.NoPadding;

CTR_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;
    var counter = iv.slice(0);

    for (var i = 0; i < m.length;) {
        // do not lose iv
        var keystream = counter.slice(0);

        // Generate keystream for next block
        cipher._encryptblock(keystream, 0);

        // XOR keystream with block
        for (var j = 0; i < m.length && j < blockSizeInBytes; j++, i++) {
            m[i] ^= keystream[j];
        }

        // Increase counter
        if(++(counter[blockSizeInBytes-1]) == 256) {
            counter[blockSizeInBytes-1] = 0;
            if(++(counter[blockSizeInBytes-2]) == 256) {
                counter[blockSizeInBytes-2] = 0;
                if(++(counter[blockSizeInBytes-3]) == 256) {
                    counter[blockSizeInBytes-3] = 0;
                    ++(counter[blockSizeInBytes-4]);
                }
            }
        }
    }
};
CTR_prototype._doDecrypt = CTR_prototype._doEncrypt;

})(Crypto);
/*
 * Crypto-JS v2.5.4
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function(){

// Shortcuts
var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8,
    Binary = charenc.Binary;

C.HMAC = function (hasher, message, key, options) {

	// Convert to byte arrays
	if (message.constructor == String) message = UTF8.stringToBytes(message);
	if (key.constructor == String) key = UTF8.stringToBytes(key);
	/* else, assume byte arrays already */

	// Allow arbitrary length keys
	if (key.length > hasher._blocksize * 4)
		key = hasher(key, { asBytes: true });

	// XOR keys with pad constants
	var okey = key.slice(0),
	    ikey = key.slice(0);
	for (var i = 0; i < hasher._blocksize * 4; i++) {
		okey[i] ^= 0x5C;
		ikey[i] ^= 0x36;
	}

	var hmacbytes = hasher(okey.concat(hasher(ikey.concat(message), { asBytes: true })), { asBytes: true });

	return options && options.asBytes ? hmacbytes :
	       options && options.asString ? Binary.bytesToString(hmacbytes) :
	       util.bytesToHex(hmacbytes);

};

})();
/*
 * Crypto-JS v2.5.4
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function(){

// Shortcuts
var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8,
    Binary = charenc.Binary;

C.PBKDF2 = function (password, salt, keylen, options) {

	// Convert to byte arrays
	if (password.constructor == String) password = UTF8.stringToBytes(password);
	if (salt.constructor == String) salt = UTF8.stringToBytes(salt);
	/* else, assume byte arrays already */

	// Defaults
	var hasher = options && options.hasher || C.SHA1,
	    iterations = options && options.iterations || 1;

	// Pseudo-random function
	function PRF(password, salt) {
		return C.HMAC(hasher, salt, password, { asBytes: true });
	}

	// Generate key
	var derivedKeyBytes = [],
	    blockindex = 1;
	while (derivedKeyBytes.length < keylen) {
		var block = PRF(password, salt.concat(util.wordsToBytes([blockindex])));
		for (var u = block, i = 1; i < iterations; i++) {
			u = PRF(password, u);
			for (var j = 0; j < block.length; j++) block[j] ^= u[j];
		}
		derivedKeyBytes = derivedKeyBytes.concat(block);
		blockindex++;
	}

	// Truncate excess bytes
	derivedKeyBytes.length = keylen;

	return options && options.asBytes ? derivedKeyBytes :
	       options && options.asString ? Binary.bytesToString(derivedKeyBytes) :
	       util.bytesToHex(derivedKeyBytes);

};

})();
/*
 * Crypto-JS v2.5.4
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function(){

// Shortcuts
var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8;

// Precomputed SBOX
var SBOX = [ 0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
             0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
             0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
             0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
             0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc,
             0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
             0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a,
             0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
             0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
             0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
             0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b,
             0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
             0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
             0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
             0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
             0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
             0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17,
             0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
             0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88,
             0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
             0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
             0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
             0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9,
             0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
             0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6,
             0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
             0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
             0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
             0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94,
             0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
             0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68,
             0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16 ];

// Compute inverse SBOX lookup table
for (var INVSBOX = [], i = 0; i < 256; i++) INVSBOX[SBOX[i]] = i;

// Compute multiplication in GF(2^8) lookup tables
var MULT2 = [],
    MULT3 = [],
    MULT9 = [],
    MULTB = [],
    MULTD = [],
    MULTE = [];

function xtime(a, b) {
	for (var result = 0, i = 0; i < 8; i++) {
		if (b & 1) result ^= a;
		var hiBitSet = a & 0x80;
		a = (a << 1) & 0xFF;
		if (hiBitSet) a ^= 0x1b;
		b >>>= 1;
	}
	return result;
}

for (var i = 0; i < 256; i++) {
	MULT2[i] = xtime(i,2);
	MULT3[i] = xtime(i,3);
	MULT9[i] = xtime(i,9);
	MULTB[i] = xtime(i,0xB);
	MULTD[i] = xtime(i,0xD);
	MULTE[i] = xtime(i,0xE);
}

// Precomputed RCon lookup
var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

// Inner state
var state = [[], [], [], []],
    keylength,
    nrounds,
    keyschedule;

var AES = C.AES = {

	/**
	 * Public API
	 */

	encrypt: function (message, password, options) {

		options = options || {};

		// Determine mode
		var mode = options.mode || new C.mode.OFB;

		// Allow mode to override options
		if (mode.fixOptions) mode.fixOptions(options);

		var

			// Convert to bytes if message is a string
			m = (
				message.constructor == String ?
				UTF8.stringToBytes(message) :
				message
			),

			// Generate random IV
			iv = options.iv || util.randomBytes(AES._blocksize * 4),

			// Generate key
			k = (
				password.constructor == String ?
				// Derive key from pass-phrase
				C.PBKDF2(password, iv, 32, { asBytes: true, iterations: options.iterations }) :
				// else, assume byte array representing cryptographic key
				password
			);

		// Encrypt
		AES._init(k);
		mode.encrypt(AES, m, iv);

		// Return ciphertext
		m = options.iv ? m : iv.concat(m);
		return (options && options.asBytes) ? m : util.bytesToBase64(m);

	},

	decrypt: function (ciphertext, password, options) {

		options = options || {};

		// Determine mode
		var mode = options.mode || new C.mode.OFB;

		// Allow mode to override options
		if (mode.fixOptions) mode.fixOptions(options);

		var

			// Convert to bytes if ciphertext is a string
			c = (
				ciphertext.constructor == String ?
				util.base64ToBytes(ciphertext):
			    ciphertext
			),

			// Separate IV and message
			iv = options.iv || c.splice(0, AES._blocksize * 4),

			// Generate key
			k =  (
				password.constructor == String ?
				// Derive key from pass-phrase
				C.PBKDF2(password, iv, 32, { asBytes: true, iterations: options.iterations }) :
				// else, assume byte array representing cryptographic key
				password
			);

		// Decrypt
		AES._init(k);
		mode.decrypt(AES, c, iv);

		// Return plaintext
		return (options && options.asBytes) ? c : UTF8.bytesToString(c);

	},


	/**
	 * Package private methods and properties
	 */

	_blocksize: 4,

	_encryptblock: function (m, offset) {

		// Set input
		for (var row = 0; row < AES._blocksize; row++) {
			for (var col = 0; col < 4; col++)
				state[row][col] = m[offset + col * 4 + row];
		}

		// Add round key
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++)
				state[row][col] ^= keyschedule[col][row];
		}

		for (var round = 1; round < nrounds; round++) {

			// Sub bytes
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					state[row][col] = SBOX[state[row][col]];
			}

			// Shift rows
			state[1].push(state[1].shift());
			state[2].push(state[2].shift());
			state[2].push(state[2].shift());
			state[3].unshift(state[3].pop());

			// Mix columns
			for (var col = 0; col < 4; col++) {

				var s0 = state[0][col],
				    s1 = state[1][col],
				    s2 = state[2][col],
				    s3 = state[3][col];

				state[0][col] = MULT2[s0] ^ MULT3[s1] ^ s2 ^ s3;
				state[1][col] = s0 ^ MULT2[s1] ^ MULT3[s2] ^ s3;
				state[2][col] = s0 ^ s1 ^ MULT2[s2] ^ MULT3[s3];
				state[3][col] = MULT3[s0] ^ s1 ^ s2 ^ MULT2[s3];

			}

			// Add round key
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					state[row][col] ^= keyschedule[round * 4 + col][row];
			}

		}

		// Sub bytes
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++)
				state[row][col] = SBOX[state[row][col]];
		}

		// Shift rows
		state[1].push(state[1].shift());
		state[2].push(state[2].shift());
		state[2].push(state[2].shift());
		state[3].unshift(state[3].pop());

		// Add round key
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++)
				state[row][col] ^= keyschedule[nrounds * 4 + col][row];
		}

		// Set output
		for (var row = 0; row < AES._blocksize; row++) {
			for (var col = 0; col < 4; col++)
				m[offset + col * 4 + row] = state[row][col];
		}

	},

	_decryptblock: function (c, offset) {

		// Set input
		for (var row = 0; row < AES._blocksize; row++) {
			for (var col = 0; col < 4; col++)
				state[row][col] = c[offset + col * 4 + row];
		}

		// Add round key
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++)
				state[row][col] ^= keyschedule[nrounds * 4 + col][row];
		}

		for (var round = 1; round < nrounds; round++) {

			// Inv shift rows
			state[1].unshift(state[1].pop());
			state[2].push(state[2].shift());
			state[2].push(state[2].shift());
			state[3].push(state[3].shift());

			// Inv sub bytes
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					state[row][col] = INVSBOX[state[row][col]];
			}

			// Add round key
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					state[row][col] ^= keyschedule[(nrounds - round) * 4 + col][row];
			}

			// Inv mix columns
			for (var col = 0; col < 4; col++) {

				var s0 = state[0][col],
				    s1 = state[1][col],
				    s2 = state[2][col],
				    s3 = state[3][col];

				state[0][col] = MULTE[s0] ^ MULTB[s1] ^ MULTD[s2] ^ MULT9[s3];
				state[1][col] = MULT9[s0] ^ MULTE[s1] ^ MULTB[s2] ^ MULTD[s3];
				state[2][col] = MULTD[s0] ^ MULT9[s1] ^ MULTE[s2] ^ MULTB[s3];
				state[3][col] = MULTB[s0] ^ MULTD[s1] ^ MULT9[s2] ^ MULTE[s3];

			}

		}

		// Inv shift rows
		state[1].unshift(state[1].pop());
		state[2].push(state[2].shift());
		state[2].push(state[2].shift());
		state[3].push(state[3].shift());

		// Inv sub bytes
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++)
				state[row][col] = INVSBOX[state[row][col]];
		}

		// Add round key
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++)
				state[row][col] ^= keyschedule[col][row];
		}

		// Set output
		for (var row = 0; row < AES._blocksize; row++) {
			for (var col = 0; col < 4; col++)
				c[offset + col * 4 + row] = state[row][col];
		}

	},


	/**
	 * Private methods
	 */

	_init: function (k) {
		keylength = k.length / 4;
		nrounds = keylength + 6;
		AES._keyexpansion(k);
	},

	// Generate a key schedule
	_keyexpansion: function (k) {

		keyschedule = [];

		for (var row = 0; row < keylength; row++) {
			keyschedule[row] = [
				k[row * 4],
				k[row * 4 + 1],
				k[row * 4 + 2],
				k[row * 4 + 3]
			];
		}

		for (var row = keylength; row < AES._blocksize * (nrounds + 1); row++) {

			var temp = [
				keyschedule[row - 1][0],
				keyschedule[row - 1][1],
				keyschedule[row - 1][2],
				keyschedule[row - 1][3]
			];

			if (row % keylength == 0) {

				// Rot word
				temp.push(temp.shift());

				// Sub word
				temp[0] = SBOX[temp[0]];
				temp[1] = SBOX[temp[1]];
				temp[2] = SBOX[temp[2]];
				temp[3] = SBOX[temp[3]];

				temp[0] ^= RCON[row / keylength];

			} else if (keylength > 6 && row % keylength == 4) {

				// Sub word
				temp[0] = SBOX[temp[0]];
				temp[1] = SBOX[temp[1]];
				temp[2] = SBOX[temp[2]];
				temp[3] = SBOX[temp[3]];

			}

			keyschedule[row] = [
				keyschedule[row - keylength][0] ^ temp[0],
				keyschedule[row - keylength][1] ^ temp[1],
				keyschedule[row - keylength][2] ^ temp[2],
				keyschedule[row - keylength][3] ^ temp[3]
			];

		}

	}

};

})();// Basic Javascript Elliptic Curve implementation
// Ported loosely from BouncyCastle's Java EC code
// Only Fp curves implemented for now

// Requires jsbn.js and jsbn2.js

// ----------------
// ECFieldElementFp

// constructor
function ECFieldElementFp(q,x) {
    this.x = x;
    // TODO if(x.compareTo(q) >= 0) error
    this.q = q;
}

function feFpEquals(other) {
    if(other == this) return true;
    return (this.q.equals(other.q) && this.x.equals(other.x));
}

function feFpToBigInteger() {
    return this.x;
}

function feFpNegate() {
    return new ECFieldElementFp(this.q, this.x.negate().mod(this.q));
}

function feFpAdd(b) {
    return new ECFieldElementFp(this.q, this.x.add(b.toBigInteger()).mod(this.q));
}

function feFpSubtract(b) {
    return new ECFieldElementFp(this.q, this.x.subtract(b.toBigInteger()).mod(this.q));
}

function feFpMultiply(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger()).mod(this.q));
}

function feFpSquare() {
    return new ECFieldElementFp(this.q, this.x.square().mod(this.q));
}

function feFpDivide(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger().modInverse(this.q)).mod(this.q));
}

ECFieldElementFp.prototype.equals = feFpEquals;
ECFieldElementFp.prototype.toBigInteger = feFpToBigInteger;
ECFieldElementFp.prototype.negate = feFpNegate;
ECFieldElementFp.prototype.add = feFpAdd;
ECFieldElementFp.prototype.subtract = feFpSubtract;
ECFieldElementFp.prototype.multiply = feFpMultiply;
ECFieldElementFp.prototype.square = feFpSquare;
ECFieldElementFp.prototype.divide = feFpDivide;

// ----------------
// ECPointFp

// constructor
function ECPointFp(curve,x,y,z) {
    this.curve = curve;
    this.x = x;
    this.y = y;
    // Projective coordinates: either zinv == null or z * zinv == 1
    // z and zinv are just BigIntegers, not fieldElements
    if(z == null) {
      this.z = BigInteger.ONE;
    }
    else {
      this.z = z;
    }
    this.zinv = null;
    //TODO: compression flag
}

function pointFpGetX() {
    if(this.zinv == null) {
      this.zinv = this.z.modInverse(this.curve.q);
    }
    return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
}

function pointFpGetY() {
    if(this.zinv == null) {
      this.zinv = this.z.modInverse(this.curve.q);
    }
    return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
}

function pointFpEquals(other) {
    if(other == this) return true;
    if(this.isInfinity()) return other.isInfinity();
    if(other.isInfinity()) return this.isInfinity();
    var u, v;
    // u = Y2 * Z1 - Y1 * Z2
    u = other.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(other.z)).mod(this.curve.q);
    if(!u.equals(BigInteger.ZERO)) return false;
    // v = X2 * Z1 - X1 * Z2
    v = other.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(other.z)).mod(this.curve.q);
    return v.equals(BigInteger.ZERO);
}

function pointFpIsInfinity() {
    if((this.x == null) && (this.y == null)) return true;
    return this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
}

function pointFpNegate() {
    return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
}

function pointFpAdd(b) {
    if(this.isInfinity()) return b;
    if(b.isInfinity()) return this;

    // u = Y2 * Z1 - Y1 * Z2
    var u = b.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(b.z)).mod(this.curve.q);
    // v = X2 * Z1 - X1 * Z2
    var v = b.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(b.z)).mod(this.curve.q);

    if(BigInteger.ZERO.equals(v)) {
        if(BigInteger.ZERO.equals(u)) {
            return this.twice(); // this == b, so double
        }
	return this.curve.getInfinity(); // this = -b, so infinity
    }

    var THREE = new BigInteger("3");
    var x1 = this.x.toBigInteger();
    var y1 = this.y.toBigInteger();
    var x2 = b.x.toBigInteger();
    var y2 = b.y.toBigInteger();

    var v2 = v.square();
    var v3 = v2.multiply(v);
    var x1v2 = x1.multiply(v2);
    var zu2 = u.square().multiply(this.z);

    // x3 = v * (z2 * (z1 * u^2 - 2 * x1 * v^2) - v^3)
    var x3 = zu2.subtract(x1v2.shiftLeft(1)).multiply(b.z).subtract(v3).multiply(v).mod(this.curve.q);
    // y3 = z2 * (3 * x1 * u * v^2 - y1 * v^3 - z1 * u^3) + u * v^3
    var y3 = x1v2.multiply(THREE).multiply(u).subtract(y1.multiply(v3)).subtract(zu2.multiply(u)).multiply(b.z).add(u.multiply(v3)).mod(this.curve.q);
    // z3 = v^3 * z1 * z2
    var z3 = v3.multiply(this.z).multiply(b.z).mod(this.curve.q);

    return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
}

function pointFpTwice() {
    if(this.isInfinity()) return this;
    if(this.y.toBigInteger().signum() == 0) return this.curve.getInfinity();

    // TODO: optimized handling of constants
    var THREE = new BigInteger("3");
    var x1 = this.x.toBigInteger();
    var y1 = this.y.toBigInteger();

    var y1z1 = y1.multiply(this.z);
    var y1sqz1 = y1z1.multiply(y1).mod(this.curve.q);
    var a = this.curve.a.toBigInteger();

    // w = 3 * x1^2 + a * z1^2
    var w = x1.square().multiply(THREE);
    if(!BigInteger.ZERO.equals(a)) {
      w = w.add(this.z.square().multiply(a));
    }
    w = w.mod(this.curve.q);
    // x3 = 2 * y1 * z1 * (w^2 - 8 * x1 * y1^2 * z1)
    var x3 = w.square().subtract(x1.shiftLeft(3).multiply(y1sqz1)).shiftLeft(1).multiply(y1z1).mod(this.curve.q);
    // y3 = 4 * y1^2 * z1 * (3 * w * x1 - 2 * y1^2 * z1) - w^3
    var y3 = w.multiply(THREE).multiply(x1).subtract(y1sqz1.shiftLeft(1)).shiftLeft(2).multiply(y1sqz1).subtract(w.square().multiply(w)).mod(this.curve.q);
    // z3 = 8 * (y1 * z1)^3
    var z3 = y1z1.square().multiply(y1z1).shiftLeft(3).mod(this.curve.q);

    return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
}

// Simple NAF (Non-Adjacent Form) multiplication algorithm
// TODO: modularize the multiplication algorithm
function pointFpMultiply(k) {
    if(this.isInfinity()) return this;
    if(k.signum() == 0) return this.curve.getInfinity();

    var e = k;
    var h = e.multiply(new BigInteger("3"));

    var neg = this.negate();
    var R = this;

    var i;
    for(i = h.bitLength() - 2; i > 0; --i) {
	R = R.twice();

	var hBit = h.testBit(i);
	var eBit = e.testBit(i);

	if (hBit != eBit) {
	    R = R.add(hBit ? this : neg);
	}
    }

    return R;
}

// Compute this*j + x*k (simultaneous multiplication)
function pointFpMultiplyTwo(j,x,k) {
  var i;
  if(j.bitLength() > k.bitLength())
    i = j.bitLength() - 1;
  else
    i = k.bitLength() - 1;

  var R = this.curve.getInfinity();
  var both = this.add(x);
  while(i >= 0) {
    R = R.twice();
    if(j.testBit(i)) {
      if(k.testBit(i)) {
        R = R.add(both);
      }
      else {
        R = R.add(this);
      }
    }
    else {
      if(k.testBit(i)) {
        R = R.add(x);
      }
    }
    --i;
  }

  return R;
}

ECPointFp.prototype.getX = pointFpGetX;
ECPointFp.prototype.getY = pointFpGetY;
ECPointFp.prototype.equals = pointFpEquals;
ECPointFp.prototype.isInfinity = pointFpIsInfinity;
ECPointFp.prototype.negate = pointFpNegate;
ECPointFp.prototype.add = pointFpAdd;
ECPointFp.prototype.twice = pointFpTwice;
ECPointFp.prototype.multiply = pointFpMultiply;
ECPointFp.prototype.multiplyTwo = pointFpMultiplyTwo;

// ----------------
// ECCurveFp

// constructor
function ECCurveFp(q,a,b) {
    this.q = q;
    this.a = this.fromBigInteger(a);
    this.b = this.fromBigInteger(b);
    this.infinity = new ECPointFp(this, null, null);
}

function curveFpGetQ() {
    return this.q;
}

function curveFpGetA() {
    return this.a;
}

function curveFpGetB() {
    return this.b;
}

function curveFpEquals(other) {
    if(other == this) return true;
    return(this.q.equals(other.q) && this.a.equals(other.a) && this.b.equals(other.b));
}

function curveFpGetInfinity() {
    return this.infinity;
}

function curveFpFromBigInteger(x) {
    return new ECFieldElementFp(this.q, x);
}

// for now, work with hex strings because they're easier in JS
function curveFpDecodePointHex(s) {
    switch(parseInt(s.substr(0,2), 16)) { // first byte
    case 0:
	return this.infinity;
    case 2:
    case 3:
	// point compression not supported yet
	return null;
    case 4:
    case 6:
    case 7:
	var len = (s.length - 2) / 2;
	var xHex = s.substr(2, len);
	var yHex = s.substr(len+2, len);

	return new ECPointFp(this,
			     this.fromBigInteger(new BigInteger(xHex, 16)),
			     this.fromBigInteger(new BigInteger(yHex, 16)));

    default: // unsupported
	return null;
    }
}

ECCurveFp.prototype.getQ = curveFpGetQ;
ECCurveFp.prototype.getA = curveFpGetA;
ECCurveFp.prototype.getB = curveFpGetB;
ECCurveFp.prototype.equals = curveFpEquals;
ECCurveFp.prototype.getInfinity = curveFpGetInfinity;
ECCurveFp.prototype.fromBigInteger = curveFpFromBigInteger;
ECCurveFp.prototype.decodePointHex = curveFpDecodePointHex;
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// (public)
function bnClone() { var r = nbi(); this.copyTo(r); return r; }

// (public) return value as integer
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
}

// (public) return value as byte
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

// (public) return value as short (assumes DB>=16)
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) alternate constructor
function bnpFromNumber(a,b,c) {
  if("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))	// force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0); // force odd
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}

// (public) this & a
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

// (public) this | a
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

// (public) this ^ a
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

// (public) this & ~a
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

// (public) ~this
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this[i] != 0) return i*this.DB+lbit(this[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) { return this.changeBit(n,op_or); }

// (public) this & ~(1<<n)
function bnClearBit(n) { return this.changeBit(n,op_andnot); }

// (public) this ^ (1<<n)
function bnFlipBit(n) { return this.changeBit(n,op_xor); }

// (protected) r = this + a
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) this - a
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

// (public) this * a
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

// (public) this^2
function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

// (public) this / a
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

// (public) this % a
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n,w) {
  if(n == 0) return;
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) { return this.exp(e,new NullExp()); }

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; // assumes a,this >= 0
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}

function barrettRevert(x) { return x; }

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = x*y mod m; x,y != r
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }

  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }

    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {	// ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }

    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}

var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)
// prng4.js - uses Arcfour as a PRNG

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
  var i, j, t;
  for(i = 0; i < 256; ++i)
    this.S[i] = i;
  j = 0;
  for(i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

function ARC4next() {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
  return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;
// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;
var has_seeded_large_seed;

// Mix in integer of n bits into the pool
function rng_seed_int(x, n) {
    if (!n) n = 32;
    for (var i = 0; i <= n-8; i += 8) {
        if (x >> i) rng_pool[rng_pptr++] ^= (x >> i) & 255;
        if (rng_pptr >= rng_psize) rng_pptr -= rng_psize;
    }
}

//Seed an array of 32 bit integers of at least rng_psize/4
//rng_state cannot be initialized until this is called at least once
//Aim is to guarantee the pool is seeded at minimum with extra_seed or getRandomValues
//As WebWorker getRandomValues will not exist so seed_large_int32_array must be called with external entropy passed from main window
function seed_large_int32_array(x) {
    if (x.length < rng_psize/4) {
        throw 'Seed shorter than rng_psize';
    }
    for (var i = 0; i < x.length; ++i) {
        rng_seed_int(x[i], 32);
    }
    has_seeded_large_seed = true;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
    rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if(rng_pool == null) {
    rng_pool = new Array();
    rng_pptr = 0;
    has_seeded_large_seed = false;

    var mCrypto = _window.crypto || _window.msCrypto;

    if (mCrypto && mCrypto.getRandomValues && typeof Int32Array != 'undefined') {
         var word_array = new Int32Array(rng_psize/4);

         mCrypto.getRandomValues(word_array);

         seed_large_int32_array(word_array);
     }

     for (var ii = 0; ii < rng_psize/2; ++ii) {  // extract some randomness from Math.random()
         rng_seed_int(65536 * Math.random(), 16);
     }
}

function rng_get_byte() {
    if(rng_state == null) {
        if (rng_pool.length != rng_psize) {
            throw 'RNG Pool length does not match pool size';
        }

        if (rng_pool.filter(function(v) { return Math.abs(v) == 0; }).length > 12) {
            throw 'RNG Pool contains a large number of zero elements'
        }

        if (!has_seeded_large_seed) {
            throw 'RNG Pool has not been seeded with sufficient entropy yet';
        }

        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
            rng_pool[rng_pptr] = 0;
        rng_pptr = 0;
        //rng_pool = null;
    }
    // TODO: allow reseeding after first request
    return rng_state.next();
}

function rng_get_bytes(ba) {
    var i;
    for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;
// Named EC curves

// Requires ec.js, jsbn.js, and jsbn2.js

// ----------------
// X9ECParameters

// constructor
function X9ECParameters(curve,g,n,h) {
    this.curve = curve;
    this.g = g;
    this.n = n;
    this.h = h;
}

function x9getCurve() {
    return this.curve;
}

function x9getG() {
    return this.g;
}

function x9getN() {
    return this.n;
}

function x9getH() {
    return this.h;
}

X9ECParameters.prototype.getCurve = x9getCurve;
X9ECParameters.prototype.getG = x9getG;
X9ECParameters.prototype.getN = x9getN;
X9ECParameters.prototype.getH = x9getH;

// ----------------
// SECNamedCurves

function fromHex(s) { return new BigInteger(s, 16); }

function secp256k1() {
    // p = 2^256 - 2^32 - 2^9 - 2^8 - 2^7 - 2^6 - 2^4 - 1
    var p = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
    var a = BigInteger.ZERO;
    var b = fromHex("7");
    //byte[] S = null;
    var n = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
    var h = BigInteger.ONE;
    var curve = new ECCurveFp(p, a, b);
    var G = curve.decodePointHex("04"
                + "79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798"
                + "483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8");
    return new X9ECParameters(curve, G, n, h);
}
var Bitcoin = {};

/*
  function makeKeypair()
  {
    // Generate private key
    var n = ecparams.getN();
    var n1 = n.subtract(BigInteger.ONE);
    var r = new BigInteger(n.bitLength(), rng);
    
    var privateKey = r.mod(n1).add(BigInteger.ONE);
    
    // Generate public key
    var G = ecparams.getG();
    var publicPoint = G.multiply(privateKey);

    return {priv: privateKey, pubkey: publicPoint};
  };

  function serializeTransaction(tx)
  {
    var buffer = [];
    buffer = buffer.concat(Crypto.util.wordsToBytes([parseInt(tx.version)]));
    buffer = buffer.concat(numToVarInt(tx.ins.length));
    for (var i = 0; i < tx.ins.length; i++) {
      var txin = tx.ins[i];
      buffer = buffer.concat(Crypto.util.base64ToBytes(txin.outpoint.hash));
      buffer = buffer.concat(Crypto.util.wordsToBytes([parseInt(txin.index)]));
      var scriptBytes = Crypto.util.base64ToBytes(txin.script);
      buffer = buffer.concat(numToVarInt(scriptBytes.length));
      buffer = buffer.concat(scriptBytes);
      buffer = buffer.concat(Crypto.util.wordsToBytes([parseInt(txin.sequence)]));
    }
    buffer = buffer.concat(numToVarInt(tx.outs.length));
    for (var i = 0; i < tx.outs.length; i++) {
      var txout = tx.outs[i];
      var valueHex = (new BigInteger(txout.value, 10)).toString(16);
      while (valueHex.length < 16) valueHex = "0" + valueHex;
      buffer = buffer.concat(Crypto.util.hexToBytes(valueHex));
      var scriptBytes = Crypto.util.base64ToBytes(txout.script);
      buffer = buffer.concat(numToVarInt(scriptBytes.length));
      buffer = buffer.concat(scriptBytes);
    }
    buffer = buffer.concat(Crypto.util.wordsToBytes([parseInt(tx.lock_time)]));
    
    return buffer;
  };

  var OP_CODESEPARATOR = 171;

  var SIGHASH_ALL = 1;
  var SIGHASH_NONE = 2;
  var SIGHASH_SINGLE = 3;
  var SIGHASH_ANYONECANPAY = 80;

  function hashTransactionForSignature(scriptCode, tx, inIndex, hashType)
  {
    // TODO: We need to actually deep copy here
    var txTmp = tx;

    // In case concatenating two scripts ends up with two codeseparators,
    // or an extra one at the end, this prevents all those possible incompatibilities.
    scriptCode = scriptCode.filter(function (val) {
      return val !== OP_CODESEPARATOR;
    });
    
    // Blank out other inputs' signatures
    for (var i = 0; i < txTmp.ins.length; i++) {
      txTmp.ins[i].script = Crypto.util.bytesToBase64([]);
    }
    txTmp.ins[inIndex].script = Crypto.util.bytesToBase64(scriptCode);

    // Blank out some of the outputs
    if ((hashType & 0x1f) == SIGHASH_NONE) {
      txTmp.outs = [];

      // Let the others update at will
      for (var i = 0; i < txTmp.ins.length; i++)
        if (i != inIndex)
          txTmp.ins[i].sequence = 0;
    } else if ((hashType & 0x1f) == SIGHASH_SINGLE) {
      // TODO: Implement
    }

    // Blank out other inputs completely, not recommended for open transactions
    if (hashType & SIGHASH_ANYONECANPAY) {
      txTmp.ins = [txTmp.ins[inIndex]];
    }
    
    var buffer = serializeTransaction(txTmp);
    
    buffer.concat(Crypto.util.wordsToBytes([parseInt(hashType)]));

    console.log(buffer);
    
    return Crypto.SHA256(Crypto.SHA256(buffer, {asBytes: true}), {asBytes: true});
  };

  function verifyTransactionSignature(tx) {
    var hash = hashTransactionForSignature([], tx, 0, 0);
    return Crypto.util.bytesToHex(hash);
  };

  function numToVarInt(i)
  {
    // TODO: THIS IS TOTALLY UNTESTED!
    if (i < 0xfd) {
      // unsigned char
      return [i];
    } else if (i <= 1<<16) {
      // unsigned short (LE)
      return [0xfd, i >>> 8, i & 255];
    } else if (i <= 1<<32) {
      // unsigned int (LE)
      return [0xfe].concat(Crypto.util.wordsToBytes([i]));
    } else {
      // unsigned long long (LE)
      return [0xff].concat(Crypto.util.wordsToBytes([i >>> 32, i]));
    }
  };

  var testTx = {
    "version":"1",
    "lock_time":"0",
    "block": {
      "hash":"N/A",
      "height":115806
    },
    "index":6,
    "hash":"WUFzjKubG1kqfJWMb4qZdlhU2F3l5NGXN7AUg8Jwl14=",
    "ins":[{
      "outpoint":{
        "hash":"nqcbMM1oRhfLdZga11q7x0CpUMujm+vtxHXO9V0gnwE=",
        "index":0
      },
      "script":"RzBEAiB2XXkx1pca9SlfCmCGNUVf+h2sAFBttcxG1VnypIcvEgIgXrOp7LSdYBYp3nPsQAz8BOLD3K4pAlXfZImP1rkzk2EBQQRi7NcODzNfnVqLtG79Axp5UF6EhFIhCmzqKqssfKpfCIOmzCuXEeDFUFvFzeGLJx5N+wp2qRS1TqYezGD3yERk",
      "sequence":4294967295
    }],
    "outs":[{
      "value":"3000000000",
      "script":"dqkUBLZwqhAPRVgZvwI8MN5gLHbU8NOIrA=="
    },{
      "value":"25937000000",
      "script":"dqkUQ82gJ0O5vOBg6yK5/yorLLV5zLKIrA=="
    }]
  };

   TODO: Make this stuff into test cases ;)
   $(function () {
   var key = new Bitcoin.ECKey(Crypto.util.hexToBytes("5c0b98e524ad188ddef35dc6abba13c34a351a05409e5d285403718b93336a4a"));
   key = new Bitcoin.ECKey(Crypto.util.hexToBytes("180cb41c7c600be951b5d3d0a7334acc7506173875834f7a6c4c786a28fcbb19"));
   //console.log(key.getBitcoinAddress().toString());
   //var message = Crypto.util.hexToBytes("2aec28d323ee7b06a799d540d224b351161fe48967174ca5e43164e86137da11");
   //message = [0];
   //var out = key.sign(message);
   //console.log("pubkey: "+Crypto.util.bytesToHex(key.getPub()));
   //console.log("sig: "+Crypto.util.bytesToHex(out));

   //console.log(key.verify(message, out));

   //console.log(Bitcoin.ECDSA.verify(message, Crypto.util.hexToBytes("3046022100dffbc26774fc841bbe1c1362fd643609c6e42dcb274763476d87af2c0597e89e022100c59e3c13b96b316cae9fa0ab0260612c7a133a6fe2b3445b6bf80b3123bf274d"), Crypto.util.hexToBytes("0401de173aa944eacf7e44e5073baca93fb34fe4b7897a1c82c92dfdc8a1f75ef58cd1b06e8052096980cb6e1ad6d3df143c34b3d7394bae2782a4df570554c2fb")));

   //console.log(Bitcoin.ECDSA.verify(Crypto.util.hexToBytes("230aba77ccde46bb17fcb0295a92c0cc42a6ea9f439aaadeb0094625f49e6ed8"), Crypto.util.hexToBytes("3046022100a3ee5408f0003d8ef00ff2e0537f54ba09771626ff70dca1f01296b05c510e85022100d4dc70a5bb50685b65833a97e536909a6951dd247a2fdbde6688c33ba6d6407501"),Crypto.util.hexToBytes("04a19c1f07c7a0868d86dbb37510305843cc730eb3bea8a99d92131f44950cecd923788419bfef2f635fad621d753f30d4b4b63b29da44b4f3d92db974537ad5a4")));
   //console.log(Bitcoin.ECDSA.verify(Crypto.util.hexToBytes("c2c75bb77d7a5acddceb1d45ceef58e7451fd0d3abc9d4c16df7848eefafe00d"), Crypto.util.hexToBytes("3045022100ff9362dadcbf1f6ef954bc8eb27144bbb4f49abd32be1eb04c311151dcf4bcf802205112c2ca6a25aefb8be98bf460c5a9056c01253f31e118d80b81ec9604e3201a01"),Crypto.util.hexToBytes("04fe62ce7892ec209310c176ef7f06565865e286e8699e884603657efa9aa51086785099d544d4e04f1f7b4b065205c1783fade8daf4ba1e0d1962292e8eb722cd")));
   });
   //
*/
// BigInteger monkey patching
BigInteger.valueOf = function (x) {
    if (!x) return BigInteger.ZERO;
    return new BigInteger(''+x, 10);
}

/**
 * Returns a byte array representation of the big integer.
 *
 * This returns the absolute of the contained value in big endian
 * form. A value of zero results in an empty array.
 */
BigInteger.prototype.toByteArrayUnsigned = function () {
    var ba = this.abs().toByteArray();
    if (ba.length) {
        if (ba[0] == 0) {
            ba = ba.slice(1);
        }
        return ba.map(function (v) {
            return (v < 0) ? v + 256 : v;
        });
    } else {
        // Empty array, nothing to do
        return ba;
    }
};

/**
 * Turns a byte array into a big integer.
 *
 * This function will interpret a byte array as a big integer in big
 * endian notation and ignore leading zeros.
 */
BigInteger.fromByteArrayUnsigned = function (ba) {
    if (!ba.length) {
        return ba.valueOf(0);
    } else if (ba[0] & 0x80) {
        // Prepend a zero so the BigInteger class doesn't mistake this
        // for a negative integer.
        return new BigInteger([0].concat(ba));
    } else {
        return new BigInteger(ba);
    }
};

/**
 * Converts big integer to signed byte representation.
 *
 * The format for this value uses a the most significant bit as a sign
 * bit. If the most significant bit is already occupied by the
 * absolute value, an extra byte is prepended and the sign bit is set
 * there.
 *
 * Examples:
 *
 *      0 =>     0x00
 *      1 =>     0x01
 *     -1 =>     0x81
 *    127 =>     0x7f
 *   -127 =>     0xff
 *    128 =>   0x0080
 *   -128 =>   0x8080
 *    255 =>   0x00ff
 *   -255 =>   0x80ff
 *  16300 =>   0x3fac
 * -16300 =>   0xbfac
 *  62300 => 0x00f35c
 * -62300 => 0x80f35c
 */
BigInteger.prototype.toByteArraySigned = function () {
    var val = this.abs().toByteArrayUnsigned();
    var neg = this.compareTo(BigInteger.ZERO) < 0;

    if (neg) {
        if (val[0] & 0x80) {
            val.unshift(0x80);
        } else {
            val[0] |= 0x80;
        }
    } else {
        if (val[0] & 0x80) {
            val.unshift(0x00);
        }
    }

    return val;
};

/**
 * Parse a signed big integer byte representation.
 *
 * For details on the format please see BigInteger.toByteArraySigned.
 */
BigInteger.fromByteArraySigned = function (ba) {
    // Check for negative value
    if (ba[0] & 0x80) {
        // Remove sign bit
        ba[0] &= 0x7f;

        return BigInteger.fromByteArrayUnsigned(ba).negate();
    } else {
        return BigInteger.fromByteArrayUnsigned(ba);
    }
};

// Bitcoin utility functions
Bitcoin.Util = {
    /**
     * Cross-browser compatibility version of Array.isArray.
     */
    isArray: Array.isArray || function(o)
    {
        return Object.prototype.toString.call(o) === '[object Array]';
    },

    /**
     * Create an array of a certain length filled with a specific value.
     */
    makeFilledArray: function (len, val)
    {
        var array = [];
        var i = 0;
        while (i < len) {
            array[i++] = val;
        }
        return array;
    },

    /**
     * Turn an integer into a "var_int".
     *
     * "var_int" is a variable length integer used by Bitcoin's binary format.
     *
     * Returns a byte array.
     */
    numToVarInt: function (i)
    {
        if (i < 0xfd) {
            // unsigned char
            return [i];
        } else if (i <= 1<<16) {
            // unsigned short (LE)
            return [0xfd, i & 255, i >>> 8]; // BitcoinQT wants big endian here
        } else if (i <= 1<<32) {
            // unsigned int (LE)
            return [0xfe].concat(Crypto.util.wordsToBytes([i]));
        } else {
            // unsigned long long (LE)
            return [0xff].concat(Crypto.util.wordsToBytes([i >>> 32, i]));
        }
    },

    /**
     * Parse a Bitcoin value byte array, returning a BigInteger.
     */
    valueToBigInt: function (valueBuffer)
    {
        if (valueBuffer instanceof BigInteger) return valueBuffer;

        // Prepend zero byte to prevent interpretation as negative integer
        return BigInteger.fromByteArrayUnsigned(valueBuffer);
    },

    /**
     * Format a Bitcoin value as a string.
     *
     * Takes a BigInteger or byte-array and returns that amount of Bitcoins in a
     * nice standard formatting.
     *
     * Examples:
     * 12.3555
     * 0.1234
     * 900.99998888
     * 34.00
     */
    formatValue: function (valueBuffer) {
        var value = this.valueToBigInt(valueBuffer).toString();

        var integerPart = value.length > 8 ? value.substr(0, value.length-8) : '0';
        var decimalPart = value.length > 8 ? value.substr(value.length-8) : value;

        while (decimalPart.length < 8) decimalPart = "0"+decimalPart;
        decimalPart = decimalPart.replace(/0*$/, '');
        while (decimalPart.length < 2) decimalPart += "0";
        return integerPart+"."+decimalPart;
    },

    /**
     * Parse a floating point string as a Bitcoin value.
     *
     * Keep in mind that parsing user input is messy. You should always display
     * the parsed value back to the user to make sure we understood his input
     * correctly.
     */
    parseValue: function (valueString) {
        if (!valueString) return BigInteger.ZERO;

        valueString = ''+valueString;

        if (!/^[\d.]+$/.test(valueString)) {
            return BigInteger.ZERO;
        }

        // TODO: Detect other number formats (e.g. comma as decimal separator)
        var valueComp = valueString.split('.');
        var integralPart = valueComp[0];
        var fractionalPart = valueComp[1] || "0";

        fractionalPart = fractionalPart.length > 8 ? fractionalPart.substr(0, 8) : fractionalPart;

        while (fractionalPart.length < 8) fractionalPart += "0";

        fractionalPart = fractionalPart.replace(/^0+/g, '');
        var value = BigInteger.valueOf(integralPart);
        value = value.multiply(BigInteger.valueOf(100000000));
        value = value.add(BigInteger.valueOf(fractionalPart));
        return value;
    },

    /**
     * Calculate RIPEMD160(SHA256(data)).
     *
     * Takes an arbitrary byte array as inputs and returns the hash as a byte
     * array.
     */
    sha256ripe160: function (data) {
        return Crypto.RIPEMD160(Crypto.SHA256(data, {asBytes: true}), {asBytes: true});
    }
};

for (var i in Crypto.util) {
    if (Crypto.util.hasOwnProperty(i)) {
        Bitcoin.Util[i] = Crypto.util[i];
    }
}
var B58 = {
    alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    base: BigInteger.valueOf(58),

    /**
     * Convert a byte array to a base58-encoded string.
     *
     * Written by Mike Hearn for BitcoinJ.
     *   Copyright (c) 2011 Google Inc.
     *
     * Ported to JavaScript by Stefan Thomas.
     */
    encode: function (input) {
        var bi = BigInteger.fromByteArrayUnsigned(input);
        var chars = [];

        while (bi.compareTo(B58.base) >= 0) {
            var mod = bi.mod(B58.base);
            chars.unshift(B58.alphabet[mod.intValue()]);
            bi = bi.subtract(mod).divide(B58.base);
        }
        chars.unshift(B58.alphabet[bi.intValue()]);

        // Convert leading zeros too.
        for (var i = 0; i < input.length; i++) {
            if (input[i] == 0x00) {
                chars.unshift(B58.alphabet[0]);
            } else break;
        }

        return chars.join('');
    },

    /**
     * Convert a base58-encoded string to a byte array.
     *
     * Written by Mike Hearn for BitcoinJ.
     *   Copyright (c) 2011 Google Inc.
     *
     * Ported to JavaScript by Stefan Thomas.
     */
    decode: function (input) {
        var bi = BigInteger.valueOf(0);
        var leadingZerosNum = 0;
        for (var i = input.length - 1; i >= 0; i--) {
            var alphaIndex = B58.alphabet.indexOf(input[i]);

            bi = bi.add(BigInteger.valueOf(alphaIndex)
                .multiply(B58.base.pow(input.length - 1 -i)));

            // This counts leading zero bytes
            if (input[i] == "1") leadingZerosNum++;
            else leadingZerosNum = 0;
        }
        var bytes = bi.toByteArrayUnsigned();

        // Add leading zeros
        while (leadingZerosNum-- > 0) bytes.unshift(0);

        return bytes;
    }
};

Bitcoin.Base58 = B58;
Bitcoin.Address = function (bytes, version) {
  if ("string" == typeof bytes) {
    this.fromString(bytes);
    return;
  }
  this.hash = bytes;

  this.version = version || Bitcoin.Address.pubKeyHashVersion;
};

/**
 * Serialize this object as a standard Bitcoin address.
 *
 * Returns the address as a base58-encoded string in the standardized format.
 */
Bitcoin.Address.prototype.toString = function () {
  // Get a copy of the hash
  var hash = this.hash.slice(0);

  // Version
  hash.unshift(this.version);

  var checksum = Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true});

  var bytes = hash.concat(checksum.slice(0,4));

  return Bitcoin.Base58.encode(bytes);
};

Bitcoin.Address.prototype.getHashBase64 = function () {
  return Crypto.util.bytesToBase64(this.hash);
};

/**
 * Parse a Bitcoin address contained in a string.
 */
Bitcoin.Address.prototype.fromString = function (string) {
  var bytes = Bitcoin.Base58.decode(string);

  var hash = bytes.slice(0, 21);

  var checksum = Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true});

  if (checksum[0] != bytes[21] ||
      checksum[1] != bytes[22] ||
      checksum[2] != bytes[23] ||
      checksum[3] != bytes[24]) {
    throw "Checksum validation failed!";
  }

  this.version = hash.shift();
  this.hash = hash;

  if (this.version != Bitcoin.Address.pubKeyHashVersion && this.version != Bitcoin.Address.p2shVersion) {
    throw "Version "+version+" not supported!";
  }
};

Bitcoin.Address.isP2SHAddress = function () {
  return this.version == Bitcoin.Address.p2shVersion;
}

Bitcoin.Address.isPubKeyHashAddress = function () {
  return this.version == Bitcoin.Address.pubKeyHashVersion;
}

Bitcoin.Address.pubKeyHashVersion = 0;
Bitcoin.Address.p2shVersion = 5;
// https://tools.ietf.org/html/rfc6979#section-3.2
function deterministicGenerateK(n, hash, d) {
  // sanity check
  if (hash.length != 32) {
     throw 'Hash must be 256 bit';
  }

  var fill = function (a, b) {
     for(var i = 0; i < a.length; ++i) {
       a[i] = b;
     }
  }

  var x = d.toByteArrayUnsigned();

  //Pad to 32 bytes
  var zeros = [];
  var padding = 32 - x.length;
  while (zeros.length < padding) {
     zeros.push(0);
  }
  x = zeros.concat(x);

  var k = new Array(32);
  var v = new Array(32);
  var ZERO = [0];
  var ONE = [1];

  // Step B
  fill(v, 1);

  // Step C
  fill(k, 0);

  // Step D
  k = Crypto.HMAC(Crypto.SHA256, v.concat(ZERO, x, hash), k, {asBytes: true});

  // Step E
  v = Crypto.HMAC(Crypto.SHA256, v, k, {asBytes: true});

  // Step F
  k = Crypto.HMAC(Crypto.SHA256, v.concat(ONE, x, hash), k, {asBytes: true});

  // Step G
  v = Crypto.HMAC(Crypto.SHA256, v, k, {asBytes: true});

  // Step H1/H2a, ignored as tlen === qlen (256 bit)
  // Step H2b
  // v = crypto.createHmac('sha256', k).update(v).digest()
  v = Crypto.HMAC(Crypto.SHA256, v, k, {asBytes: true});

  var T = BigInteger.fromByteArrayUnsigned(v)

  // Step H3, repeat until T is within the interval [1, n - 1]
  while ((T.signum() <= 0) || (T.compareTo(n) >= 0)) {
    k = Crypto.HMAC(Crypto.SHA256, v.concat(ZERO), k, {asBytes: true});

    v = Crypto.HMAC(Crypto.SHA256, v, k, {asBytes: true});

    T = BigInteger.fromByteArrayUnsigned(v);
  }

  return T;
}

function integerToBytes(i, len) {
    var bytes = i.toByteArrayUnsigned();

    if (len < bytes.length) {
        bytes = bytes.slice(bytes.length-len);
    } else while (len > bytes.length) {
        bytes.unshift(0);
    }

    return bytes;
};

ECFieldElementFp.prototype.getByteLength = function () {
    return Math.floor((this.toBigInteger().bitLength() + 7) / 8);
};

ECPointFp.prototype.getEncoded = function (compressed) {
    var x = this.getX().toBigInteger();
    var y = this.getY().toBigInteger();

    // Get value as a 32-byte Buffer
    // Fixed length based on a patch by bitaddress.org and Casascius
    var enc = integerToBytes(x, 32);

    if (compressed) {
        if (y.isEven()) {
            // Compressed even pubkey
            // M = 02 || X
            enc.unshift(0x02);
        } else {
            // Compressed uneven pubkey
            // M = 03 || X
            enc.unshift(0x03);
        }
    } else {
        // Uncompressed pubkey
        // M = 04 || X || Y
        enc.unshift(0x04);
        enc = enc.concat(integerToBytes(y, 32));
    }
    return enc;
};

ECPointFp.decodeFrom = function (curve, enc) {
    var type = enc[0];
    var dataLen = enc.length-1;

    // Extract x and y as byte arrays
    var xBa = enc.slice(1, 1 + dataLen/2);
    var yBa = enc.slice(1 + dataLen/2, 1 + dataLen);

    // Prepend zero byte to prevent interpretation as negative integer
    xBa.unshift(0);
    yBa.unshift(0);

    // Convert to BigIntegers
    var x = new BigInteger(xBa);
    var y = new BigInteger(yBa);

    // Return point
    return new ECPointFp(curve, curve.fromBigInteger(x), curve.fromBigInteger(y));
};

ECPointFp.prototype.add2D = function (b) {
    if(this.isInfinity()) return b;
    if(b.isInfinity()) return this;

    if (this.x.equals(b.x)) {
        if (this.y.equals(b.y)) {
            // this = b, i.e. this must be doubled
            return this.twice();
        }
        // this = -b, i.e. the result is the point at infinity
        return this.curve.getInfinity();
    }

    var x_x = b.x.subtract(this.x);
    var y_y = b.y.subtract(this.y);
    var gamma = y_y.divide(x_x);

    var x3 = gamma.square().subtract(this.x).subtract(b.x);
    var y3 = gamma.multiply(this.x.subtract(x3)).subtract(this.y);

    return new ECPointFp(this.curve, x3, y3);
};

ECPointFp.prototype.twice2D = function () {
    if (this.isInfinity()) return this;
    if (this.y.toBigInteger().signum() == 0) {
        // if y1 == 0, then (x1, y1) == (x1, -y1)
        // and hence this = -this and thus 2(x1, y1) == infinity
        return this.curve.getInfinity();
    }

    var TWO = this.curve.fromBigInteger(BigInteger.valueOf(2));
    var THREE = this.curve.fromBigInteger(BigInteger.valueOf(3));
    var gamma = this.x.square().multiply(THREE).add(this.curve.a).divide(this.y.multiply(TWO));

    var x3 = gamma.square().subtract(this.x.multiply(TWO));
    var y3 = gamma.multiply(this.x.subtract(x3)).subtract(this.y);

    return new ECPointFp(this.curve, x3, y3);
};

ECPointFp.prototype.multiply2D = function (k) {
    if(this.isInfinity()) return this;
    if(k.signum() == 0) return this.curve.getInfinity();

    var e = k;
    var h = e.multiply(new BigInteger("3"));

    var neg = this.negate();
    var R = this;

    var i;
    for (i = h.bitLength() - 2; i > 0; --i) {
        R = R.twice();

        var hBit = h.testBit(i);
        var eBit = e.testBit(i);

        if (hBit != eBit) {
            R = R.add2D(hBit ? this : neg);
        }
    }

    return R;
};

ECPointFp.prototype.isOnCurve = function () {
    var x = this.getX().toBigInteger();
    var y = this.getY().toBigInteger();
    var a = this.curve.getA().toBigInteger();
    var b = this.curve.getB().toBigInteger();
    var n = this.curve.getQ();
    var lhs = y.multiply(y).mod(n);
    var rhs = x.multiply(x).multiply(x)
        .add(a.multiply(x)).add(b).mod(n);
    return lhs.equals(rhs);
};

ECPointFp.prototype.toString = function () {
    return '('+this.getX().toBigInteger().toString()+','+
        this.getY().toBigInteger().toString()+')';
};

/**
 * Validate an elliptic curve point.
 *
 * See SEC 1, section 3.2.2.1: Elliptic Curve Public Key Validation Primitive
 */
ECPointFp.prototype.validate = function () {
    var n = this.curve.getQ();

    // Check Q != O
    if (this.isInfinity()) {
        throw new Error("Point is at infinity.");
    }

    // Check coordinate bounds
    var x = this.getX().toBigInteger();
    var y = this.getY().toBigInteger();
    if (x.compareTo(BigInteger.ONE) < 0 ||
        x.compareTo(n.subtract(BigInteger.ONE)) > 0) {
        throw new Error('x coordinate out of bounds');
    }
    if (y.compareTo(BigInteger.ONE) < 0 ||
        y.compareTo(n.subtract(BigInteger.ONE)) > 0) {
        throw new Error('y coordinate out of bounds');
    }

    // Check y^2 = x^3 + ax + b (mod n)
    if (!this.isOnCurve()) {
        throw new Error("Point is not on the curve.");
    }

    // Check nQ = 0 (Q is a scalar multiple of G)
    if (this.multiply(n).isInfinity()) {
        // TODO: This check doesn't work - fix.
        throw new Error("Point is not a scalar multiple of G.");
    }

    return true;
};

function dmp(v) {
    if (!(v instanceof BigInteger)) v = v.toBigInteger();
    return Crypto.util.bytesToHex(v.toByteArrayUnsigned());
};

Bitcoin.ECDSA = (function () {
    var ecparams = secp256k1();
    var rng = new SecureRandom();

    var P_OVER_FOUR = null;

    function implShamirsTrick(P, k, Q, l)
    {
        var m = Math.max(k.bitLength(), l.bitLength());
        var Z = P.add2D(Q);
        var R = P.curve.getInfinity();

        for (var i = m - 1; i >= 0; --i) {
            R = R.twice2D();

            R.z = BigInteger.ONE;

            if (k.testBit(i)) {
                if (l.testBit(i)) {
                    R = R.add2D(Z);
                } else {
                    R = R.add2D(P);
                }
            } else {
                if (l.testBit(i)) {
                    R = R.add2D(Q);
                }
            }
        }

        return R;
    };

    var ECDSA = {
        getBigRandom: function (limit) {
            return new BigInteger(limit.bitLength(), rng)
                .mod(limit.subtract(BigInteger.ONE))
                .add(BigInteger.ONE)
                ;
        },
        sign: function (hash, priv) {
            var d = priv;
            var n = ecparams.getN();
            var e = BigInteger.fromByteArrayUnsigned(hash);

            var k = deterministicGenerateK(n, hash, d);
            var G = ecparams.getG();
            var Q = G.multiply(k);
            var r = Q.getX().toBigInteger().mod(n);

            if (r.signum() == 0) throw 'Invalid R';

            var s = k.modInverse(n).multiply(e.add(d.multiply(r))).mod(n);

            if (s.signum() == 0) throw 'Invalid S';

            var N_OVER_TWO = n.shiftRight(1)

            // enforce low S values, see bip62: 'low s values in signatures'
            if (s.compareTo(N_OVER_TWO) > 0) {
                s = n.subtract(s);
            }

            return {r : r,  s : s };
        },

        verify: function (hash, sig, pubkey) {
            var r,s;
            if (Bitcoin.Util.isArray(sig)) {
                var obj = ECDSA.parseSig(sig);
                r = obj.r;
                s = obj.s;
            } else if ("object" === typeof sig && sig.r && sig.s) {
                r = sig.r;
                s = sig.s;
            } else {
                throw "Invalid value for signature";
            }

            var Q;
            if (pubkey instanceof ECPointFp) {
                Q = pubkey;
            } else if (Bitcoin.Util.isArray(pubkey)) {
                Q = ECPointFp.decodeFrom(ecparams.getCurve(), pubkey);
            } else {
                throw "Invalid format for pubkey value, must be byte array or ECPointFp";
            }
            var e = BigInteger.fromByteArrayUnsigned(hash);

            return ECDSA.verifyRaw(e, r, s, Q);
        },

        verifyRaw: function (e, r, s, Q) {
            var n = ecparams.getN();
            var G = ecparams.getG();

            if (r.compareTo(BigInteger.ONE) < 0 ||
                r.compareTo(n) >= 0)
                return false;

            if (s.compareTo(BigInteger.ONE) < 0 ||
                s.compareTo(n) >= 0)
                return false;

            var c = s.modInverse(n);

            var u1 = e.multiply(c).mod(n);
            var u2 = r.multiply(c).mod(n);

            // TODO(!!!): For some reason Shamir's trick isn't working with
            // signed message verification!? Probably an implementation
            // error!
            //var point = implShamirsTrick(G, u1, Q, u2);
            var point = G.multiply(u1).add(Q.multiply(u2));

            var v = point.getX().toBigInteger().mod(n);

            return v.equals(r);
        },

        /**
         * Serialize a signature into DER format.
         *
         * Takes two BigIntegers representing r and s and returns a byte array.
         */
        serializeSig: function (r, s) {
            var rBa = r.toByteArraySigned();
            var sBa = s.toByteArraySigned();

            var sequence = [];
            sequence.push(0x02); // INTEGER
            sequence.push(rBa.length);
            sequence = sequence.concat(rBa);

            sequence.push(0x02); // INTEGER
            sequence.push(sBa.length);
            sequence = sequence.concat(sBa);

            sequence.unshift(sequence.length);
            sequence.unshift(0x30); // SEQUENCE

            return sequence;
        },

        /**
         * Parses a byte array containing a DER-encoded signature.
         *
         * This function will return an object of the form:
         *
         * {
         *   r: BigInteger,
         *   s: BigInteger
         * }
         */
        parseSig: function (sig) {
            var cursor;
            if (sig[0] != 0x30)
                throw new Error("Signature not a valid DERSequence");

            cursor = 2;
            if (sig[cursor] != 0x02)
                throw new Error("First element in signature must be a DERInteger");;
            var rBa = sig.slice(cursor+2, cursor+2+sig[cursor+1]);

            cursor += 2+sig[cursor+1];
            if (sig[cursor] != 0x02)
                throw new Error("Second element in signature must be a DERInteger");
            var sBa = sig.slice(cursor+2, cursor+2+sig[cursor+1]);

            cursor += 2+sig[cursor+1];

            //if (cursor != sig.length)
            //  throw new Error("Extra bytes in signature");

            var r = BigInteger.fromByteArrayUnsigned(rBa);
            var s = BigInteger.fromByteArrayUnsigned(sBa);

            return {r: r, s: s};
        },

        parseSigCompact: function (sig) {
            if (sig.length !== 65) {
                throw "Signature has the wrong length";
            }

            // Signature is prefixed with a type byte storing three bits of
            // information.
            var i = sig[0] - 27;
            if (i < 0 || i > 7) {
                throw "Invalid signature type";
            }

            var n = ecparams.getN();
            var r = BigInteger.fromByteArrayUnsigned(sig.slice(1, 33)).mod(n);
            var s = BigInteger.fromByteArrayUnsigned(sig.slice(33, 65)).mod(n);

            return {r: r, s: s, i: i};
        },

        /**
         * Recover a public key from a signature.
         *
         * See SEC 1: Elliptic Curve Cryptography, section 4.1.6, "Public
         * Key Recovery Operation".
         *
         * http://www.secg.org/download/aid-780/sec1-v2.pdf
         */
        recoverPubKey: function (r, s, hash, i) {
            // The recovery parameter i has two bits.
            i = i & 3;

            // The less significant bit specifies whether the y coordinate
            // of the compressed point is even or not.
            var isYEven = i & 1;

            // The more significant bit specifies whether we should use the
            // first or second candidate key.
            var isSecondKey = i >> 1;

            var n = ecparams.getN();
            var G = ecparams.getG();
            var curve = ecparams.getCurve();
            var p = curve.getQ();
            var a = curve.getA().toBigInteger();
            var b = curve.getB().toBigInteger();

            // We precalculate (p + 1) / 4 where p is if the field order
            if (!P_OVER_FOUR) {
                P_OVER_FOUR = p.add(BigInteger.ONE).divide(BigInteger.valueOf(4));
            }

            // 1.1 Compute x
            var x = isSecondKey ? r.add(n) : r;

            // 1.3 Convert x to point
            var alpha = x.multiply(x).multiply(x).add(a.multiply(x)).add(b).mod(p);
            var beta = alpha.modPow(P_OVER_FOUR, p);

            var xorOdd = beta.isEven() ? (i % 2) : ((i+1) % 2);
            // If beta is even, but y isn't or vice versa, then convert it,
            // otherwise we're done and y == beta.
            var y = (beta.isEven() ? !isYEven : isYEven) ? beta : p.subtract(beta);

            // 1.4 Check that nR is at infinity
            var R = new ECPointFp(curve,
                curve.fromBigInteger(x),
                curve.fromBigInteger(y));
            R.validate();

            // 1.5 Compute e from M
            var e = BigInteger.fromByteArrayUnsigned(hash);
            var eNeg = BigInteger.ZERO.subtract(e).mod(n);

            // 1.6 Compute Q = r^-1 (sR - eG)
            var rInv = r.modInverse(n);
            var Q = implShamirsTrick(R, s, G, eNeg).multiply(rInv);

            Q.validate();
            if (!ECDSA.verifyRaw(e, r, s, Q)) {
                throw "Pubkey recovery unsuccessful";
            }

            var pubKey = new Bitcoin.ECKey();
            pubKey.pub = Q;
            return pubKey;
        },

        /**
         * Calculate pubkey extraction parameter.
         *
         * When extracting a pubkey from a signature, we have to
         * distinguish four different cases. Rather than putting this
         * burden on the verifier, Bitcoin includes a 2-bit value with the
         * signature.
         *
         * This function simply tries all four cases and returns the value
         * that resulted in a successful pubkey recovery.
         */
        calcPubkeyRecoveryParam: function (address, r, s, hash)
        {
            for (var i = 0; i < 4; i++) {
                try {
                    var pubkey = Bitcoin.ECDSA.recoverPubKey(r, s, hash, i);

                    if (pubkey.getBitcoinAddress().toString() == address) {
                        return i;
                    }
                } catch (e) {}
            }

            throw "Unable to find valid recovery factor";
        }
    };

    return ECDSA;
})();Bitcoin.ECKey = (function () {
    var ECDSA = Bitcoin.ECDSA;
    var ecparams = secp256k1();
    var rng = new SecureRandom();

    var ECKey = function (input) {
        if (!input) {
            // Generate new key
            var n = ecparams.getN();
            this.priv = ECDSA.getBigRandom(n);
        } else if (input instanceof BigInteger) {
            // Input is a private key value
            this.priv = input;
        } else if (Bitcoin.Util.isArray(input)) {
            // Prepend zero byte to prevent interpretation as negative integer
            this.priv = BigInteger.fromByteArrayUnsigned(input);
        } else if ("string" == typeof input) {
            if (input.length == 51 && input[0] == '5') {
                // Base58 encoded private key
                this.priv = BigInteger.fromByteArrayUnsigned(ECKey.decodeString(input));
            } else {
                // Prepend zero byte to prevent interpretation as negative integer
                this.priv = BigInteger.fromByteArrayUnsigned(Crypto.util.base64ToBytes(input));
            }
        }
        this.compressed = !!ECKey.compressByDefault;
    };

    /**
     * Whether public keys should be returned compressed by default.
     */
    ECKey.compressByDefault = false;

    /**
     * Set whether the public key should be returned compressed or not.
     */
    ECKey.prototype.setCompressed = function (v) {
        this.compressed = !!v;
    };

    ECKey.prototype.isCompressed = function () {
       return this.compressed;
    };

    /**
     * Return public key in DER encoding.
     */
    ECKey.prototype.getPub = function () {
        return this.getPubPoint().getEncoded(this.compressed);
    };

    /**
     * Return public point as ECPoint object.
     */
    ECKey.prototype.getPubPoint = function () {
        if (!this.pub) this.pub = ecparams.getG().multiply(this.priv);

        return this.pub;
    };

    /**
     * Get the pubKeyHash for this key.
     *
     * This is calculated as RIPE160(SHA256([encoded pubkey])) and returned as
     * a byte array.
     */
    ECKey.prototype.getPubKeyHash = function () {
        if (this.pubKeyHash) return this.pubKeyHash;

        return this.pubKeyHash = Bitcoin.Util.sha256ripe160(this.getPub());
    };

    ECKey.prototype.getBitcoinAddress = function () {
        var hash = this.getPubKeyHash();
        return new Bitcoin.Address(hash);
    };


    ECKey.prototype.getPubCompressed = function () {
        if (this.pubCompressed) return this.pubCompressed;
        return this.pubCompressed = this.getPubPoint().getEncoded(1);
    };

    ECKey.prototype.getPubKeyHashCompressed = function () {
        if (this.pubKeyHashCompressed) return this.pubKeyHashCompressed;
        return this.pubKeyHashCompressed = Bitcoin.Util.sha256ripe160(this.getPubCompressed());
    }

    ECKey.prototype.getBitcoinAddressCompressed = function () {
        var hash = this.getPubKeyHashCompressed();
        return new Bitcoin.Address(hash);
    }

    ECKey.prototype.setPub = function (pub) {
        this.pub = ECPointFp.decodeFrom(ecparams.getCurve(), pub);
    };

    ECKey.prototype.toString = function (format) {
        if (format === "base64") {
            return Crypto.util.bytesToBase64(this.priv.toByteArrayUnsigned());
        } else {
            return Crypto.util.bytesToHex(this.priv.toByteArrayUnsigned());
        }
    };

    ECKey.prototype.sign = function (hash) {
        return ECDSA.sign(hash, this.priv);
    };

    ECKey.prototype.verify = function (hash, sig) {
        return ECDSA.verify(hash, sig, this.getPub());
    };


    return ECKey;
})();var Opcode = Bitcoin.Opcode = function (num) {
    this.code = num;
};

Opcode.prototype.toString = function () {
    return Opcode.reverseMap[this.code];
};

Opcode.map = {
    // push value
    OP_0         : 0,
    OP_FALSE     : 0,
    OP_PUSHDATA1 : 76,
    OP_PUSHDATA2 : 77,
    OP_PUSHDATA4 : 78,
    OP_1NEGATE   : 79,
    OP_RESERVED  : 80,
    OP_1         : 81,
    OP_TRUE      : 81,
    OP_2         : 82,
    OP_3         : 83,
    OP_4         : 84,
    OP_5         : 85,
    OP_6         : 86,
    OP_7         : 87,
    OP_8         : 88,
    OP_9         : 89,
    OP_10        : 90,
    OP_11        : 91,
    OP_12        : 92,
    OP_13        : 93,
    OP_14        : 94,
    OP_15        : 95,
    OP_16        : 96,

    // control
    OP_NOP       : 97,
    OP_VER       : 98,
    OP_IF        : 99,
    OP_NOTIF     : 100,
    OP_VERIF     : 101,
    OP_VERNOTIF  : 102,
    OP_ELSE      : 103,
    OP_ENDIF     : 104,
    OP_VERIFY    : 105,
    OP_RETURN    : 106,

    // stack ops
    OP_TOALTSTACK   : 107,
    OP_FROMALTSTACK : 108,
    OP_2DROP        : 109,
    OP_2DUP         : 110,
    OP_3DUP         : 111,
    OP_2OVER        : 112,
    OP_2ROT         : 113,
    OP_2SWAP        : 114,
    OP_IFDUP        : 115,
    OP_DEPTH        : 116,
    OP_DROP         : 117,
    OP_DUP          : 118,
    OP_NIP          : 119,
    OP_OVER         : 120,
    OP_PICK         : 121,
    OP_ROLL         : 122,
    OP_ROT          : 123,
    OP_SWAP         : 124,
    OP_TUCK         : 125,

    // splice ops
    OP_CAT          : 126,
    OP_SUBSTR       : 127,
    OP_LEFT         : 128,
    OP_RIGHT        : 129,
    OP_SIZE         : 130,

    // bit logic
    OP_INVERT       : 131,
    OP_AND          : 132,
    OP_OR           : 133,
    OP_XOR          : 134,
    OP_EQUAL        : 135,
    OP_EQUALVERIFY  : 136,
    OP_RESERVED1    : 137,
    OP_RESERVED2    : 138,

    // numeric
    OP_1ADD         : 139,
    OP_1SUB         : 140,
    OP_2MUL         : 141,
    OP_2DIV         : 142,
    OP_NEGATE       : 143,
    OP_ABS          : 144,
    OP_NOT          : 145,
    OP_0NOTEQUAL    : 146,

    OP_ADD          : 147,
    OP_SUB          : 148,
    OP_MUL          : 149,
    OP_DIV          : 150,
    OP_MOD          : 151,
    OP_LSHIFT       : 152,
    OP_RSHIFT       : 153,

    OP_BOOLAND             : 154,
    OP_BOOLOR              : 155,
    OP_NUMEQUAL            : 156,
    OP_NUMEQUALVERIFY      : 157,
    OP_NUMNOTEQUAL         : 158,
    OP_LESSTHAN            : 159,
    OP_GREATERTHAN         : 160,
    OP_LESSTHANOREQUAL     : 161,
    OP_GREATERTHANOREQUAL  : 162,
    OP_MIN                 : 163,
    OP_MAX                 : 164,

    OP_WITHIN              : 165,

    // crypto
    OP_RIPEMD160           : 166,
    OP_SHA1                : 167,
    OP_SHA256              : 168,
    OP_HASH160             : 169,
    OP_HASH256             : 170,
    OP_CODESEPARATOR       : 171,
    OP_CHECKSIG            : 172,
    OP_CHECKSIGVERIFY      : 173,
    OP_CHECKMULTISIG       : 174,
    OP_CHECKMULTISIGVERIFY : 175,

    // expansion
    OP_NOP1  : 176,
    OP_NOP2  : 177,
    OP_NOP3  : 178,
    OP_NOP4  : 179,
    OP_NOP5  : 180,
    OP_NOP6  : 181,
    OP_NOP7  : 182,
    OP_NOP8  : 183,
    OP_NOP9  : 184,
    OP_NOP10 : 185,

    // template matching params
    OP_PUBKEYHASH    : 253,
    OP_PUBKEY        : 254,
    OP_INVALIDOPCODE : 255
};

Opcode.reverseMap = [];

for (var i in Opcode.map) {
    Opcode.reverseMap[Opcode.map[i]] = i;
}
Bitcoin.ECKey = (function () {
    var ECDSA = Bitcoin.ECDSA;
    var ecparams = secp256k1();
    var rng = new SecureRandom();

    var ECKey = function (input) {
        if (!input) {
            // Generate new key
            var n = ecparams.getN();
            this.priv = ECDSA.getBigRandom(n);
        } else if (input instanceof BigInteger) {
            // Input is a private key value
            this.priv = input;
        } else if (Bitcoin.Util.isArray(input)) {
            // Prepend zero byte to prevent interpretation as negative integer
            this.priv = BigInteger.fromByteArrayUnsigned(input);
        } else if ("string" == typeof input) {
            if (input.length == 51 && input[0] == '5') {
                // Base58 encoded private key
                this.priv = BigInteger.fromByteArrayUnsigned(ECKey.decodeString(input));
            } else {
                // Prepend zero byte to prevent interpretation as negative integer
                this.priv = BigInteger.fromByteArrayUnsigned(Crypto.util.base64ToBytes(input));
            }
        }
        this.compressed = !!ECKey.compressByDefault;
    };

    /**
     * Whether public keys should be returned compressed by default.
     */
    ECKey.compressByDefault = false;

    /**
     * Set whether the public key should be returned compressed or not.
     */
    ECKey.prototype.setCompressed = function (v) {
        this.compressed = !!v;
    };

    ECKey.prototype.isCompressed = function () {
       return this.compressed;
    };

    /**
     * Return public key in DER encoding.
     */
    ECKey.prototype.getPub = function () {
        return this.getPubPoint().getEncoded(this.compressed);
    };

    /**
     * Return public point as ECPoint object.
     */
    ECKey.prototype.getPubPoint = function () {
        if (!this.pub) this.pub = ecparams.getG().multiply(this.priv);

        return this.pub;
    };

    /**
     * Get the pubKeyHash for this key.
     *
     * This is calculated as RIPE160(SHA256([encoded pubkey])) and returned as
     * a byte array.
     */
    ECKey.prototype.getPubKeyHash = function () {
        if (this.pubKeyHash) return this.pubKeyHash;

        return this.pubKeyHash = Bitcoin.Util.sha256ripe160(this.getPub());
    };

    ECKey.prototype.getBitcoinAddress = function () {
        var hash = this.getPubKeyHash();
        return new Bitcoin.Address(hash);
    };


    ECKey.prototype.getPubCompressed = function () {
        if (this.pubCompressed) return this.pubCompressed;
        return this.pubCompressed = this.getPubPoint().getEncoded(1);
    };

    ECKey.prototype.getPubKeyHashCompressed = function () {
        if (this.pubKeyHashCompressed) return this.pubKeyHashCompressed;
        return this.pubKeyHashCompressed = Bitcoin.Util.sha256ripe160(this.getPubCompressed());
    }

    ECKey.prototype.getBitcoinAddressCompressed = function () {
        var hash = this.getPubKeyHashCompressed();
        return new Bitcoin.Address(hash);
    }

    ECKey.prototype.setPub = function (pub) {
        this.pub = ECPointFp.decodeFrom(ecparams.getCurve(), pub);
    };

    ECKey.prototype.toString = function (format) {
        if (format === "base64") {
            return Crypto.util.bytesToBase64(this.priv.toByteArrayUnsigned());
        } else {
            return Crypto.util.bytesToHex(this.priv.toByteArrayUnsigned());
        }
    };

    ECKey.prototype.sign = function (hash) {
        return ECDSA.sign(hash, this.priv);
    };

    ECKey.prototype.verify = function (hash, sig) {
        return ECDSA.verify(hash, sig, this.getPub());
    };


    return ECKey;
})();var Script = Bitcoin.Script = function (data) {
    if (!data) {
        this.buffer = [];
    } else if ("string" == typeof data) {
        this.buffer = Crypto.util.base64ToBytes(data);
    } else if (Bitcoin.Util.isArray(data)) {
        this.buffer = data;
    } else if (data.buffer) {
        this.buffer = data.buffer;
    } else {
        throw new Error("Invalid script");
    }

    this.parse();
};

/**
 * Update the parsed script representation.
 *
 * Each Script object stores the script in two formats. First as a raw byte
 * array and second as an array of "chunks", such as opcodes and pieces of
 * data.
 *
 * This method updates the chunks cache. Normally this is called by the
 * constructor and you don't need to worry about it. However, if you change
 * the script buffer manually, you should update the chunks using this method.
 */
Script.prototype.parse = function () {
    var self = this;

    this.chunks = [];

    // Cursor
    var i = 0;

    // Read n bytes and store result as a chunk
    function readChunk(n) {
        self.chunks.push(self.buffer.slice(i, i + n));
        i += n;
    };

    while (i < this.buffer.length) {
        var opcode = this.buffer[i++];
        if (opcode >= 0xF0) {
            // Two byte opcode
            opcode = (opcode << 8) | this.buffer[i++];
        }

        var len;
        if (opcode > 0 && opcode < Opcode.map.OP_PUSHDATA1) {
            // Read some bytes of data, opcode value is the length of data
            readChunk(opcode);
        } else if (opcode == Opcode.map.OP_PUSHDATA1) {
            len = this.buffer[i++];
            readChunk(len);
        } else if (opcode == Opcode.map.OP_PUSHDATA2) {
            len = (this.buffer[i++] << 8) | this.buffer[i++];
            readChunk(len);
        } else if (opcode == Opcode.map.OP_PUSHDATA4) {
            len = (this.buffer[i++] << 24) |
                (this.buffer[i++] << 16) |
                (this.buffer[i++] << 8) |
                this.buffer[i++];
            readChunk(len);
        } else {
            this.chunks.push(opcode);
        }
    }
};

/**
 * Compare the script to known templates of scriptPubKey.
 *
 * This method will compare the script to a small number of standard script
 * templates and return a string naming the detected type.
 *
 * Currently supported are:
 * Address:
 *   Paying to a Bitcoin address which is the hash of a pubkey.
 *   OP_DUP OP_HASH160 [pubKeyHash] OP_EQUALVERIFY OP_CHECKSIG
 *
 * Pubkey:
 *   Paying to a public key directly.
 *   [pubKey] OP_CHECKSIG
 *
 * Strange:
 *   Any other script (no template matched).
 */
Script.prototype.getOutType = function () {

    if (this.chunks.length == 5 &&
        this.chunks[0] == Opcode.map.OP_DUP &&
        this.chunks[1] == Opcode.map.OP_HASH160 &&
        this.chunks[3] == Opcode.map.OP_EQUALVERIFY &&
        this.chunks[4] == Opcode.map.OP_CHECKSIG) {
        // Transfer to Bitcoin address
        return 'Address';
    } else if (this.chunks.length == 2 && this.chunks[1] == Opcode.map.OP_CHECKSIG) {
        // Transfer to IP address
        return 'Pubkey';
    } else if (this.chunks.length == 3 && this.chunks[0] == Opcode.map.OP_HASH160 && this.chunks[2] == Opcode.map.OP_EQUAL) {
        // Transfer to pay-to-scripthash
        return 'P2SH';
    } else if (this.chunks[this.chunks.length-1] == Opcode.map.OP_CHECKMULTISIG && this.chunks[this.chunks.length-2] <= 3) {
        // Transfer to M-OF-N
        return 'Multisig';
    } else {
        return 'Strange';
    }
}

/**
 * Returns the affected address hash for this output.
 *
 * For standard transactions, this will return the hash of the pubKey that
 * can spend this output.
 *
 * In the future, for payToScriptHash outputs, this will return the
 * scriptHash. Note that non-standard and standard payToScriptHash transactions
 * look the same
 *
 * This method is useful for indexing transactions.
 */
Script.prototype.simpleOutHash = function ()
{
    switch (this.getOutType()) {
        case 'Address':
            return this.chunks[2];
        case 'Pubkey':
            return Bitcoin.Util.sha256ripe160(this.chunks[0]);
        case 'P2SH':
            return this.chunks[1];
        default:
            throw new Error("Encountered non-standard scriptPubKey " + this.getOutType() + ' Hex: ' + Bitcoin.Util.bytesToHex(this.buffer));
    }
};

/**
 * Old name for Script#simpleOutHash.
 *
 * @deprecated
 */
Script.prototype.simpleOutPubKeyHash = Script.prototype.simpleOutHash;

/**
 * Compare the script to known templates of scriptSig.
 *
 * This method will compare the script to a small number of standard script
 * templates and return a string naming the detected type.
 *
 * WARNING: Use this method with caution. It merely represents a heuristic
 * based on common transaction formats. A non-standard transaction could
 * very easily match one of these templates by accident.
 *
 * Currently supported are:
 * Address:
 *   Paying to a Bitcoin address which is the hash of a pubkey.
 *   [sig] [pubKey]
 *
 * Pubkey:
 *   Paying to a public key directly.
 *   [sig]
 *
 * Strange:
 *   Any other script (no template matched).
 */
Script.prototype.getInType = function ()
{
    if (this.chunks.length == 1 &&
        Bitcoin.Util.isArray(this.chunks[0])) {
        // Direct IP to IP transactions only have the signature in their scriptSig.
        // TODO: We could also check that the length of the data is correct.
        return 'Pubkey';
    } else if (this.chunks.length == 2 &&
        Bitcoin.Util.isArray(this.chunks[0]) &&
        Bitcoin.Util.isArray(this.chunks[1])) {
        return 'Address';
    } else {
        return 'Strange';
    }
};

/**
 * Returns the affected public key for this input.
 *
 * This currently only works with payToPubKeyHash transactions. It will also
 * work in the future for standard payToScriptHash transactions that use a
 * single public key.
 *
 * However for multi-key and other complex transactions, this will only return
 * one of the keys or raise an error. Therefore, it is recommended for indexing
 * purposes to use Script#simpleInHash or Script#simpleOutHash instead.
 *
 * @deprecated
 */
Script.prototype.simpleInPubKey = function ()
{
    switch (this.getInType()) {
        case 'Address':
            return this.chunks[1];
        case 'Pubkey':
            // TODO: Theoretically, we could recover the pubkey from the sig here.
            //       See https://bitcointalk.org/?topic=6430.0
            throw new Error("Script does not contain pubkey.");
        default:
            throw new Error("Encountered non-standard scriptSig");
    }
};

/**
 * Returns the affected address hash for this input.
 *
 * For standard transactions, this will return the hash of the pubKey that
 * can spend this output.
 *
 * In the future, for standard payToScriptHash inputs, this will return the
 * scriptHash.
 *
 * Note: This function provided for convenience. If you have the corresponding
 * scriptPubKey available, you are urged to use Script#simpleOutHash instead
 * as it is more reliable for non-standard payToScriptHash transactions.
 *
 * This method is useful for indexing transactions.
 */
Script.prototype.simpleInHash = function ()
{
    return Bitcoin.Util.sha256ripe160(this.simpleInPubKey());
};

/**
 * Old name for Script#simpleInHash.
 *
 * @deprecated
 */
Script.prototype.simpleInPubKeyHash = Script.prototype.simpleInHash;

/**
 * Add an op code to the script.
 */
Script.prototype.writeOp = function (opcode)
{
    this.buffer.push(opcode);
    this.chunks.push(opcode);
};

/**
 * Add a data chunk to the script.
 */
Script.prototype.writeBytes = function (data)
{
    if (data.length < Opcode.map.OP_PUSHDATA1) {
        this.buffer.push(data.length);
    } else if (data.length <= 0xff) {
        this.buffer.push(Opcode.map.OP_PUSHDATA1);
        this.buffer.push(data.length);
    } else if (data.length <= 0xffff) {
        this.buffer.push(Opcode.map.OP_PUSHDATA2);
        this.buffer.push(data.length & 0xff);
        this.buffer.push((data.length >>> 8) & 0xff);
    } else {
        this.buffer.push(Opcode.map.OP_PUSHDATA4);
        this.buffer.push(data.length & 0xff);
        this.buffer.push((data.length >>> 8) & 0xff);
        this.buffer.push((data.length >>> 16) & 0xff);
        this.buffer.push((data.length >>> 24) & 0xff);
    }
    this.buffer = this.buffer.concat(data);
    this.chunks.push(data);
};

/**
 * Create a standard payToPubKeyHash output.
 */
Script.createOutputScript = function (address)
{
    var script = new Script();
    if (address.version == Bitcoin.Address.pubKeyHashVersion) {
        script.writeOp(Opcode.map.OP_DUP);
        script.writeOp(Opcode.map.OP_HASH160);
        script.writeBytes(address.hash);
        script.writeOp(Opcode.map.OP_EQUALVERIFY);
        script.writeOp(Opcode.map.OP_CHECKSIG);
        return script;
    } else if (address.version == Bitcoin.Address.p2shVersion) {
        script.writeOp(Opcode.map.OP_HASH160);
        script.writeBytes(address.hash);
        script.writeOp(Opcode.map.OP_EQUAL);
        return script;
    } else {
        throw "Unknown address version";
    }
};

/**
 * Extract bitcoin addresses from an output script
 */
Script.prototype.extractAddresses = function (addresses)
{
    switch (this.getOutType()) {
        case 'Address':
            addresses.push(new Bitcoin.Address(this.chunks[2]));
            return 1;
        case 'Pubkey':
            addresses.push(new Bitcoin.Address(Bitcoin.Util.sha256ripe160(this.chunks[0])));
            return 1;
        case 'P2SH':
            addresses.push(new Bitcoin.Address(this.chunks[1], Bitcoin.Address.p2shVersion));
            return 1;
        case 'Multisig':
            for (var i = 1; i < this.chunks.length-2; ++i) {
                addresses.push(new Bitcoin.Address(Bitcoin.Util.sha256ripe160(this.chunks[i])));
            }
            return this.chunks[0] - Opcode.map.OP_1 + 1;
        default:
            throw new Error('ExtractAddresses Encountered non-standard scriptPubKey ' + this.getOutType()+ ' Hex: ' + Bitcoin.Util.bytesToHex(this.serialize()));
    }
};

/**
 * Create an m-of-n output script
 */
Script.createMultiSigOutputScript = function (m, pubkeys)
{
    var script = new Bitcoin.Script();

    script.writeOp(Opcode.map.OP_1 + m - 1);

    for (var i = 0; i < pubkeys.length; ++i) {
        script.writeBytes(pubkeys[i]);
    }

    script.writeOp(Opcode.map.OP_1 + pubkeys.length - 1);

    script.writeOp(Opcode.map.OP_CHECKMULTISIG);

    return script;
};

/**
 * Create an m-of-n output script
 */
Script.createPubKeyScript = function (pubkey_bytes)
{
    var script = new Bitcoin.Script();

    script.writeBytes(pubkey_bytes);

    script.writeOp(Opcode.map.OP_CHECKSIG);

    return script;
};

/**
 * Create a standard payToPubKeyHash input.
 */
Script.createInputScript = function (signature, pubKey)
{

    var script = new Script();

    script.writeBytes(signature);
    script.writeBytes(pubKey);

    return script;
};

Script.prototype.clone = function ()
{
    return new Script(this.buffer);
};
var OP_CODESEPARATOR = 171;

var SIGHASH_ALL = 1;
var SIGHASH_NONE = 2;
var SIGHASH_SINGLE = 3;
var SIGHASH_ANYONECANPAY = 80;

(function() {
    var Script = Bitcoin.Script;

    var Transaction = Bitcoin.Transaction = function (doc) {
        this.version = 1;
        this.lock_time = 0;
        this.ins = [];
        this.outs = [];
        this.timestamp = null;
        this.block = null;

        if (doc) {
            if (doc.hash) this.hash = doc.hash;
            if (doc.version) this.version = doc.version;
            if (doc.lock_time) this.lock_time = doc.lock_time;
            if (doc.ins && doc.ins.length) {
                for (var i = 0; i < doc.ins.length; i++) {
                    this.addInput(new TransactionIn(doc.ins[i]));
                }
            }
            if (doc.outs && doc.outs.length) {
                for (var i = 0; i < doc.outs.length; i++) {
                    this.addOutput(new TransactionOut(doc.outs[i]));
                }
            }
            if (doc.timestamp) this.timestamp = doc.timestamp;
            if (doc.block) this.block = doc.block;
        }
    };

    /**
     * Turn transaction data into Transaction objects.
     *
     * Takes an array of plain JavaScript objects containing transaction data and
     * returns an array of Transaction objects.
     */
    Transaction.objectify = function (txs) {
        var objs = [];
        for (var i = 0; i < txs.length; i++) {
            objs.push(new Transaction(txs[i]));
        }
        return objs;
    };

    /**
     * Create a new txin.
     *
     * Can be called with an existing TransactionIn object to add it to the
     * transaction. Or it can be called with a Transaction object and an integer
     * output index, in which case a new TransactionIn object pointing to the
     * referenced output will be created.
     *
     * Note that this method does not sign the created input.
     */
    Transaction.prototype.addInput = function (tx, outIndex) {
        if (arguments[0] instanceof TransactionIn) {
            this.ins.push(arguments[0]);
        } else {
            this.ins.push(new TransactionIn({
                outpoint: {
                    hash: tx.hash,
                    index: outIndex
                },
                script: new Bitcoin.Script(),
                sequence: 4294967295
            }));
        }
    };

    /**
     * Create a new txout.
     *
     * Can be called with an existing TransactionOut object to add it to the
     * transaction. Or it can be called with an Address object and a BigInteger
     * for the amount, in which case a new TransactionOut object with those
     * values will be created.
     */
    Transaction.prototype.addOutput = function (address, value) {
        if (arguments[0] instanceof TransactionOut) {
            this.outs.push(arguments[0]);
        } else {
            if (value instanceof BigInteger) {
                value = value.toByteArrayUnsigned().reverse();
                while (value.length < 8) value.push(0);
            } else if (Bitcoin.Util.isArray(value)) {
                // Nothing to do
            }

            this.outs.push(new TransactionOut({
                value: value,
                script: Script.createOutputScript(address)
            }));
        }
    };

    /**
     * Serialize this transaction.
     *
     * Returns the transaction as a byte array in the standard Bitcoin binary
     * format. This method is byte-perfect, i.e. the resulting byte array can
     * be hashed to get the transaction's standard Bitcoin hash.
     */
    Transaction.prototype.serialize = function ()
    {
        var buffer = [];
        buffer = buffer.concat(Crypto.util.wordsToBytes([parseInt(this.version)]).reverse());
        buffer = buffer.concat(Bitcoin.Util.numToVarInt(this.ins.length));
        for (var i = 0; i < this.ins.length; i++) {
            var txin = this.ins[i];
            buffer = buffer.concat(Crypto.util.base64ToBytes(txin.outpoint.hash));
            buffer = buffer.concat(Crypto.util.wordsToBytes([parseInt(txin.outpoint.index)]).reverse());
            var scriptBytes = txin.script.buffer;
            buffer = buffer.concat(Bitcoin.Util.numToVarInt(scriptBytes.length));
            buffer = buffer.concat(scriptBytes);
            buffer = buffer.concat(Crypto.util.wordsToBytes([parseInt(txin.sequence)]).reverse());
        }
        buffer = buffer.concat(Bitcoin.Util.numToVarInt(this.outs.length));
        for (var i = 0; i < this.outs.length; i++) {
            var txout = this.outs[i];
            buffer = buffer.concat(txout.value);
            var scriptBytes = txout.script.buffer;
            buffer = buffer.concat(Bitcoin.Util.numToVarInt(scriptBytes.length));
            buffer = buffer.concat(scriptBytes);
        }
        buffer = buffer.concat(Crypto.util.wordsToBytes([parseInt(this.lock_time)]).reverse());

        return buffer;
    };

    /**
     * Hash transaction for signing a specific input.
     *
     * Bitcoin uses a different hash for each signed transaction input. This
     * method copies the transaction, makes the necessary changes based on the
     * hashType, serializes and finally hashes the result. This hash can then be
     * used to sign the transaction input in question.
     */
    Transaction.prototype.hashTransactionForSignature =
        function (connectedScript, inIndex, hashType)
        {
            var txTmp = this.clone();

            // In case concatenating two scripts ends up with two codeseparators,
            // or an extra one at the end, this prevents all those possible
            // incompatibilities.
            /*scriptCode = scriptCode.filter(function (val) {
             return val !== OP_CODESEPARATOR;
             });*/

            // Blank out other inputs' signatures
            for (var i = 0; i < txTmp.ins.length; i++) {
                txTmp.ins[i].script = new Script();
            }

            txTmp.ins[inIndex].script = connectedScript;

            // Blank out some of the outputs
            if ((hashType & 0x1f) == SIGHASH_NONE) {
                txTmp.outs = [];

                // Let the others update at will
                for (var i = 0; i < txTmp.ins.length; i++)
                    if (i != inIndex)
                        txTmp.ins[i].sequence = 0;
            } else if ((hashType & 0x1f) == SIGHASH_SINGLE) {
                // TODO: Implement
            }

            // Blank out other inputs completely, not recommended for open transactions
            if (hashType & SIGHASH_ANYONECANPAY) {
                txTmp.ins = [txTmp.ins[inIndex]];
            }

            var buffer = txTmp.serialize();

            buffer = buffer.concat(Crypto.util.wordsToBytes([parseInt(hashType)]).reverse());

            var hash1 = Crypto.SHA256(buffer, {asBytes: true});

            return Crypto.SHA256(hash1, {asBytes: true});
        };

    /**
     * Calculate and return the transaction's hash.
     */
    Transaction.prototype.getHash = function ()
    {
        var buffer = this.serialize();
        return Crypto.SHA256(Crypto.SHA256(buffer, {asBytes: true}), {asBytes: true});
    };

    /**
     * Create a copy of this transaction object.
     */
    Transaction.prototype.clone = function ()
    {
        var newTx = new Transaction();
        newTx.version = this.version;
        newTx.lock_time = this.lock_time;
        for (var i = 0; i < this.ins.length; i++) {
            var txin = this.ins[i].clone();
            newTx.addInput(txin);
        }
        for (var i = 0; i < this.outs.length; i++) {
            var txout = this.outs[i].clone();
            newTx.addOutput(txout);
        }
        return newTx;
    };

    Transaction.prototype.addOutputScript = function (script, value) {
        if (arguments[0] instanceof TransactionOut) {
            this.outs.push(arguments[0]);
        } else {
            if (value instanceof BigInteger) {
                value = value.toByteArrayUnsigned().reverse();
                while (value.length < 8) value.push(0);
            } else if (Bitcoin.Util.isArray(value)) {
                // Nothing to do
            }

            this.outs.push(new TransactionOut({
                value: value,
                script: script
            }));
        }
    };

    /**
     * Analyze how this transaction affects a wallet.
     *
     * Returns an object with properties 'impact', 'type' and 'addr'.
     *
     * 'impact' is an object, see Transaction#calcImpact.
     *
     * 'type' can be one of the following:
     *
     * recv:
     *   This is an incoming transaction, the wallet received money.
     *   'addr' contains the first address in the wallet that receives money
     *   from this transaction.
     *
     * self:
     *   This is an internal transaction, money was sent within the wallet.
     *   'addr' is undefined.
     *
     * sent:
     *   This is an outgoing transaction, money was sent out from the wallet.
     *   'addr' contains the first external address, i.e. the recipient.
     *
     * other:
     *   This method was unable to detect what the transaction does. Either it
     */
    Transaction.prototype.analyze = function (wallet) {
        if (!(wallet instanceof Bitcoin.Wallet)) return null;

        var allFromMe = true,
            allToMe = true,
            firstRecvHash = null,
            firstMeRecvHash = null,
            firstSendHash = null;

        for (var i = this.outs.length-1; i >= 0; i--) {
            var txout = this.outs[i];
            var hash = txout.script.simpleOutPubKeyHash();
            if (!wallet.hasHash(hash)) {
                allToMe = false;
            } else {
                firstMeRecvHash = hash;
            }
            firstRecvHash = hash;
        }
        for (var i = this.ins.length-1; i >= 0; i--) {
            var txin = this.ins[i];
            firstSendHash = txin.script.simpleInPubKeyHash();
            if (!wallet.hasHash(firstSendHash)) {
                allFromMe = false;
                break;
            }
        }

        var impact = this.calcImpact(wallet);

        var analysis = {};

        analysis.impact = impact;

        if (impact.sign > 0 && impact.value.compareTo(BigInteger.ZERO) > 0) {
            analysis.type = 'recv';
            analysis.addr = new Bitcoin.Address(firstMeRecvHash);
        } else if (allFromMe && allToMe) {
            analysis.type = 'self';
        } else if (allFromMe) {
            analysis.type = 'sent';
            // TODO: Right now, firstRecvHash is the first output, which - if the
            //       transaction was not generated by this library could be the
            //       change address.
            analysis.addr = new Bitcoin.Address(firstRecvHash);
        } else  {
            analysis.type = "other";
        }

        return analysis;
    };

    /**
     * Get a human-readable version of the data returned by Transaction#analyze.
     *
     * This is merely a convenience function. Clients should consider implementing
     * this themselves based on their UI, I18N, etc.
     */
    Transaction.prototype.getDescription = function (wallet) {
        var analysis = this.analyze(wallet);

        if (!analysis) return "";

        switch (analysis.type) {
            case 'recv':
                return "Received with "+analysis.addr;
                break;

            case 'sent':
                return "Payment to "+analysis.addr;
                break;

            case 'self':
                return "Payment to yourself";
                break;

            case 'other':
            default:
                return "";
        }
    };

    /**
     * Get the total amount of a transaction's outputs.
     */
    Transaction.prototype.getTotalOutValue = function () {
        var totalValue = BigInteger.ZERO;
        for (var j = 0; j < this.outs.length; j++) {
            var txout = this.outs[j];
            totalValue = totalValue.add(Bitcoin.Util.valueToBigInt(txout.value));
        }
        return totalValue;
    };

    /**
     * Old name for Transaction#getTotalOutValue.
     *
     * @deprecated
     */
    Transaction.prototype.getTotalValue = Transaction.prototype.getTotalOutValue;

    /**
     * Calculates the impact a transaction has on this wallet.
     *
     * Based on the its public keys, the wallet will calculate the
     * credit or debit of this transaction.
     *
     * It will return an object with two properties:
     *  - sign: 1 or -1 depending on sign of the calculated impact.
     *  - value: amount of calculated impact
     *
     * @returns Object Impact on wallet
     */
    Transaction.prototype.calcImpact = function (wallet) {
        if (!(wallet instanceof Bitcoin.Wallet)) return BigInteger.ZERO;

        // Calculate credit to us from all outputs
        var valueOut = BigInteger.ZERO;
        for (var j = 0; j < this.outs.length; j++) {
            var txout = this.outs[j];
            var hash = Crypto.util.bytesToBase64(txout.script.simpleOutPubKeyHash());
            if (wallet.hasHash(hash)) {
                valueOut = valueOut.add(Bitcoin.Util.valueToBigInt(txout.value));
            }
        }

        // Calculate debit to us from all ins
        var valueIn = BigInteger.ZERO;
        for (var j = 0; j < this.ins.length; j++) {
            var txin = this.ins[j];
            var hash = Crypto.util.bytesToBase64(txin.script.simpleInPubKeyHash());
            if (wallet.hasHash(hash)) {
                var fromTx = wallet.txIndex[txin.outpoint.hash];
                if (fromTx) {
                    valueIn = valueIn.add(Bitcoin.Util.valueToBigInt(fromTx.outs[txin.outpoint.index].value));
                }
            }
        }
        if (valueOut.compareTo(valueIn) >= 0) {
            return {
                sign: 1,
                value: valueOut.subtract(valueIn)
            };
        } else {
            return {
                sign: -1,
                value: valueIn.subtract(valueOut)
            };
        }
    };

    var TransactionIn = Bitcoin.TransactionIn = function (data)
    {
        this.outpoint = data.outpoint;
        if (data.script instanceof Script) {
            this.script = data.script;
        } else {
            this.script = new Script(data.script);
        }
        this.sequence = data.sequence;
    };

    TransactionIn.prototype.clone = function ()
    {
        var newTxin = new TransactionIn({
            outpoint: {
                hash: this.outpoint.hash,
                index: this.outpoint.index
            },
            script: this.script.clone(),
            sequence: this.sequence
        });
        return newTxin;
    };

    var TransactionOut = Bitcoin.TransactionOut = function (data)
    {
        if (data.script instanceof Script) {
            this.script = data.script;
        } else {
            this.script = new Script(data.script);
        }

        if (Bitcoin.Util.isArray(data.value)) {
            this.value = data.value;
        } else if ("string" == typeof data.value) {
            var valueHex = (new BigInteger(data.value, 10)).toString(16);
            while (valueHex.length < 16) valueHex = "0" + valueHex;
            this.value = Crypto.util.hexToBytes(valueHex);
        }
    };

    TransactionOut.prototype.clone = function ()
    {
        var newTxout = new TransactionOut({
            script: this.script.clone(),
            value: this.value.slice(0)
        });
        return newTxout;
    };
})();

/**
 * Implements Bitcoin's feature for signing arbitrary messages.
 */
Bitcoin.Message = (function () {
    var Message = {};

    Message.magicPrefix = "Bitcoin Signed Message:\n";

    Message.makeMagicMessage = function (message) {
        var magicBytes = Crypto.charenc.UTF8.stringToBytes(Message.magicPrefix);
        var messageBytes = Crypto.charenc.UTF8.stringToBytes(message);

        var buffer = [];
        buffer = buffer.concat(Bitcoin.Util.numToVarInt(magicBytes.length));
        buffer = buffer.concat(magicBytes);
        buffer = buffer.concat(Bitcoin.Util.numToVarInt(messageBytes.length));
        buffer = buffer.concat(messageBytes);


        return buffer;
    };

    Message.getHash = function (message) {
        var buffer = Message.makeMagicMessage(message);
        return Crypto.SHA256(Crypto.SHA256(buffer, {asBytes: true}), {asBytes: true});
    };

    Message.signMessage = function (key, message, target_address) {
        var hash = Message.getHash(message);

        var obj = key.sign(hash);

        //var sig = Bitcoin.ECDSA.serializeSig(obj.r, obj.s);

        var address = key.getBitcoinAddress().toString();

        var compressed = !(address == target_address);

        var i = Bitcoin.ECDSA.calcPubkeyRecoveryParam(address, obj.r, obj.s, hash);

        i += 27;
        if (compressed) i += 4;

        var rBa = obj.r.toByteArrayUnsigned();
        var sBa = obj.s.toByteArrayUnsigned();

        // Pad to 32 bytes per value
        while (rBa.length < 32) rBa.unshift(0);
        while (sBa.length < 32) sBa.unshift(0);

        var sig = [i].concat(rBa).concat(sBa);

        return Crypto.util.bytesToBase64(sig);
    };

    Message.verifyMessage = function (address, sig, message) {
        sig = Crypto.util.base64ToBytes(sig);

        sig = Bitcoin.ECDSA.parseSigCompact(sig);

        var hash = Message.getHash(message);

        var isCompressed = !!(sig.i & 4);

        var pubKey = Bitcoin.ECDSA.recoverPubKey(sig.r, sig.s, hash, sig.i);

        pubKey.setCompressed(isCompressed);

        if (pubKey.getBitcoinAddress().toString() == address || pubKey.getBitcoinAddressCompressed().toString() == address)
            return true;
        else
            return false;
    };


    return Message;
})();
