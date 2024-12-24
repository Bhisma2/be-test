const config = {
    jwtSecret: `${process.env.JWT_SECRET}`,
    databaseURL: `${process.env.MONGODB_URI}`,
};

export default config;
