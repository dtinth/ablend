

function checkImageData(x, name) {
  if (!x.width || !x.height || !x.data || !x.data.length) throw new Error(name + ' data doesn\'t look like an image data.');
}

// v*a + 0*(1-a) = v1 --(1)
// v*a + M*(1-a) = v2 --(2)

function alpha(va, vb, max) {
  // (1)-(2);  v1-v2 = -M + Ma
  // (v1-v2+M)/M = a
  var v1 = va < vb ? va : vb;
  var v2 = va > vb ? va : vb;
  return (v1 - v2 + max) / max;
}

function blend(va, vb, a, max) {
  // (1)+(2); 2*v*a + M*(1-a) = v1+v2
  //                        v = (v1+v2-M*(1-a))/(2*a)
  if (a <= 0) return 0;
  var v1 = va < vb ? va : vb;
  var v2 = va > vb ? va : vb;
  return (v1 + v2 - max * (1 - a)) / (2 * a);
}

function normalize(value) {
  if (value > 255) return 255;
  if (value < 0) return 0;
  return Math.round(value);
}

exports.ablend = function(a, b, o, onprogress) {
  if (typeof onprogress != 'function') onprogress = function(index, max) { };
  checkImageData(a, 'first input');
  checkImageData(b, 'second input');
  checkImageData(o, 'output');
  if (a.width != b.width || a.height != b.height || a.width != o.width || a.height != o.height) {
    throw new Error('image data objects should have the same dimension');
  }
  var l = a.data.length;
  for (var i = 0; i < l; i += 4) {
    var al = alpha(a.data[i + 0] + a.data[i + 1] + a.data[i + 2],
                   b.data[i + 0] + b.data[i + 1] + b.data[i + 2],
                   255 * 3);
    o.data[i + 0] = normalize(blend(a.data[i + 0], b.data[i + 0], al, 255));
    o.data[i + 1] = normalize(blend(a.data[i + 1], b.data[i + 1], al, 255));
    o.data[i + 2] = normalize(blend(a.data[i + 2], b.data[i + 2], al, 255));
    o.data[i + 3] = normalize(a.data[i + 3] * al);
    onprogress(i, l);
  }
  onprogress(l, l);
  return true;
};

