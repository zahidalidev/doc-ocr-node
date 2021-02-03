const ocr = require('../routes/ocr')
const translate = require('../routes/translate')
const DelayedResponse = require('http-delayed-response')

module.exports = (app) => {

    // app.use(function (req, res) {
    //     var delayed = new DelayedResponse(req, res);

    //     delayed.on('done', function (results) {
    //         // slowFunction responded within 5 seconds
    //         console.log('here 1.......................: ', results)
    //         res.json(results);

    //     }).on('cancel', function () {
    //         // slowFunction failed to invoke its callback within 5 seconds
    //         // response has been set to HTTP 202
    //         console.log('here 2.......................')
    //         res.write('sorry, this will take longer than expected...');
    //         res.end();
    //     });

    //     function slowFunction(callback) {
    //         console.log("slow motion")
    //         console.log("callback: ", callback)
    //         return "nothing"
    //     }

    //     slowFunction(delayed.wait(20000));
    // });



    // app.use(function (req, res) {
    //     var delayed = new DelayedResponse(req, res);

    //     delayed.on('done', function (data) {
    //         // handle "data" anyway you want, but don't forget to end the response!
    //         console.log("data: ....", data)
    //         res.end();
    //     });

    //     function slowFunction(callback) {
    //         console.log("slow motion")
    //         console.log("callback: ", callback)
    //     }

    //     slowFunction(delayed.wait());

    // });




    const extendTimeoutMiddleware = (req, res, next) => {
        try {
            const space = ' ';
            let isFinished = false;
            let isDataSent = false;

            // Only extend the timeout for API requests
            // if (!req.url.includes('/api')) {
            //     next();
            //     return;
            // }

            res.once('finish', () => {
                isFinished = true;
                console.log("finish......")
                next();
            });

            res.once('end', () => {
                isFinished = true;
                console.log("edned......")
            });

            res.once('close', () => {
                isFinished = true;
            });

            // console.log('middle 1 res: ', res['data'])
            // console.log('middle 1 data', res.body)
            // res.on('data', () => {
            //     // Look for something other than our blank space to indicate that real
            //     // data is now being sent back to the client.
            //     if (data !== space) {
            //         isDataSent = true;
            //     }
            // });
            // res.on('data', function (body) {
            //     console.log("body: ", body);
            // });

            const waitAndSend = () => {
                setTimeout(() => {

                    console.log('middle 1 timeout')
                    // If the response hasn't finished and hasn't sent any data back....
                    if (!isFinished && !isDataSent) {
                        // Need to write the status code/headers if they haven't been sent yet.

                        res.write(space);

                        // Wait another 15 seconds
                        waitAndSend();
                    }

                    res.once('finish', () => {
                        console.log("finish 2......")
                        next();
                    });

                }, 10000);
            };

            waitAndSend();
            next();
        } catch (error) {
            console.log("error time 15s: ", error)
        }
    };

    app.use(extendTimeoutMiddleware);

    app.get("/api/testing", (req, res) => {
        res.send('Hi node')
    })

    app.use('/api/ocr', ocr)
    app.use('/api/translate', translate)
}