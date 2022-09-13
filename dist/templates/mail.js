"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordEmailTemplate = exports.SignUpMailTemplate = void 0;
function SignUpMailTemplate(link) {
    return (`
        <!DOCTYPE html>
        <html lang="en">
        <body>
            <h1>Welcome to Settlin</h1>
            <p>Click on this <a href="${link}">Link</a> to comfirm your email address</p>
        </body>
        </html>
        `);
}
exports.SignUpMailTemplate = SignUpMailTemplate;
function forgotPasswordEmailTemplate(link) {
    return (`
        <!DOCTYPE html>
        <html lang="en">
        <body>
            <h1>Reset your Password</h1>
            <p>Click on this <a href="${link}">Link</a> to reset your password</p>
            
        </body>
        </html>
        `);
}
exports.forgotPasswordEmailTemplate = forgotPasswordEmailTemplate;
