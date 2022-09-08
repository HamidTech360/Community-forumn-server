export function SignUpMailTemplate (link:string){
    return(
        `
        <!DOCTYPE html>
        <html lang="en">
        <body>
            <h1>Welcome to Settlin</h1>
            <p>Click on this <a href="${link}">Link</a> to comfirm your email address</p>
            <p>Check your promotion or spam folder to view message</p>
        </body>
        </html>
        `
    )
}