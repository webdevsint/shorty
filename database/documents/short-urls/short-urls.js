const data=require('./data.json'),{nanoid:nanoid}=require("nanoid"),path=require("path"),fs=require("fs"),database=data.db;class Entry {constructor(url,id) { this.id = nanoid(); this.url = url; this.id = id;}}; const addEntry = (url,id) => { database.push(new Entry(url,id));};const removeEntry=e=>{database.splice(e,1)},save=()=>{let e={db:database};fs.writeFileSync(path.resolve(__dirname,"data.json"),JSON.stringify(e))};module.exports={database:database,addEntry:addEntry,removeEntry:removeEntry,save:save};