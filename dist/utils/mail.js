"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMail = void 0;
const axios_1 = __importDefault(require("axios"));
function SendMail(props) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = {
                sender: {
                    name: 'Setlinn Team',
                    email: 'owolabihammed360@gmail.com'
                },
                to: [
                    ...props.targetEmail
                ],
                subject: props.subject,
                htmlContent: props.htmlContent
            };
            const response = yield axios_1.default.post(`https://api.sendinblue.com/v3/smtp/email`, payload, { headers: {
                    "content-type": "application/json",
                    "api-key": `${process.env.SENDINBLUEAPIKEY}`
                } });
            console.log(response.data);
            return 'success';
        }
        catch (error) {
            console.log((_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
            return error;
        }
    });
}
exports.SendMail = SendMail;
