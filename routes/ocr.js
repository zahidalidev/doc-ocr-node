const express = require('express')
const tessaract = require('tesseract.js')
const multer = require('multer');
const fs = require('fs-extra')

const router = new express.Router()

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/images/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage })

router.post('/:id', upload.single('file'), async (req, res) => {
    try {
        console.log('in ocr')

        const lang = req.params.id
        const createWorker = tessaract.createWorker;
        const worker = createWorker();
        // const worker = createWorker({
        //     logger: m => console.log(m),
        // });
        console.log("path1: ", req.file.path)

        await worker.load();
        await worker.loadLanguage(lang);
        await worker.initialize(lang)

        console.log("path: ", req.file.path)

        const { data } = await worker.recognize(req.file.path)

        console.log("path2: ", req.file.path)
        // remove image from path "req.file.path"
        await fs.remove(req.file.path)

        console.log('Scanned text: ', data)
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router
