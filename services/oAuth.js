const axios=require('axios')

const GOOGLE_OAUTH2_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

function getGoogleAuthUrl(){
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URL,
        response_type: 'code',
        scope: 'openid profile email',
    });
    return `${GOOGLE_OAUTH2_URL}?${params.toString()}`;
}

async function getGoogleTokens (code){
    const response = await axios.post(GOOGLE_TOKEN_URL, null, {
        params: {
            code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SERVER,
            redirect_uri: process.env.REDIRECT_URL,
            grant_type: 'authorization_code',
        },
    });
    return response.data;
}

async function getGoogleUser(id_token, access_token){
    const response = await axios.get(GOOGLE_USERINFO_URL, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return response.data;
}

module.exports={getGoogleAuthUrl,getGoogleTokens,getGoogleUser}