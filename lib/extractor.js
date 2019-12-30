const osmosis = require('osmosis')

module.exports ={
        "MonsterExtractor": async (url) => {
            return new Promise((resolve, reject)=>{
                let results = [];
                let errors = 0;
                osmosis
                    .get(url)
                    .find('div#SearchResults section.card-content')
                    .set({
                        jobname: 'h2.title a',
                        postdate: 'div.meta.flex-col time',
                        url: 'h2.title a@href',
                        company: 'div.company span.name'
                    })
                    .follow('h2.title a@href')
                    .set({
                        location:'h2.subtitle', 
                        content: 'div.details-content'
                    })
                    .data(item => results.push(item))
                    .error(err => errors+=1)
                    .done(() => resolve(results));

            });
        },
        
        "Extractor" : async function Extractor(url) {
            return new Promise((resolve, reject) => {
                let response = [];
               osmosis
        
                    .get(url)
                    
                    .find('div.jobsearch-SerpJobCard')
           
                    .set({
            
                        name: 'div.title a@title',
                        link: 'div.title a@href',
                        location: 'div.sjcl div@data-rc-loc',
                        company: 'div.sjcl div span.company',
                        summary: 'div.summary',
                        isEasyApply: 'div.iaWrapper div span.iaLabel'
        
                    })
                    .data(res => response.push(res))
                    .error(err => reject(err))
                    .done(() => resolve(response));
                   });
                },
        "Check": (arr,item) => {
            try{
                let index = arr.findIndex((value,index,array) => {return value.link === item.link})
                let index2 = arr.findIndex((value,index,array) => {return value.company === item.name})
                if(index > -1){
                    return true;}
                if(index2 > -1){
                    return true;
                }
                return false;
            }
            catch(e){
                console.log(e);
                return false;
            }
           
        },
        
        "Extract": async (url,Extractor, arr, check) => {
            let dumped = 0;
            let skipped = 0;
            let results = await Extractor(url);
            for(let i = 0; i < results.length; i++){
                if(results[i].hasOwnProperty('isEasyApply')){
                    results[i].isEasyApply = true;
                }else{ results[i].isEasyApply = false;}
                results[i].link = 'http://indeed.com' + results[i].link;
                dumped++;
                if(check(arr, results[i])){
                    skipped++;
                    continue;
                 }
                 if(results[i].company == 'Indeed Prime' || results[i].company == 'Seen'|| results[i].company == 'Seen by Indeed'){
                    skipped++;
                    continue;
                 }

                 arr.push(results[i]);
                }
            console.log(`Dumped: ${dumped} Skipped: ${skipped} TotalJobs: ${dumped - skipped}`)
            return arr;
            },

            
        "MonsterExtract": async (url, Extractor, arr) => {
            let dumped = 0;
            let res = await Extractor(url);
            for(let i = 0; i < res.length; i++){
                dumped++;
                arr.push(res[i]);
            }
            console.log(`Dumped: ${dumped}`)
            return arr;
        },
            
}
