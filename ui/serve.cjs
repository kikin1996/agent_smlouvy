const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.pdf':'application/pdf','.doc':'application/msword','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
http.createServer((req,res)=>{
 let file;try{const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);file=path.resolve(root,'.'+(pathname==='/'?'/ui/index.html':pathname));}catch{res.writeHead(400);return res.end();}
 if(!file.startsWith(root+path.sep)||file.split(path.sep).some(s=>s.startsWith('.'))){res.writeHead(403);return res.end();}
 fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});fs.createReadStream(file).pipe(res);});
}).listen(8765,'127.0.0.1',()=>console.log('http://127.0.0.1:8765/ui/'));
