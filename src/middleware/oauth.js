'use strict';
require('dotenv').config();

const superagent = require('superagent');
const User = require('../models/users.js');

// this came from the docs
//https://docs.github.com/en/developers/apps/authorizing-oauth-apps

const tokenServerUrl = 'https://graph.facebook.com/v10.0/oauth/access_token';
const remoteAPI = 'https://www.facebook.com/connect/login_success.html';

// gh OAuth app secrets
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// "https://graph.facebook.com/oauth/access_token
//   ?client_id={your-app-id}
//   &client_secret={your-app-secret}"



// the code will come from the popup


module.exports = async (req, res, next) => {

    try {
        console.log('*******************************');
        const code = req.query.code;
        const remoteToken = await exchangeCodeForToken(code);
        console.log('2. ACCESS TOKEN', remoteToken);
        // const remoteUser = await getRemoteUserInfo(remoteToken);
        // console.log('3. GITHUB USER', remoteUser);
        // const [user, token] = await getUser(remoteUser);
        // console.log('4. LOCAL USER', user, token);
        // req.user = user;
        // req.token = token;
        next();
    } catch (error) {
        next(error.message);
    }
};

async function exchangeCodeForToken(code) {
    console.log(CLIENT_ID , CLIENT_SECRET, REDIRECT_URI)
    const tokenResponse = await superagent.post(tokenServerUrl).send({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      client_secret: CLIENT_SECRET,
      code: code,
    });
  
    const accessToken = tokenResponse.body.access_token;
    return accessToken;
  }
  

// async function getRemoteUserInfo(token) {
//     const userResponse = await superagent
//         .get(remoteAPI)
//         .set('Authorization', `token ${token}`)
//         .set('user-agent', 'express-app');
//     const user = userResponse.body;
//     return user;
// }

// async function getUser(remoteUser) {
//     const userRecord = {
//         username: remoteUser.login,
//         password: 'oauthpassword', // this can be anything (it will be hashed)
//     };
//     const user = new User(userRecord);
//     const userDoc = user.save();
//     const token = User.generateToken(userDoc);
//     return [user, token];
// }