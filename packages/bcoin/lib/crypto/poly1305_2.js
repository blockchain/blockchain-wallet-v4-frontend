/* poly1305 */

// Written in 2014 by Devi Mandiri. Public domain.
//
// Implementation derived from poly1305-donna-16.h
// See for details: https://github.com/floodyberry/poly1305-donna

var Poly1305BlockSize = 16;

var Poly1305Ctx = function() {
  this.buffer = new Array(Poly1305BlockSize);
  this.leftover = 0;
  this.r = new Array(10);
  this.h = new Array(10);
  this.pad = new Array(8);
  this.finished = 0;
};

function U8TO16(p, pos) {
  return ((p[pos] & 0xff) & 0xffff) | (((p[pos+1] & 0xff) & 0xffff) << 8);
}

function U16TO8(p, pos, v) {
  p[pos]   = (v      ) & 0xff;
  p[pos+1] = (v >>> 8) & 0xff;
}

function poly1305_init(ctx, key) {
  var t = [], i = 0;

  for (i = 8; i--;) t[i] = U8TO16(key, i*2);

  ctx.r[0] =   t[0]                         & 0x1fff;
  ctx.r[1] = ((t[0] >>> 13) | (t[1] <<  3)) & 0x1fff;
  ctx.r[2] = ((t[1] >>> 10) | (t[2] <<  6)) & 0x1f03;
  ctx.r[3] = ((t[2] >>>  7) | (t[3] <<  9)) & 0x1fff;
  ctx.r[4] = ((t[3] >>>  4) | (t[4] << 12)) & 0x00ff;
  ctx.r[5] =  (t[4] >>>  1)                 & 0x1ffe;
  ctx.r[6] = ((t[4] >>> 14) | (t[5] <<  2)) & 0x1fff;
  ctx.r[7] = ((t[5] >>> 11) | (t[6] <<  5)) & 0x1f81;
  ctx.r[8] = ((t[6] >>>  8) | (t[7] <<  8)) & 0x1fff;
  ctx.r[9] =  (t[7] >>>  5)                 & 0x007f;

  for (i = 8; i--;) {
    ctx.h[i]   = 0;
    ctx.pad[i] = U8TO16(key, 16+(2*i));
  }
  ctx.h[8] = 0;
  ctx.h[9] = 0;
  ctx.leftover = 0;
  ctx.finished = 0;
}

function poly1305_blocks(ctx, m, mpos, bytes) {
  console.info('update blocks with bytes: '+bytes + ' ' +m.toString('hex'))

  var hibit = ctx.finished ? 0 : (1 << 11);
  var t = [], d = [], c = 0, i = 0, j = 0;

  while (bytes >= Poly1305BlockSize) {
    for (i = 8; i--;) t[i] = U8TO16(m, i*2+mpos);

    console.info('update blocks t is '+t)

    ctx.h[0] +=   t[0]                         & 0x1fff;
    ctx.h[1] += ((t[0] >>> 13) | (t[1] <<  3)) & 0x1fff;
    ctx.h[2] += ((t[1] >>> 10) | (t[2] <<  6)) & 0x1fff;
    ctx.h[3] += ((t[2] >>>  7) | (t[3] <<  9)) & 0x1fff;
    ctx.h[4] += ((t[3] >>>  4) | (t[4] << 12)) & 0x1fff;
    ctx.h[5] +=  (t[4] >>>  1)                 & 0x1fff;
    ctx.h[6] += ((t[4] >>> 14) | (t[5] <<  2)) & 0x1fff;
    ctx.h[7] += ((t[5] >>> 11) | (t[6] <<  5)) & 0x1fff;
    ctx.h[8] += ((t[6] >>>  8) | (t[7] <<  8)) & 0x1fff;
    ctx.h[9] +=  (t[7] >>>  5)                 | hibit;

    console.info('updated blocks round complete - h: '+ctx.h)

    for (i = 0, c = 0; i < 10; i++) {
      d[i] = c;
      for (j = 0; j < 10; j++) {
        d[i] += (ctx.h[j] & 0xffffffff) * ((j <= i) ? ctx.r[i-j] : (5 * ctx.r[i+10-j]));
        if (j === 4) {
          c = (d[i] >>> 13);
          d[i] &= 0x1fff;
        }
      }
      c += (d[i] >>> 13);
      d[i] &= 0x1fff;
    }
    c = ((c << 2) + c);
    c += d[0];
    d[0] = ((c & 0xffff) & 0x1fff);
    c = (c >>> 13);
    d[1] += c;

    for (i = 10; i--;) ctx.h[i] = d[i] & 0xffff;

    mpos += Poly1305BlockSize;
    bytes -= Poly1305BlockSize;

    console.info('updated blocks round complete - h: '+ctx.h)
  }
}

function poly1305_update(ctx, m, bytes) {

  console.info('updating poly with '+bytes+' - '+m.toString('hex'))

  var want = 0, i = 0, mpos = 0;

  if (ctx.leftover) {
    want = (Poly1305BlockSize - ctx.leftover);
    if (want > bytes)
      want = bytes;
    for (i = want; i--;) {
      ctx.buffer[ctx.leftover+i] = m[i+mpos];
    }
    bytes -= want;
    mpos += want;
    ctx.leftover += want;
    if (ctx.leftover < Poly1305BlockSize)
      return;
    poly1305_blocks(ctx, ctx.buffer, 0, Poly1305BlockSize);
    ctx.leftover = 0;
  }

  if (bytes >= Poly1305BlockSize) {
    want = (bytes & ~(Poly1305BlockSize - 1));
    poly1305_blocks(ctx, m, mpos, want);
    mpos += want;
    bytes -= want;
  }

  if (bytes) {
    for (i = bytes; i--;) {
      ctx.buffer[ctx.leftover+i] = m[i+mpos];
    }
    ctx.leftover += bytes;
  }
  console.info('updated: '+ctx.h)
}

