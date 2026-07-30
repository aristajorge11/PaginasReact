const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'products.json');
const text = fs.readFileSync(file, 'utf8');
const data = JSON.parse(text);
let changed = false;
for (const product of data) {
  if (!Object.prototype.hasOwnProperty.call(product, 'mini-image')) {
    product['mini-image'] = ['', '', ''];
    changed = true;
  }
}
if (changed) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('updated');
} else {
  console.log('no changes');
}
