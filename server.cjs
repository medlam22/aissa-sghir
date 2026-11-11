const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpeg':'image/jpeg','.pdf':'application/pdf'};
const port=Number(process.env.PORT||3000);
http.createServer((req,res)=>{
 let requested;
 try {requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400);res.end('Invalid URL');return;}
 if(requested==='/')requested='/index.html';
 if(!path.extname(requested))requested+='.html';
 const file=path.resolve(root,'.'+requested);
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
 fs.stat(file,(error,stat)=>{
  if(error||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':stat.size});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(file).pipe(res);
 });
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://localhost:${port}`));