function poly1305_finish(ctx, mac) {
  var g = [], c = 0, mask = 0, f = 0, i = 0;

  if (ctx.leftover) {
    i = ctx.leftover;
    ctx.buffer[i++] = 1;
    for (; i < Poly1305BlockSize; i++) {
      ctx.buffer[i] = 0;
    }
    ctx.finished = 1;
    poly1305_blocks(ctx, ctx.buffer, 0, Poly1305BlockSize);
  }

  c = ctx.h[1] >>> 13;
  ctx.h[1] &= 0x1fff;
  for (i = 2; i < 10; i++) {
    ctx.h[i] += c;
    c = ctx.h[i] >>> 13;
    ctx.h[i] &= 0x1fff;
  }
  ctx.h[0] += (c * 5);
  c = ctx.h[0] >>> 13;
  ctx.h[0] &= 0x1fff;
  ctx.h[1] += c;
  c = ctx.h[1] >>> 13;
  ctx.h[1] &= 0x1fff;
  ctx.h[2] += c;

  g[0] = ctx.h[0] + 5;
  c = g[0] >>> 13;
  g[0] &= 0x1fff;
  for (i = 1; i < 10; i++) {
    g[i] = ctx.h[i] + c;
    c = g[i] >>> 13;
    g[i] &= 0x1fff;
  }
  g[9] -= (1 << 13);
  g[9] &= 0xffff;

  mask = (g[9] >>> 15) - 1;
  for (i = 10; i--;) g[i] &= mask;
  mask = ~mask;
  for (i = 10; i--;) {
    ctx.h[i] = (ctx.h[i] & mask) | g[i];
  }

  ctx.h[0] = ((ctx.h[0]      ) | (ctx.h[1] << 13)) & 0xffff;
  ctx.h[1] = ((ctx.h[1] >>  3) | (ctx.h[2] << 10)) & 0xffff;
  ctx.h[2] = ((ctx.h[2] >>  6) | (ctx.h[3] <<  7)) & 0xffff;
  ctx.h[3] = ((ctx.h[3] >>  9) | (ctx.h[4] <<  4)) & 0xffff;
  ctx.h[4] = ((ctx.h[4] >> 12) | (ctx.h[5] <<  1) | (ctx.h[6] << 14)) & 0xffff;
  ctx.h[5] = ((ctx.h[6] >>  2) | (ctx.h[7] << 11)) & 0xffff;
  ctx.h[6] = ((ctx.h[7] >>  5) | (ctx.h[8] <<  8)) & 0xffff;
  ctx.h[7] = ((ctx.h[8] >>  8) | (ctx.h[9] <<  5)) & 0xffff;

  f = (ctx.h[0] & 0xffffffff) + ctx.pad[0];
  ctx.h[0] = f & 0xffff;
  for (i = 1; i < 8; i++) {
    f = (ctx.h[i] & 0xffffffff) + ctx.pad[i] + (f >>> 16);
    ctx.h[i] = f & 0xffff;
  }

  for (i = 8; i--;) {
    U16TO8(mac, i*2, ctx.h[i]);
    ctx.pad[i] = 0;
  }
  for (i = 10; i--;) {
    ctx.h[i] = 0;
    ctx.r[i] = 0;
  }
}

function poly1305_auth(mac, m, bytes, key) {
  var ctx = new Poly1305Ctx();
  poly1305_init(ctx, key);
  poly1305_update(ctx, m, bytes);
  poly1305_finish(ctx, mac);
}

function poly1305_verify(mac1, mac2) {
  var dif = 0;
  for (var i = 0; i < 16; i++) {
    dif |= (mac1[i] ^ mac2[i]);
  }
  dif = (dif - 1) >>> 31;
  return (dif & 1);
}

//--------------------------- test -----------------------------//
function fromHex(h) {
  var out = [], len = h.length, w = '';
  for (var i = 0; i < len; i += 2) {
    w = h[i];
    if (((i+1) >= len) || typeof h[i+1] === 'undefined') {
      w += '0';
    } else {
      w += h[i+1];
    }
    out.push(parseInt(w, 16));
  }
  return out;
}

// testVectors from http://tools.ietf.org/html/draft-agl-tls-chacha20poly1305-04#page-11
var testVectors = [
  {
    input: fromHex('0000000000000000000000000000000000000000000000000000000000000000'),
    key:   fromHex('746869732069732033322d62797465206b657920666f7220506f6c7931333035'),
    tag:   fromHex('49ec78090e481ec6c26b33b91ccc0307'),
  },
  {
    input: fromHex('48656c6c6f20776f726c6421'),
    key:   fromHex('746869732069732033322d62797465206b657920666f7220506f6c7931333035'),
    tag:   fromHex('a6f745008f81c916a20dcc74eef2b2f0'),
  }
];

var mac = [];
for (var i = 0; i < testVectors.length; i++) {
  poly1305_auth(mac, testVectors[i].input, testVectors[i].input.length, testVectors[i].key);
  console.log(poly1305_verify(testVectors[i].tag, mac));
}

exports.update = poly1305_update;
exports.init = Poly1305Ctx;
exports.finish = poly1305_finish;

