const fs = require("fs");

const key = [0xab, 0xa0, 0x6f, 0x2f, 0x1f, 0x1e, 0x9a, 0x45, 0x0, 0x0, 0x0, 0x0];

const imei = {
	calc_imei: (input) => {
		let utfArray = [];

		input.split("").forEach((value, index) => {
			utfArray[index] = String.fromCharCode(value);
		})

		let iNbuffer = Buffer.from(utfArray.join(""), "utf8");
		let outBuffer = Buffer.alloc(12);

		outBuffer[8] = 0x57;
		outBuffer[9] = 0xDB;

		for(let i = 0; i < 15; i += 2){
			outBuffer[i / 2] = iNbuffer[i];
			outBuffer[i / 2] += iNbuffer[i + 1] << 4;
			outBuffer[i / 2] ^= key[i / 2];
		}

		for(let i = 0; i < 10; i++){
			if(i & 0x1){
				outBuffer[11] += outBuffer[i];
			} else {
				outBuffer[10] += outBuffer[i];
			}
		}
		
		fs.writeFileSync("./MP0B_001", outBuffer);

		imei.decode(outBuffer);

		return outBuffer;
	},

	decode: (buffer) => {
		buffer = buffer.filter((_, index) => {
			return index < 8;
		}).map((value, index) => {
			return value ^ key[index];
		});

		let outBuffer = Buffer.alloc(15);

		for(let i = 0; i < 15; i += 2){
			outBuffer[i] = buffer[i/2] - ((buffer[i/2] >> 4) << 4);
			outBuffer[i + 1] = buffer[i/2] >> 4;
		}

		let result = "";
		
		for(let i = 0; i < 15; i++){
			result += outBuffer[i];
		}

		console.log(result);
	}
}

imei.calc_imei("012345678912345");

