var environment = {
    port: process.env.PORT || 5000,
    ip: process.env.IP || '0.0.0.0',
    secret: {
	token: 'cleannote-secret'
    }
};

module.exports = environment;
