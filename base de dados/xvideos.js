//matheuzinho domina papai
const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio');

async function xvideosSearch(q) {
return new Promise((resolve, reject) => {
axios.get(`https://www.xvideos.com/?k=${encodeURIComponent(q)}`, {
headers: {
"user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
}
})
.then((res) => {
const $ = cheerio.load(res.data);
const dados = [];
$('div[class="thumb-block  "]').each(function(i, e) {
dados.push({
titulo: $(e).find('.thumb-under > p > a').attr('title'),
duracao: $(e).find('.thumb-under > p > a > span').text(),
imagem: $(e).find('img').attr('data-src'),
link: 'https://www.xvideos.com' + $(e).find('.thumb-under > p > a').attr('href')
});
});
resolve({status: res.status, resultado: dados})
})
.catch(e => {
reject(e)
});
});
}

async function xvideosDownloader(url) {
return new Promise((resolve, reject) => {
axios.get(url, {
headers: {
"user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
}
})
.then((res) => {
const $ = cheerio.load(res.data);
const dados = [];
const dados1 = JSON.parse($('script[type="application/ld+json"]').text())
resolve({status: res.status, resultado: {titulo: dados1.name, desc: dados1.description, thumb: dados1.thumbnailUrl[0], link: dados1.contentUrl}})
})
.catch(e => {
reject(e)
});
});
}

module.exports = { xvideosSearch, xvideosDownloader }