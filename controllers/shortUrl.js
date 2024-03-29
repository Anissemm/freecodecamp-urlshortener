const ShortUrl = require('../models');
const shortId = require('shortid');
const validUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

const setUrl = async (req, res, next) => {
    const url = req.body.url;
    const urlId = shortId.generate();

    if (!validUrl.test(url)) {
        res.json({ error: 'invalid url' });
    } else {
        try {
            let shortened = await ShortUrl.findOne({
                original_url: url,
            })
            if (shortened) {
                res.json({ original_url: shortened.original_url, short_url: shortened.short_url });
            } else {
                shortened = await ShortUrl.create({ original_url: url, short_url: urlId });
                res.json({ original_url: shortened.original_url, short_url: shortened.short_url });
            }
        } catch (error) {
            res.status(500).send('<h1>Internal server error</h1>')
        }
    }
};

const redirectTo = async (req, res, next) => {
    const { urlId } = req.params;
    try {
        const shortened = await ShortUrl.findOne({ short_url: urlId });
        if (shortened) {
            res.redirect(shortened.original_url);
        } else {
            res.status(404).send('<h1>No such URL..</h1>')
        }
    } catch (error) {
        res.status(500).send('<h1>Internal server error</h1>')
    }
};

module.exports = {
    setUrl,
    redirectTo
}