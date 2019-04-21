const EXPRESS = require('express');
const MYSQL = require('mysql2/promise');
const MULTER  = require('multer')

const upload = MULTER()
const app = EXPRESS();

var connection = MYSQL.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ebuchhaltung',
  connectionLimit: 10
});

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

app.get('/', function (req, res) {
  res.send('hello world')
});

app.get('/now', async (req, res) => {
  let result = await connection.query("select now()")
  res.send(result[0]);
});

app.get('/api/dokument', async (req, res) => {
  let result = await connection.query("select id,datum,dateiname,beschreibung,status, "
      +" (select count(*) from position p where p.dokument_id=d.id) as anzahl_positionen "
      +" from dokument d order by datum desc limit 100");
  res.send(result[0]);
});
app.get('/api/dokument/:dokumentid/raw', async (req, res) => {
  let result = await connection.query("select dateiinhalt from dokument where id='"+req.params.dokumentid+"'");
  res.writeHead(200, {'Content-Type': 'application/pdf'});
  res.end(result[0][0].dateiinhalt, 'binary');
});

app.post('/api/dokument/neu',upload.single('dok'), async (req, res) => {
  const fileobj = req.file;
  let beschreibung = "";
  await connection.execute("INSERT INTO dokument(id,dateiinhalt,dateiname,datum,status,beschreibung) VALUES( ?,?,?,?,?,?)", [uuid(),fileobj.buffer,fileobj.originalname,new Date(),"entwurf",beschreibung]);
  
  //redirect back to page
  res.writeHead(307, {'Location': '/dokument.html'});
  res.send();
});

app.get('/api/dokument/:dokumentid/position', async (req, res) =>{
  let result = await connection.query("select id,version,datum,beschreibung,brutto,netto,steuer,status,dokument_id from `position` where dokument_id='"+req.params.dokumentid+"'");
  res.send(result[0]);
});

app.post('/api/dokument/:dokumentid/position', async (req, res) =>{
  await connection.execute("INSERT INTO `position`(id,version,datum,status,dokument_id) VALUES( ?,?,?,?,?)", [uuid(),1,new Date(),"entwurf",req.params.dokumentid]);
  let result = await connection.query("select id,version,datum,beschreibung,brutto,netto,steuer,status,dokument_id from `position` where dokument_id='"+req.params.dokumentid+"'");
  res.send(result[0]);
});

app.use(EXPRESS.static('portal'))

app.listen(8080);