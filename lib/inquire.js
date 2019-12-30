const inquirer = require('inquirer');

module.exports = {
    "MainMenu": async () => {
        const question = [
            {
                name: 'choice',
                type: 'list',
                message: "Choose an option",
                choices: ["Extract","Refresh","Exit"]

            }
        ]
        return inquirer.prompt(question);

    },

    "targetSite": async () => {
        const question = [
            {
                name: 'website',
                type: 'list',
                message: "Which Website would you like to extract jobs from??",
                choices:["Indeed","Monster"]

            }
        ]

        return inquirer.prompt(question);
    },
    "Refresh": async () => {
        const question = [
            {
                name: 'choice',
                type: 'list',
                message: "Would you like to Re-Extract based on your history? *If not history will be refreshed as well.",
                choices:["yes","no"]

            }
           


        ]

        return inquirer.prompt(question);
    },
    "monsterSettings": async () => {
        const questions = [
            {
                name: 'Title',
                type: 'input',
                message: "Enter the Job Title:",
                validate: function(value){
                    if(value.length){
                        return true;
                    } else{ return 'Please enter a job title.'; }
                }
            },
            {
                name: 'Location',
                type: 'input',
                message: "Enter a City, State or Zip:",
                validate: function(value){
                    if(value.length){
                        return true;
                    } else{ return 'Please enter a location.'; }
                }
            },
            {
                name: "Limit",
                type: 'list',
                message: "How many pages would you like to scrape?",
                choices: [1,2,3,4,5]
            }
            ];
            return inquirer.prompt(questions);
    },
    "extractorSettings" : async () => {
        const questions = [
        {
            name: 'Title',
            type: 'input',
            message: "Enter the Job Title:",
            validate: function(value){
                if(value.length){
                    return true;
                } else{ return 'Please enter a job title.'; }
            }
        },
        {
            name: 'Location',
            type: 'input',
            message: "Enter a City, State or Zip:",
            validate: function(value){
                if(value.length){
                    return true;
                } else{ return 'Please enter a location.'; }
            }
        },
        {
            name: "Level",
            type: 'list',
            message: "What level of job are you looking for?",
            choices: ["entry_level", "mid_level","senior_level"]

        },
        {
            name: "Limit",
            type: 'list',
            message: "How many pages would you like to scrape?",
            choices: [1,2,3,4,5]
        }
        ];
        return inquirer.prompt(questions);
    },


}