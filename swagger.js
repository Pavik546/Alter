/**
 * @swagger
 * components:
 *   schemas:
 *     User :
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: This the unique identifier of user 
 *         user_name:
 *           type: string
 *           description: The name of the user.
 *         user_email:
 *           type: string
 *           description: The  email of the user.
 *       example:
 *         user_id: 834567888
 *         user_name: John
 *         user_email: john@345gmail.com
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Url :
 *       type: object
 *       properties:
 *         LongUrl:
 *           type: string
 *           description: This the longurl of the website
 *         ShortUrl:
 *           type: string
 *           description: This is the shorturl of the website
 *         Alias:
 *           type: string
 *           description: The alias of the url
 *         Topic:
 *           type: string
 *           description: The topic of the url
 *         Created_by:
 *           type: string
 *           description: Id of the user who created
 *       example:
 *         LongUrl: https://gitlab.com/intrakraft1/retail/-/blob/main/models/agentBag.js?ref_type=heads
 *         ShortUrl: http://localhost:3000/api/shorten/gmail
 *         Alias: twitter
 *         Topic: Socialmedia
 *         Created_by: 123456788
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Analytic :
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: This the unique identifier of user 
 *         IP_address:
 *           type: string
 *           description: The IP_address of the user.
 *         GeoLocation:
 *           type: string
 *           description: The GeoLocation of the user.
 *         OperatingSystem:
 *           type: string
 *           description: The OperatingSystem of the user.
 *         DeviceType:
 *           type: string
 *           description: The DeviceType of the user.
 *         Alias:
 *           type: string
 *           description: The Alias of the url.
 *         Topic:
 *           type: string
 *           description: The Topic of the url.
 *         Count:
 *           type: number
 *           description: The Count of the click.
 *       example:
 *         user_id: 834567888
 *         IP_address: 1234.6787.90
 *         GeoLocation: Tamilnadu
 *         OperatingSystem: Linux
 *         DeviceType: Mobile
 *         Alias: 56789
 *         Topic: Email
 *         Count:  5
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Authenticate a user and get access tokens
 *     description: Authenticate a user using google
 *     tags:
 *       - User
 *     responses:
 *       '200':
 *         description: Login successful, returns access tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 token:
 *                   type: string
 *                   description: An access token for the authenticated user.    
 *       '401':
 *         description: Invalid credentials (email or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while logging in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: shorten the url 
 *     description: Create a url document with the provided data.
 *     tags:
 *       - Url
 *     requestBody:
 *       description: Url object to be shorten
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: This the longurl
 *               customAlias:
 *                 type: string
 *                 description: The Alias of the url.
 *               Topic:
 *                 type: string
 *                 description: The topic of the url.
 *             example:
 *               longUrl:  https://gitlab.com/intrakraft1/retail/-/blob/main/models/agentBag.js?ref_type=heads
 *               customAlias:  69HCQ
 *               Topic:  Email
 *     responses:
 *       '200':
 *         description: Url shortened successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '400':
 *         description: Alias already exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while shortening the url
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to Original url
 *     description: Redirect to Original url and create a data for analytics
 *     tags:
 *       - Url
 *     parameters:
 *       - in: path
 *         name: alias
 *         schema:
 *           type: string
 *         required: true
 *         description: The alias of the Url to redirect.
 *     responses:
 *       '302':
 *         description: Redirect to the original URL.
 *         headers:
 *           Location:
 *             description: The URL to which the client should be redirected.
 *             schema:
 *               type: string
 *       '404':
 *         description: Alias not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: An error occurred while fetching the Organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Analytic of all url
 *     description: Analytic of all url
 *     tags:
 *       - Analytic
 *     responses:
 *       '200':
 *         description: Successfully retrieved analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       totalSummary:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             totalCount:
 *                               type: integer
 *                               description: Total number of visits.
 *                             uniqueUserCount:
 *                               type: integer
 *                               description: Number of unique users.
 *                             totalUrl:
 *                               type: integer
 *                               description: Number of unique urls.
 *                       byOperatingSystem:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             operatingSystems:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   OperatingSystem:
 *                                     type: string
 *                                     description: Name of the operating system.
 *                                   totalCount:
 *                                     type: integer
 *                                     description: Total number of visits.
 *                                   uniqueUserCount:
 *                                     type: integer
 *                                     description: Number of unique users.
 *                       byDevice:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             deviceType:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   DeviceType:
 *                                     type: string
 *                                     description: Type of device (e.g., Desktop, Mobile).
 *                                   totalCount:
 *                                     type: integer
 *                                     description: Total number of visits.
 *                                   uniqueUserCount:
 *                                     type: integer
 *                                     description: Number of unique users.
 *                       Datewise:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             Dates:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   Date:
 *                                     type: string
 *                                     format: date
 *                                     description: Date of the analytics data.
 *                                   totalCount:
 *                                     type: integer
 *                                     description: Total number of visits on the date.
 *       '500':
 *         description: An error occurred while fetching the Organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */


