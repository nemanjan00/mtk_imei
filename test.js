const imei = require("./");

let encoded = imei.calc_imei("012345678912345");

console.log(encoded);

console.log(imei.decode(encoded));
