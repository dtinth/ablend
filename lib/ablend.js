

function checkImageData(x, name) {
  if (!x.width || !x.height || !x.data || !x.data.length) throw new Error(name + ' data doesn\'t look like an image data.');
}

// v*a + ba*(1-a) = va --(1)
// v*a + bb*(1-a) = vb --(2)
// (1)+(2);
//   2*v*a + (ba+bb)*(1-a) = va + vb
//                   2*v*a = va + vb - (ba+bb)*(1-a)
//                       v = (va + vb - (ba+bb)*(1-a))/(2 * a)

function alpha(va, vb, ba, bb) {
  // (1)-(2);
  //         (ba-bb)*(1-a) = va - vb
  //                 1 - a = (va-vb)/(ba-bb)
  //   1 - (va-vb)/(ba-bb) = a
  if (ba - bb == 0) return 1;
  return 1 - (va - vb) / (ba - bb);
}

function blend(va, vb, ba, bb, a) {
  if (a <= 0) return 0;
  return (va + vb - (ba + bb) * (1 - a)) / (2 * a);
}

function normalize(value) {
  if (value > 255) return 255;
  if (value < 0) return 0;
  return Math.round(value);
}

function value(color) {
  return color.r + color.g + color.b;
}

var channels = ['r', 'g', 'b', 'a'];

function cblend(ca, cb, ba, bb, o) {
  var al = alpha(value(ca), value(cb), value(ba), value(bb));
  o.a = normalize(al * (ca.a + cb.a) / 2);
  for (var i = 0; i < 3; i ++) {
    o[channels[i]] = normalize(blend(ca[channels[i]], cb[channels[i]], ba[channels[i]], bb[channels[i]], al));
  }
}

var BLACK = { r: 0, g: 0, b: 0, a: 255 };
var WHITE = { r: 255, g: 255, b: 255, a: 255 };

exports.cblend = cblend;
exports.alpha = alpha;
exports.blend = blend;

exports.ablend = function(a, b, o, onprogress) {
  if (typeof onprogress != 'function') onprogress = function(index, max) { };
  checkImageData(a, 'first input');
  checkImageData(b, 'second input');
  checkImageData(o, 'output');
  if (a.width != b.width || a.height != b.height || a.width != o.width || a.height != o.height) {
    throw new Error('image data objects should have the same dimension');
  }
  var l = a.data.length;
  var ca = {}, cb = {}, ba, bb, co = {};
  for (var i = 0; i < l; i += 4) {
    for (var j = 0; j < 4; j ++) {
      ca[channels[j]] = a.data[i + j];
      cb[channels[j]] = b.data[i + j];
    }
    var va = value(ca), vb = value(cb);
    ba = va < vb ? BLACK : WHITE;
    bb = va < vb ? WHITE : BLACK;
    cblend(ca, cb, ba, bb, co);
    for (var j = 0; j < 4; j ++) {
      o.data[i + j] = co[channels[j]];
    }
    onprogress(i, l);
  }
  onprogress(l, l);
  return true;
};

