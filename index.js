//carregar a biblioteca do express
const express = require('express');
const dbMysql = require('mysql');
const cors = require('cors');

//incluir a requisição do json parse
const bodyParser = require('body-parser');

//incializando o express
var app = express();

app.use(cors({origin: '*'}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//função para executar queries
function execSQLQuery(sqlQry, res) {

  //inicializar a base de dados
var db = dbMysql.createConnection({
  host: "uninove-databasefelipe.mysql.database.azure.com",
  user: "femaziero@uninove-databasefelipe",
  password: "Fmaziero159753",
  database: "quintaautomacao",
  port: 3306,
  ssl: true

});

  //Connection to database
db.connect(function (erro) {
  if (erro) throw erro;
  console.log("Connected to Database!");
});

  db.query(sqlQry, function (error, results, fields) {
    if (error)
      res.json(error);
    else
      res.json(results);

    console.log('executou!');
  });
}

//Trazer todos os usuários
app.get('/usuarios', function (req, res) {
  const sql = "select * from usuario";
  execSQLQuery(sql, res);
});

//Trazer o usuário por Id
app.get('/usuarios/:id', function (req, response) {
  const sql = `select * from usuario where idUsuario = ${req.params.id}`;
  execSQLQuery(sql, response);
});

//Salvar informações na tabela usuário
app.post('/usuarios', function(request, response){
   const {usuario, senha} = request.body;
   const sql = `insert into usuario(usuario, senha) values('${usuario}', '${senha}')`;
   console.log(sql);
   execSQLQuery(sql, response);
});

app.delete('/usuarios/ :id', function(request, response){
    const id = request.params.id;
    const sql = `delete from usuario where idUsuario = '${id}';`;
    execSQLQuery(sql, response);

});


//endpoints ou endereços da web
app.get('/', function (req, res) {
  res.send('Hello World');
});

//a porta que será exposta
app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;