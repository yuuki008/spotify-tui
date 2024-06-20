/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst oauth_1 = __importDefault(__webpack_require__(/*! ./spotify/oauth */ \"./src/spotify/oauth.ts\"));\nconst client_1 = __importDefault(__webpack_require__(/*! ./spotify/client */ \"./src/spotify/client.ts\"));\nconst react_1 = __importStar(__webpack_require__(/*! react */ \"react\"));\nconst ink_1 = __webpack_require__(/*! ink */ \"ink\");\nconst App = () => {\n    const [playlists, setPlaylists] = (0, react_1.useState)([]);\n    const [selectedPlaylist, setSelectedPlaylist] = (0, react_1.useState)(null);\n    const [tracks, setTracks] = (0, react_1.useState)([]);\n    (0, react_1.useEffect)(() => {\n        const f = async () => {\n            const oauth = new oauth_1.default();\n            const spotifyClient = new client_1.default(oauth);\n            const res = await spotifyClient.myPlaylists();\n            setPlaylists(res.items);\n        };\n        f();\n    }, []);\n    return (react_1.default.createElement(ink_1.Box, { flexDirection: \"column\", padding: 1 },\n        react_1.default.createElement(ink_1.Box, { flexDirection: \"row\" },\n            react_1.default.createElement(ink_1.Box, { width: \"30%\" },\n                react_1.default.createElement(ink_1.Text, null, \"Playlists\"),\n                playlists.map((playlist) => (react_1.default.createElement(ink_1.Text, { key: playlist.id }, playlist.name)))),\n            react_1.default.createElement(ink_1.Box, { width: \"70%\" },\n                react_1.default.createElement(ink_1.Text, null, \"Tracks\"),\n                tracks.map((track) => (react_1.default.createElement(ink_1.Text, { key: track.track.id }, track.track.name))))),\n        react_1.default.createElement(ink_1.Box, { borderColor: \"green\", borderStyle: \"round\", padding: 1, marginTop: 1 },\n            react_1.default.createElement(ink_1.Text, null, \"Player\"))));\n};\n(0, ink_1.render)(react_1.default.createElement(App, null));\n\n\n//# sourceURL=webpack://spotify-tui/./src/index.tsx?");

/***/ }),

/***/ "./src/spotify/client.ts":
/*!*******************************!*\
  !*** ./src/spotify/client.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst axios_1 = __importDefault(__webpack_require__(/*! axios */ \"axios\"));\nconst endpoint = 'https://api.spotify.com/v1';\nclass SpotifyClient {\n    constructor(oauth) {\n        this.oauth = oauth;\n    }\n    // NOTE: 共通の API リクエストメソッド\n    // 認証に失敗したリクエストは再度アクセストークンをリフレッシュしてリクエスト\n    async makeRequest({ method, path, headers, body, retry = true }) {\n        const accessToken = await this.oauth.getAccessToken();\n        if (!accessToken) {\n            throw new Error('アクセストークンが取得できませんでした。');\n        }\n        const config = {\n            url: endpoint + path,\n            method,\n            headers: {\n                ...headers,\n                Authorization: `Bearer ${accessToken}`,\n            },\n            data: body,\n        };\n        try {\n            const response = await (0, axios_1.default)(config);\n            return response.data;\n        }\n        catch (error) {\n            if (error.response && error.response.status === 401 && retry) {\n                await this.oauth.refreshAccessToken();\n                return this.makeRequest({ method, path, headers, body, retry: false });\n            }\n            else {\n                throw error;\n            }\n        }\n    }\n    async devices() {\n        return this.makeRequest({\n            method: 'get',\n            path: '/me/player/devices'\n        });\n    }\n    async getUserProfile() {\n        return this.makeRequest({\n            method: 'get',\n            path: '/me'\n        });\n    }\n    async myPlaylists() {\n        return this.makeRequest({\n            method: 'get',\n            path: '/me/playlists'\n        });\n    }\n    async play(args) {\n        await this.makeRequest({\n            method: 'put',\n            path: '/me/player/play',\n            body: args\n        });\n    }\n    async pasuse(device_id) {\n        const body = device_id ? { device_id } : {};\n        await this.makeRequest({\n            method: \"put\",\n            path: '/me/player/pause',\n            body\n        });\n    }\n    ;\n}\nexports[\"default\"] = SpotifyClient;\n\n\n//# sourceURL=webpack://spotify-tui/./src/spotify/client.ts?");

/***/ }),

