const { format } = require("util");
const axios = require("axios");
const fetch = require("node-fetch");

module.exports = {
    command: 'fetch',
    type: ['tools'],
    description: '*provide URL*',
    async execute(client, m, args, NReply) {
        const text = args.length >= 1 ? args.join(" ") : (m.quoted && m.quoted.text) || "";
        if (!text) {
            return NReply(`Please provide a URL\n\nYou can now use the following options:\n\n* \`--data\`: Send data with the request. You can specify key-value pairs separated by \`&\`.\n* \`--header\`: Specify custom headers. You can specify key-value pairs separated by \`&\`.\n* \`--referer\`: Set the \`Referer\` header.\n* \`--responseType\`: Specify the response type. You can choose from \`json\`, \`arraybuffer\`, \`blob\`, \`document\`, or \`stream\`.\n* \`--method\`: Specify the request method. You can choose from \`GET\`, \`HEAD\`, \`POST\`, \`PUT\`, \`PATCH\`, atau \`DELETE\`.`);
        }

        const urlRegex = /\b(https?:\/\/[^\s]+)/gi;
        const urlMatch = text.match(urlRegex);
        const url = urlMatch ? urlMatch[0].trim() : null;
        if (!url) return NReply("Where is the url??");

        m.reply('please be patient');

        let options = {};
        let data = null;
        let method = "GET";
        let responseType = "json";

        const dataFlag = text.includes("--data");
        const headerFlag = text.includes("--header");
        const refererFlag = text.includes("--referer");
        const responseTypeFlag = text.includes("--responseType");
        const methodFlag = text.includes("--method");

        if (dataFlag) {
            const dataArray = text.split("--data")[1].trim().split("&");
            data = {};
            dataArray.forEach((pair) => {
                const [key, value] = pair.split("=");
                data[key] = value;
            });
        }

        if (headerFlag) {
            const headerArray = text.split("--header")[1].trim().split("&");
            options.headers = {};
            headerArray.forEach((pair) => {
                const [key, value] = pair.split("=");
                options.headers[key] = value;
            });
        }

        if (refererFlag) {
            const referer = text.split("--referer")[1].trim();
            options.headers = options.headers || {};
            options.headers.Referer = referer;
        }

        if (responseTypeFlag) {
            const responseTypeValue = text.split("--responseType")[1].trim();
            responseType = responseTypeValue;
        }

        if (methodFlag) {
            const methodValue = text.split("--method")[1].trim().toUpperCase();
            method = methodValue;
        }

        let res;
        try {
            if (method === "HEAD") {
                res = await axios.head(url, options);
            } else if (method === "POST") {
                res = await axios.post(url, data, options);
            } else {
                res = await fetch(url, {
                    method,
                    body: data ? JSON.stringify(data) : undefined,
                    headers: options.headers,
                });
            }

            if (!/text|json/.test(res.headers.get("content-type"))) {
                return client.sendMessage(m.chat, `Invalid response type\n\n*-* *Url* : ${url}\n*-* *Text* : ${text}`, { quoted: m });
            }

            let txt = await res.buffer();
            try {
                txt = format(JSON.parse(txt + ""));
            } catch (e) {
                txt = txt + "";
            } finally {
                client.sendMessage(m.chat, txt.slice(0, 65536), { quoted: m });
            }
        } catch (error) {
            console.error(error);
            NReply('Failed to fetch data from the URL. Please try again.');
        }
    }
};
