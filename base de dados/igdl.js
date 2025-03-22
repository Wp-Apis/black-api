const axios = require("axios").default
const fetch = require('node-fetch').default
const qs = require("qs");
const cheerio = require('cheerio');

class Instagram {

    static SaveIG(instaUrl) {
        return new Promise(async(resolve, reject) => {
            const response = await axios({
                url: 'https://v3.saveig.app/api/ajaxSearch',
                method: 'POST', 
                data: qs.stringify({
                    q: instaUrl,
                    t: "media",
                    lang: "en" 
                }), 
                headers: {
                    "Accept": "*/*",
                    "Origin": "https://saveig.app",
                    "Referer": "https://saveig.app/",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Sec-Ch-Ua": '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
                    "Sec-Ch-Ua-Mobile": "?0",
                    "Sec-Ch-Ua-Platform": '"Windows"',
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edge/115.0.1901.183",
                    "X-Requested-With": "XMLHttpRequest"
                }
            });
            if(!response.data.data) return reject('Error in API response');
            const $ = cheerio.load(response.data.data);
            const result = [];

            $(".download-items").each((index, element) => {
                const downloadLink = $(element).find(".download-items__btn:not(.dl-thumb) > a").attr("href");
                result.push(downloadLink);
            });
    
            resolve(result)
        })
    }

    static InDownloader(instaUrl) {
        return new Promise(async(resolve, reject) => {
            const response = await fetch('https://indownloader.app/request', {
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Origin': 'https://indownloader.app',
                    'Connection': 'keep-alive',
                    'Referer': 'https://indownloader.app/',
                    'Cookie': 'PHPSESSID=n5nj64la8r4atsirs29oukcna3',
                    'Priority': 'u=0',
                },
                body: qs.stringify({
                    link: instaUrl,
                    downloader: 'photo'
                })
              });
              const data = await response.json()
              if (data.error) return reject('Error in API response');
              const $ = cheerio.load(data.html);
              const downloadLinks = []
              
              $('.download-options a').each((index, element) => {
                downloadLinks.push($(element).attr('href'));
              })

              resolve(downloadLinks)
        })
    }

    static async SaveInsta(instaUrl) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await axios.request({
                    method: 'POST',
                    baseURL: 'https://saveinsta.io/core/ajax.php',
                    data: qs.stringify({
                        url: instaUrl,
                        host: 'instagram'
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'cookie': 'PHPSESSID=ihp48pmbr4cjgckula7qipjkko',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
                    }
                })
                const $ = cheerio.load(response.data);
                
                return resolve($('div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom').map((_, el) => 'https://saveinsta.io/' + $(el).find('div.col-md-8.mx-auto > a').attr('href')).get());
            } catch (error) {
                return reject('Error in API response');
            }
        })
    }

}

module.exports = Instagram;
