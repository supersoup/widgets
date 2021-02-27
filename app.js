const express = require('express');
const app = express();
const port = 80;

app.use(express.static('.'));

app.use('/', function (req, res) {
	res.redirect('/example/all/')
});

app.listen(port, () => {
	console.log('启动中');
});