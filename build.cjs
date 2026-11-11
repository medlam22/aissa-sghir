const fs=require('node:fs');
const path=require('node:path');
const output=path.join(__dirname,'dist');
fs.mkdirSync(output,{recursive:true});
for(const name of ['index.html','pedagogie.html','recherche.html','style.css','academic-theme.css','script.js','data.js','favicon.svg','assets','documents']){
 fs.cpSync(path.join(__dirname,name),path.join(output,name),{recursive:true});
}
console.log('Static site built in dist: 3 pages, portrait, teaching documents.');
