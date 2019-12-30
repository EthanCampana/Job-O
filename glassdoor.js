const osmosis = require('osmosis')
let url = 'https://www.monster.com/jobs/search/?q=Software&where=New%20York&stpage=1&page=1'
let results = [];
let errr = 0;
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
    .data(item => console.log(item))
    .error(err => errr+=1, console.log(err));
    
// let url2 = 'https://www.glassdoor.com/job-listing/senior-it-support-specialist-priceline-com-JV_IC1132348_KO0,28_KE29,42.htm?jl=3329725832&ctt=1568829264402'
// osmosis 
//     .get(url2)
//     .set({
//         des: 'title'
//     })
//     .data(item => console.log(