/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Analytic of alias of url
 *     description: Analytic of alias of url
 *     tags:
 *       - Analytic
 *     parameters:
 *       - in: path
 *         name: alias
 *         schema:
 *           type: string
 *         required: true
 *         description: The alias of the Url .
 *     responses:
 *       '200':
 *         description: Successfully retrieved analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       totalSummary:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             totalCount:
 *                               type: integer
 *                               description: Total number of visits.
 *                             uniqueUserCount:
 *                               type: integer
 *                               description: Number of unique users.
 *                       byOperatingSystem:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             operatingSystems:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   OperatingSystem:
 *                                     type: string
 *                                     description: Name of the operating system.
 *                                   totalCount:
 *                                     type: integer
 *                                     description: Total number of visits.
 *                                   uniqueUserCount:
 *                                     type: integer
 *                                     description: Number of unique users.
 *                       byDevice:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             deviceType:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   DeviceType:
 *                                     type: string
 *                                     description: Type of device (e.g., Desktop, Mobile).
 *                                   totalCount:
 *                                     type: integer
 *                                     description: Total number of visits.
 *                                   uniqueUserCount:
 *                                     type: integer
 *                                     description: Number of unique users.
 *                       Datewise:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             Dates:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   Date:
 *                                     type: string
 *                                     format: date
 *                                     description: Date of the analytics data.
 *                                   totalCount:
 *                                     type: integer
 *                                     description: Total number of visits on the date.
 *       '500':
 *         description: An error occurred while fetching the Organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */




/**
 * @swagger
 * /api/analytics/{topic}:
 *   get:
 *     summary: Analytic of topic of url
 *     description: Analytic of topic of url
 *     tags:
 *       - Analytic
 *     parameters:
 *       - in: path
 *         name: topic
 *         schema:
 *           type: string
 *         required: true
 *         description: The topic of the Url .
 *     responses:
 *       '200':
 *         description: Successfully retrieved analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       totalSummary:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             totalCount:
 *                               type: integer
 *                               description: Total number of visits.
 *                             uniqueUserCount:
 *                               type: integer
 *                               description: Number of unique users.
 *                       byOperatingSystem:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             operatingSystems:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   OperatingSystem:
 *                                     type: string
 *                                     description: Name of the operating system.
 *                                   totalCount:
 *                                     type: integer
 *                                     description: Total number of visits.
 *                                   uniqueUserCount:
 *                                     type: integer
 *                                     description: Number of unique users.
 *                       byDevice:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             deviceType:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   DeviceType:
 *                                     type: string
 *                                     description: Type of device (e.g., Desktop, Mobile).
 *                                   totalCount:
 *                                     type: integer
 *                                     description: Total number of visits.
 *                                   uniqueUserCount:
 *                                     type: integer
 *                                     description: Number of unique users.
 *                       Datewise:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             Dates:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   Date:
 *                                     type: string
 *                                     format: date
 *                                     description: Date of the analytics data.
 *                                   totalCount:
 *                                     type: integer
 *                                     description: Total number of visits on the date.
 *       '500':
 *         description: An error occurred while fetching the Organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */
