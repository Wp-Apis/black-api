"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ephoto = void 0;
exports.ephoto = function (string, { type, headers = {} }) {
	const selectEphoto = require('./type.js')
	const cheerio = require('cheerio');
	const strings = (typeof string == 'object' ? string : string.split('/')).filter(v => v.length)
    const url = selectEphoto(type);
    if (!url) return Promise.reject('Opção errada!');
    
    Object.assign(headers, {
    	Referer: url
	})
    return this.getHTML(url, {
		method: "GET",
		followAllRedirects: true,
		headers
	}).then(html => {
		const $ = cheerio.load(html);
		const servidor = $('#build_server').val()
		const servidorId = $('#build_server_id').val()
		const token = $('#token').val()
		const radio0 = [];
		const radio1 = [];
		const radio2 = [];
		const radio3 = [];
		$('.item-input.select_option_wrapper > label').map((_, elem) => {
			const value = $(elem).find('input').val();
			const id = $(elem).find('input').attr('id');
			if (/radio0/.test(id)) radio0.push(value);
			if (/radio1/.test(id)) radio1.push(value);
			if (/radio2/.test(id)) radio2.push(value);
			if (/radio3/.test(id)) radio3.push(value);
		});
		return this.getHTML(url, {
			method: "POST",
			followAllRedirects: true,
			headers: Object.assign(headers, {
				Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
			}),
			form: {
				...(radio0.length ? { 'radio0[radio]': this.random(radio0) } : {}),
				...(radio1.length ? { 'radio1[radio]': this.random(radio1) } : {}),
				...(radio2.length ? { 'radio2[radio]': this.random(radio2) } : {}),
				...(radio3.length ? { 'radio3[radio]': this.random(radio3) } : {}),
				'text': strings,
				'submit': 'GO',
				'token': token,
				'build_server': servidor,
				'build_server_id': Number(servidorId)
			}
		}).then(data => {
			const $ = cheerio.load(data);
			const read = $('#form_value_input').val()
			return this.getHTML('https://en.ephoto360.com/effect/create-image', {
				method: "POST",
				followAllRedirects: true,
				headers,
				form: JSON.parse(read)
			}).then(({ image, success }) => {
				if (!success) return Promise.reject('Não obtive resposta.');
						
				return Promise.resolve(servidor + image);
			});
    	});
    });
}