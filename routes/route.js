const express = require('express');
const router = express.Router();

const {shortenUrl,makeReport,analyticByAlias,Allanalytic,analyticByTopic} = require('../controller/urlcontroller');

router.route('/shorten').post(shortenUrl); 
router.route('/shorten/:alias').get(makeReport); 
router.route('/analytics/overall').get(Allanalytic)
router.route('/analytics/:alias').get(analyticByAlias)
router.route('/analytics/topic/:topic').get(analyticByTopic)





module.exports = router;