const ocr = require('../routes/ocr')
const translate = require('../routes/translate')
const { DelayedResponse } = require('http-delayed-response')

module.exports = (app) => {

    app.use(function (req, res) {
        var delayed = new DelayedResponse(req, res);

        delayed.on('done', function (results) {
            // slowFunction responded within 5 seconds
            console.log('here 1.......................')
            res.json(results);
        }).on('cancel', function () {
            // slowFunction failed to invoke its callback within 5 seconds
            // response has been set to HTTP 202
            console.log('here 2.......................')
            res.write('sorry, this will take longer than expected...');
            res.end();
        });

        function slowFunction(callback) {
            console.log("slow motion")
        }

        slowFunction(delayed.wait(5000));
    });
    // const extendTimeoutMiddleware = (req, res, next) => {
    //     try {
    //         const space = ' ';
    //         let isFinished = false;
    //         let isDataSent = false;

    //         // Only extend the timeout for API requests
    //         // if (!req.url.includes('/api')) {
    //         //     next();
    //         //     return;
    //         // }

    //         res.once('finish', () => {
    //             isFinished = true;
    //         });

    //         res.once('end', () => {
    //             isFinished = true;
    //         });

    //         res.once('close', () => {
    //             isFinished = true;
    //         });

    //         // console.log('middle 1 res: ', res['data'])
    //         console.log('middle 1 data', req.method)
    //         // res.on('data', () => {
    //         // Look for something other than our blank space to indicate that real
    //         // data is now being sent back to the client.
    //         // if (data !== space) {
    //         //     isDataSent = true;
    //         // }
    //         // });

    //         const waitAndSend = () => {
    //             setTimeout(() => {

    //                 console.log('middle 1 timeout')
    //                 // If the response hasn't finished and hasn't sent any data back....
    //                 if (!isFinished && !isDataSent) {
    //                     // Need to write the status code/headers if they haven't been sent yet.

    //                     res.write(space);

    //                     // Wait another 15 seconds
    //                     waitAndSend();
    //                 }
    //             }, 10000);
    //         };

    //         waitAndSend();
    //         next();
    //     } catch (error) {
    //         console.log("error time 15s: ", error)
    //     }
    // };

    // app.use(extendTimeoutMiddleware);

    app.get("/api/testing", (req, res) => {
        res.send('Hi node')
    })

    app.use('/api/ocr', ocr)
    app.use('/api/translate', translate)
}