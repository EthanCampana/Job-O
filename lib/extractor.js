const osmosis = require('osmosis')

module.exports ={
        "Extractor" : async function Extractor(url) {
            return new Promise((resolve, reject) => {
                let response = [];
               osmosis
                    // Load upcoming music page
                    .get(url)
                    // Find the first music table and all of its tr elements
                    .find('div.jobsearch-SerpJobCard')
                    // Construct an object containing release date and its relevant releases
                    .set({
                        // Get the release date (if relevant)
                        name: 'div.title a@title',
                        link: 'div.title a@href',
                        location: 'div.sjcl div@data-rc-loc',
                        company: 'div.sjcl div span.company',
                        summary: 'div.summary',
                        isEasyApply: 'div.iaWrapper div span.iaLabel'
        
                        // For every release on this date create an array
                    })
                    // Transform our flat data into a tree like structure by creating a nested object
                           // Push post into an array
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
                 if(results[i].company == 'Indeed Prime'){
                    skipped++;
                    continue;
                 }

                 arr.push(results[i]);
                }
            console.log(`Dumped: ${dumped} Skipped: ${skipped} TotalJobs: ${dumped - skipped}`)
            return arr;
        }
            
}
