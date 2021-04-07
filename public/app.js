'use strict';


const URL = `https://www.facebook.com/v10.0/dialog/oauth?client_id=499316858094104&redirect_uri=https://fb-oauth-abbmr.herokuapp.com/fb_oauth&state="{st=state123abc,ds=123456789}"`;



// const URL = 'https://www.facebook.com/v10.0/dialog/oauth';
// const options = {
  // client_id: '753559362027427',
  // redirect_uri: `http://localhost:3000/auth_`,
  // state: "{st=state123abc,ds=123456789}"
// };

// const queryString = Object.keys(options)
//   .map((key) => {
//     return `${key}=${encodeURIComponent(options[key])}`;
//   })
//   .join('&');

// console.log('QUERY', Object.keys(options));

// const authURL = `${URL}?${queryString}`;
console.log(authURL)
const aEl = document.getElementById('oauth');
aEl.setAttribute('href', authURL);