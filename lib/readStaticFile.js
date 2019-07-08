'use strict';

const config = require('../config/serverconfig');

const fs = require('fs');
const path = require('path');

module.exports = (pathName) => {
    return new Promise(resolve => {
        pathName = `${__dirname}/../public/${(pathName === '/') ? 'index.html' : pathName}`;

        fs.exists(pathName, function (exist) {
            if (exist) {
                fs.readFile(pathName, function (err, data) {
                    if (err) {
                        resolve({
                            statusCode: 500,
                            mimeType: config.mimeTypes.default,
                            data: `Error getting the file: ${err}.`
                        });
                    } else {
                        const fileExtension = path.parse(pathName).ext;
                        resolve({
                            statusCode: 200,
                            mimeType: config.mimeTypes[fileExtension] || config.mimeTypes.default,
                            data: data
                        });
                    }
                });
            } else {
                // if the file is not found, return 404
                resolve({
                    statusCode: 404,
                    mimeType: config.mimeTypes.default,
                    data: `File ${pathName} not found!`
                });
             }
        });
    })
};
