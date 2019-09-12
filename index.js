const chalk  = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const CLI  = require('clui');
const fs = require('fs');
const shell = require('shelljs');
const Spinner = CLI.Spinner;
const inquirer  = require('./lib/inquire');
const extractor = require('./lib/extractor');

let jobtitle = ""
let location = ""
let level = ""
let pageNumber = 0;
var file;
var History;

//let real_url = `https://www.indeed.com/jobs?q=${jobtitle}&l${location}&explvl=${level}&start=${pageNumber}`
var mainSpinner = new Spinner();

async function run (){
    
    let fileexists =  await fs.existsSync('./jobs.json');
    if(!fileexists){
        await shell.exec('echo {} > jobs.json');
        await shell.exec('echo {} > history.json');
    }
    fileexists =  await fs.existsSync('./history.json');
    if(!fileexists){
      await shell.exec('echo {} > history.json');
  }
    let rawdata = fs.readFileSync( __dirname +'/jobs.json'); 
    file = JSON.parse(rawdata);
    let rawdata2 = fs.readFileSync( __dirname +'/history.json'); 
    History = JSON.parse(rawdata2);
    let answers = await inquirer.extractorSettings();
    await Extraction(answers);
    let data = JSON.stringify(file);  
    let data2 = JSON.stringify(History);
    fs.writeFileSync(__dirname +'/jobs.json', data);
    fs.writeFileSync(__dirname +'/history.json', data2);
    mainSpinner.stop();
    main();
  }

  
async function Extraction(answers) {
  clear();
  if(History.hasOwnProperty("log")){ 
  }
  else{
    History.log = [];
  }
  mainSpinner.message("Getting Jobs...");
  mainSpinner.start();
  jobtitle = answers.Title;
  location = answers.Location;
  level = answers.Level;
  pageNumber = answers.Limit;
  let obj = {
    title: answers.Title,
    location: answers.Location,
    level: answers.Level,
    pageNumber: answers.Limit
  };
  History.log.push(obj);

  if(file.hasOwnProperty(location)){
  }
  else{
    file[location] = {};
  }
if( file[location].hasOwnProperty(jobtitle)){

}
else{
  file[location][jobtitle] = [];

}
  let real_url = "";
  for(let i = 0; i < pageNumber; i++){
    mainSpinner.message(`Getting Jobs from page ${i +1 }`);
    real_url = `https://www.indeed.com/jobs?q=${jobtitle}&l=${location}&explvl=${level}&start=${i}0`
    file[location][jobtitle] = await extractor.Extract(real_url,extractor.Extractor,file[location][jobtitle],extractor.Check);
  }
  mainSpinner.message(`Job Dump Completed....SAVING....`);
}  


 async function refresh() {
  clear();
  console.log(chalk.blue( figlet.textSync('Refresing', { horizontalLayout: 'full' })));
  shell.rm('jobs.json');
  shell.exec('echo {} > jobs.json');
  let answers = await inquirer.Refresh();
  if(answers.choice == "yes"){
   ReExtract();
  }
  else{
    await shell.rm('history.json');
    await shell.exec('echo {} > history.json');
    main();

  }
  
 }

async function ReExtract(){
  clear();
  mainSpinner.message("Getting Jobs...");
  mainSpinner.start();
  let rawdata2 = fs.readFileSync( __dirname +'/history.json'); 
  History = JSON.parse(rawdata2); 
  if(!History.hasOwnProperty("log")){ 
    console.log("There is no history to re-extract from..returning....");
    mainSpinner.stop();
    main();
    return;
    }
  if(History.log.length == 0){
    console.log("There is no history to re-extract from..returning....");
    mainSpinner.stop();
    main();
    return;
  }

  let rawdata = fs.readFileSync( __dirname +'/jobs.json'); 
  file = JSON.parse(rawdata);

  let real_url = "";

   for(let i = 0; i < History.log.length; i++ ){
    let answers = History.log[i];
    jobtitle = answers.title;
    location = answers.location;
    level = answers.level;
    pageNumber = answers.pageNumber;
    if(file.hasOwnProperty(location)){
    }
    else{
      file[location] = {};
    }
    if( file[location].hasOwnProperty(jobtitle)){
    }
    else{
    file[location][jobtitle] = [];
    }
    for(let i = 0; i < pageNumber; i++){
      mainSpinner.message(`Getting Jobs from page ${i +1 }`);
      real_url = `https://www.indeed.com/jobs?q=${jobtitle}&l=${location}&explvl=${level}&start=${i}0`
      file[location][jobtitle] = await extractor.Extract(real_url,extractor.Extractor,file[location][jobtitle],extractor.Check);
    }
   } 

   mainSpinner.message(`Job Dump Completed....SAVING....`);
   let data = JSON.stringify(file);
   fs.writeFileSync(__dirname +'/jobs.json', data);
   mainSpinner.stop();
   main();
}


async function main () {
    clear();
    console.log(chalk.red( figlet.textSync('JOB-O', { horizontalLayout: 'full' })));
    console.log(chalk.gray("Created By:   Ethan Campana"))
    let answers = await inquirer.MainMenu();
    if(answers.choice == "Extract" ){
      run();
    }
    else if(answers.choice == "Refresh"){
      refresh();
    }
    else{
      console.log("Bye Bye!")
    }
}



main();
