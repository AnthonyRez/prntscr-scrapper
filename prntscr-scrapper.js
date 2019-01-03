const axios = require('axios');
const cheerio = require('cherio')
const download = require('image-downloader')
const fs = require('fs');
const dir = './images';
const noImgUrl = '//st.prntscr.com/2018/10/13/2048/img/0_173a7b_211be8ff.png'
const urlPrefix = 'https://prnt.sc/';

var numberOfThreads = (process.argv[2]) ? parseInt(process.argv[2]) : 3;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

function generateLink () {
	var values = '0123456789abcdefghijklmnopqrstuvwxyz'
	var result = '';
	for (var i = 0; i<6; i++) {
		result += values.charAt(Math.floor(Math.random() * 37));
	}
	return urlPrefix + result;
}

function downloadImage () {
	var imgLink = generateLink();
	console.log('Download: ' + imgLink);
	axios.get(imgLink).then((result) => {
	    var $ = cheerio.load(result.data)
	    var url = $('#screenshot-image').attr('src')
	    if (noImgUrl == url) {
	    	downloadImage();
	    } else {
	    	download.image({
		    	url: url,
		    	dest: dir
		    }).then(({ filename, image }) => {
			    console.log('File saved to', filename)
			    downloadImage();
			}).catch((err) => {
			    console.error('No image by url')
			    downloadImage();
			});
	    }
	}).catch((err) => {
	    console.error('Seems that Access Denied. Try to run script with less number of threads.')
	    downloadImage();
	});
}

for (var i = 0; i < numberOfThreads; i++) {
	downloadImage();
}
