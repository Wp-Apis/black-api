const axios = require('axios');
const fs = require('fs');
const FileType = require('file-type'); // 16.5.3
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fetch = require("node-fetch") // 2.6.1

const setClass = new Object({
    apiKey: "",  // String | Authorization!
    prompt: "",  // String | Recommend!
    media: ""  // String | Recommend!
});

class GoogleGeminiAI {
   constructor(config = {}) {			
	const { apiKey, prompt, media } = Object.assign(setClass, config)
    this.apiKey = apiKey || "";
    this.prompt = prompt || "";
    this.media = media || "";
  }

  async getMimeType(media = this.media) {
    return new Promise(async (resolve, reject) => {
      try {
        if (media.startsWith("https://")) {
          const response = await axios.head(media);
          resolve(response.headers['content-type']);
        } else if(media.startsWith("./")) {
          const type = await FileType.fromFile(media);
          resolve(type.mime);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async getBuffer(url = this.media) {
	const res = await fetch(url, {headers: { 'User-Agent': 'okhttp/4.5.0'}, method: 'GET' })
	const buff = await res.buffer();
       return buff
  }

  async image(apiKey = this.apiKey, prompt = this.prompt, media = this.media) {
   return new Promise(async(resolve, reject) => {
      try {
        if (!apiKey) return reject("Authentication not found!");
        if (!prompt) return resolve("O que você deseja perguntar?");
        if(!media) return resolve("Sem Mídia");
        const mimeType = await this.getMimeType(media);
        let configuration;

        if (media.startsWith("https://")) {
          const buffer = await this.getBuffer(media);
          configuration = { inlineData: { data: Buffer.from(buffer).toString("base64"), mimeType: mimeType } };
        } else if(media.startsWith('./')) {
          const buffer = fs.readFileSync(media);
          configuration = { inlineData: { data: Buffer.from(buffer).toString("base64"), mimeType: mimeType }};
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});
        const result = await model.generateContent([prompt, configuration]);
        resolve(result.response.text());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async text(apiKey = this.apiKey, prompt = this.prompt) {
   return new Promise(async(resolve, reject) => {
    try {
      if (!apiKey) return reject("Authentication not found!");
      if (!prompt) return resolve("O que você deseja perguntar?");
      
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});
        
        const result = await model.generateContent([prompt]);
        resolve(result.response.text());
      } catch (error) {
        reject("Error");
      }
   })
 }
 
 start(apiKey = this.apiKey, query = this.prompt, media = this.media) {
   return new Promise(async(resolve, reject) => {
      try {
        if (!apiKey) return reject("Authentication not found!");
        if (!query) return resolve("O que você deseja perguntar?");

        const mimeType = await this.getMimeType(media);
        let configuration;

        if (media.startsWith("https://")) {
          const buffer = await this.getBuffer(media);
          configuration = { inlineData: { data: Buffer.from(buffer).toString("base64"), mimeType: mimeType } };
        } else if(media.startsWith('./')) {
          const buffer = fs.readFileSync(media);
          configuration = { inlineData: { data: Buffer.from(buffer).toString("base64"), mimeType: mimeType } };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const result = await model.generateContent([query, configuration]);
        resolve(result.response.text());
      } catch (error) {
        reject("Error");
      }
    });
  }
 
 }

module.exports = GoogleGeminiAI
