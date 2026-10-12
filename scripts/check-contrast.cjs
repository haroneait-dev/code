const path=require("node:path");
process.chdir(path.resolve(__dirname,".."));
const fs=require('node:fs'),assert=require('node:assert/strict');
const css=fs.readFileSync('app/globals.css','utf8');
const luminance=channels=>channels.map(v=>v/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[0.2126,0.7152,0.0722][i],0);
const contrast=(a,b)=>{const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (values[0]+.05)/(values[1]+.05)};
const result=[];
for(const theme of [':root','.dark']){
 const block=css.slice(css.indexOf(theme+' {')).split('}')[0];const tokens=Object.fromEntries([...block.matchAll(/--c-([a-z-]+): (\d+) (\d+) (\d+);/g)].map(m=>[m[1],m.slice(2).map(Number)]));
 const pairs=[['on-surface','surface'],['on-surface-variant','surface'],['primary','surface'],['tertiary','surface'],['on-primary','primary'],['on-primary-container','primary-container'],['on-primary-fixed','mark'],['on-tertiary-container','tertiary-container'],['on-secondary-container','secondary-container'],['error','surface']];
 for(const [fg,bg]of pairs){const ratio=contrast(tokens[fg],tokens[bg]);assert(ratio>=4.5,`${theme} ${fg}/${bg}: ${ratio}`);result.push({theme,foreground:fg,background:bg,ratio:Number(ratio.toFixed(2))});}
}
fs.writeFileSync('docs/captures/contrastes-jetons.json',JSON.stringify(result,null,2));console.log('20 paires de couleurs de texte : contraste AA (≥ 4,5:1).');