/***/ "./src/spotify/oauth.ts":
/*!******************************!*\
  !*** ./src/spotify/oauth.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst keytar_1 = __importDefault(__webpack_require__(/*! keytar */ \"keytar\"));\nconst axios_1 = __importDefault(__webpack_require__(/*! axios */ \"axios\"));\nconst querystring_1 = __importDefault(__webpack_require__(/*! querystring */ \"querystring\"));\nconst open_1 = __importDefault(__webpack_require__(/*! open */ \"open\"));\nconst dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ \"dotenv\"));\ndotenv_1.default.config();\n// 開発者用の認証情報\nconst clientId = process.env.SPOTIFY_CLIENT_ID;\nconst clientSecret = process.env.SPOTIFY_CLIENT_SECRET;\nconst redirectUri = process.env.SPOTIFY_REDIRECT_URI;\nconst port = '8888';\n// 認証方法は Authorization Code Flow を採用\n//   ドキュメント: https://developer.spotify.com/documentation/web-api/tutorials/code-flow\n//   認証フロー:\n//     1. ユーザー認証ページにリダイレクト\n//     2. ユーザーが許可\n//     3. 認可コードを使ってアクセストークンを取得\n//     4. アクセストークンを使用して API リクエストを行う\nclass OAuth {\n    constructor() {\n        this.accessToken = null;\n        this.server = null;\n    }\n    login(_req, res) {\n        const scopes = [\n            'user-read-private',\n            'user-read-email',\n            'user-read-playback-state',\n            'user-modify-playback-state',\n        ].join(' ');\n        const authorizeURL = `https://accounts.spotify.com/authorize?${querystring_1.default.stringify({\n            response_type: 'code',\n            client_id: clientId,\n            scope: scopes,\n            redirect_uri: redirectUri,\n        })}`;\n        res.redirect(authorizeURL);\n    }\n    async callback(req, res) {\n        const code = req.query.code || null;\n        if (typeof code === 'string') {\n            try {\n                const tokenResponse = await axios_1.default.post('https://accounts.spotify.com/api/token', querystring_1.default.stringify({\n                    grant_type: 'authorization_code',\n                    code: code,\n                    redirect_uri: redirectUri,\n                    client_id: clientId,\n                    client_secret: clientSecret,\n                }), {\n                    headers: {\n                        'Content-Type': 'application/x-www-form-urlencoded',\n                    },\n                });\n                this.accessToken = tokenResponse.data.access_token;\n                const refreshToken = tokenResponse.data.refresh_token;\n                this.saveRefreshToken(refreshToken);\n                res.send('ログイン成功！ターミナルに戻ってください。サーバーを停止します。');\n                if (this.server) {\n                    this.server.close(() => {\n                        console.log('サーバーが停止しました。');\n                    });\n                }\n            }\n            catch (error) {\n                console.error('トークン取得中にエラーが発生しました。', error);\n                res.send('ログインに失敗しました。');\n            }\n        }\n        else {\n            res.send('認証コードが見つかりませんでした。');\n        }\n    }\n    async refreshAccessToken() {\n        const refreshToken = await this.getRefreshToken();\n        try {\n            if (!refreshToken)\n                throw new Error('No refresh token found. Please login first.');\n            const response = await axios_1.default.post('https://accounts.spotify.com/api/token', querystring_1.default.stringify({\n                grant_type: 'refresh_token',\n                refresh_token: refreshToken,\n                client_id: clientId,\n                client_secret: clientSecret,\n            }), {\n                headers: {\n                    'Content-Type': 'application/x-www-form-urlencoded',\n                },\n            });\n            this.accessToken = response.data.access_token;\n            return this.accessToken;\n        }\n        catch (error) {\n            console.error(error);\n            this.startAuthServer();\n            throw new Error(error.message);\n        }\n    }\n    startAuthServer() {\n        const app = (0, express_1.default)();\n        app.get('/login', this.login.bind(this));\n        app.get('/callback', this.callback.bind(this));\n        this.server = app.listen(port, () => {\n            console.log(`サーバーが http://localhost:${port} で起動しました。`);\n            (0, open_1.default)('http://localhost:8888/login');\n        });\n    }\n    async getAccessToken() {\n        if (this.accessToken) {\n            return this.accessToken;\n        }\n        try {\n            return await this.refreshAccessToken();\n        }\n        catch (error) {\n            console.error('アクセストークンの取得中にエラーが発生しました。', error);\n            return null;\n        }\n    }\n    async saveRefreshToken(token) {\n        await keytar_1.default.setPassword('spotify', 'refresh_token', token);\n    }\n    async getRefreshToken() {\n        return await keytar_1.default.getPassword('spotify', 'refresh_token');\n    }\n}\nexports[\"default\"] = OAuth;\n\n\n//# sourceURL=webpack://spotify-tui/./src/spotify/oauth.ts?");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "ink":
/*!**********************!*\
  !*** external "ink" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("ink");

/***/ }),

/***/ "keytar":
/*!*************************!*\
  !*** external "keytar" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("keytar");

/***/ }),

/***/ "open":
/*!***********************!*\
  !*** external "open" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("open");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.tsx");
/******/ 	
/******/ })()
;