import React from 'react';
const AuthContext = React.createContext({
    status:false,
    name: 'user',
    email:'user@xyz.com',
    accessToken: 'foobar'
});
export default AuthContext;
