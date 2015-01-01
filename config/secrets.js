module.exports = {
	db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/test',
	TOKEN_SECRET: 'generatedtokensecret'
}