var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var _a = require("discord.js"), SlashCommandBuilder = _a.SlashCommandBuilder, EmbedBuilder = _a.EmbedBuilder, GuildChannel = _a.GuildChannel;
var admin = require("firebase-admin");
var serviceAccount = require("../firebase.json");
serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
var db = admin.firestore();
var counterRef = db.collection("counters").doc("confessions");
var initCounter = function () { return __awaiter(_this, void 0, void 0, function () {
    var counterDoc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, counterRef.get()];
            case 1:
                counterDoc = _a.sent();
                if (!!counterDoc.exists) return [3 /*break*/, 3];
                return [4 /*yield*/, counterRef.set({ count: 0 })];
            case 2:
                _a.sent();
                console.log("Counter initialized in Firestore.");
                return [3 /*break*/, 4];
            case 3:
                console.log("Counter already initialized.");
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
initCounter();
// Run a transaction to increment the counter
function flagColor(count) {
    var transFlag = ["#5BCEFA", "#F5A9B8", "#FFFFFF", "#F5A9B8", "#5BCEFA"];
    var lgbtqFlag = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#24408E", "#732982"];
    // lets say we choose the lgbtqFlag flag
    return lgbtqFlag[count % lgbtqFlag.length];
}
;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("confession")
        .setDescription("Fais une confesswiwon anyonwyme :3 (=🝦 ﻌ 🝦=)")
        .addStringOption(function (option) { return option.setName("confession").setDescription("Le messawge à postew anyonymewment!!! (ฅ^•ﻌ•^ฅ)").setRequired(true); }),
    execute: function (interaction) { return __awaiter(_this, void 0, void 0, function () {
        var confession, count, confessionChannelId, confessionChannel, _a, URLInMessage, mentionInMessage, embed;
        var _this = this;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    confession = interaction.options.getString("confession");
                    count = 1;
                    return [4 /*yield*/, db.runTransaction(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                            var counterDoc;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, transaction.get(counterRef)];
                                    case 1:
                                        counterDoc = _a.sent();
                                        // We will declare newCount here so it's available inside this block
                                        count = (counterDoc.exists && counterDoc.data().count ? counterDoc.data().count : 0) + 1;
                                        transaction.set(counterRef, { count: count });
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _c.sent();
                    confessionChannelId = "1227954337603653652";
                    if (!((_b = interaction.client.channels.cache.get(confessionChannelId)) !== null && _b !== void 0)) return [3 /*break*/, 2];
                    _a = _b;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, interaction.client.channels.fetch(confessionChannelId)];
                case 3:
                    _a = (_c.sent());
                    _c.label = 4;
                case 4:
                    confessionChannel = _a;
                    if (!!confessionChannel) return [3 /*break*/, 6];
                    console.error("Le channyew de confesswiwon n'a pas été twouvé !!!! ฅ(=＾◕ᆺ◕＾=)ฅ");
                    return [4 /*yield*/, interaction.reply({ content: "Aie, une ewweur s'est pwoduite!!!!! ฅ^•ﻌ•^ฅ", ephemeral: true })];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
                case 6:
                    URLInMessage = /^(.*(?:https?|ftp):\/\/).*$/;
                    if (URLInMessage.test(confession)) {
                        interaction.reply({ content: "Inclure des liens dans un messawge anyonyme n'est pas autowisé!!!!! (˶˃ᆺ˂˶)", ephemeral: true });
                        return [2 /*return*/];
                    }
                    mentionInMessage = /^.*(<@[0-9]{18}>).*$/;
                    if (mentionInMessage.test(confession)) {
                        interaction.reply({ content: "Mentionnew des pewsonnes dans tes messawges anyonymes n'est pas autowisé uwu ૮ ˶ᵔ ᵕ ᵔ˶ ა", ephemeral: true });
                        return [2 /*return*/];
                    }
                    embed = new EmbedBuilder()
                        .setTitle("Confession anonyme n°" + count)
                        .setDescription(" - \"" + confession + "\"")
                        .setColor(flagColor(count))
                        .setFooter({ text: "❗ Si ce message est inapproprié, vous pouvez reagir avec l'emoji 🚫 pour supprimer le message." });
                    confessionChannel
                        .send({ embeds: [embed] })
                        .then(function (message) {
                        // Confirm to the user that their confession has been posted (only they can see this)
                        interaction.reply({ content: "Ta confesswiwon a bwien été postwée ! (｡^•ㅅ•^｡)", ephemeral: true });
                        message.react("🚫");
                    })
                        .catch(function (error) {
                        console.error("Ewwow sending messwage (❁˃́ᴗ˂̀)(≧ᴗ≦✿)", error);
                        interaction.reply({ content: "Aie, une ewweur s'est pwoduite. (❁˃́ᴗ˂̀)(≧ᴗ≦✿)", ephemeral: true });
                    });
                    return [2 /*return*/];
            }
        });
    }); },
};
/** Fonction getNumero
 *  Va chercher la derniere confession postee dans le channel, et renvoie son numero.
 *
 * @param {TextChannel} channel - le channel en question
 *
 * @returns le numero trop cool et tout
 */
function getNumero(channel) {
    return __awaiter(this, void 0, void 0, function () {
        var lastMessage, _a, _b, title;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = Array).from;
                    return [4 /*yield*/, channel.messages.fetch({ limit: 1, cache: false })];
                case 1:
                    lastMessage = _b.apply(_a, [_c.sent()])[0][1];
                    title = lastMessage.embeds[0].title;
                    return [2 /*return*/, parseInt(title.slice(-2))];
            }
        });
    });
}
