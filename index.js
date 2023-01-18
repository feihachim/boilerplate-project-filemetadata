var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer=require('multer');

var app = express();

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'uploads');
  },
  filename:function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now());
  }
});
const upload=multer({ storage:storage });

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile') ,(req,res,next)=>{
  const file=req.file;
  if(!file){
    const error=new Error('Please upload a file');
    error.httpStatusCode=400;
    return next(error);
  }
  res.json({
    name:file.originalname,
    type:file.mimetype,
    size:file.size
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
