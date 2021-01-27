require('dotenv').config()

const FtpDeploy = require("ftp-deploy");
let ftpDeploy = new FtpDeploy();

let config = {
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    host: process.env.FTP_HOST,
    port: 21,
    localRoot: __dirname + "/build",
    remoteRoot: "/public_html/",
    include: ["*", "**/*", ".htaccess"],
    deleteRemote: false,
    forcePasv: false,
    sftp: false,
}

ftpDeploy.deploy(config)
    .then(res => console.log("finished: " + res))
    .catch(err => console.log(err))