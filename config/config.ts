
const _config = {
    port: 5000,
    host: "http://localhost",
    database: {
        port: 27017,
        usernmae: null,
        password: null,
        host: '127.0.0.1',
        dbname: "Blogs"
    },
    jwt: {
        secret: "UserApp_17381919283sdajksdhuwiw@#2023",
        issuer: '',
        expiresIn: "1d"
    },
    
   
};

const config = _config;

export { config };