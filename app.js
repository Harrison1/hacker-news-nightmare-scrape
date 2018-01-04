const fs = require('fs')
const json2csv = require('json2csv')
const Nightmare = require('nightmare')
const vo = require('vo')

const newLine = '\r\n'
const fields = ['title', 'link', 'age']

const nightmare = Nightmare({ show: true })

const run = function * () {
    
    let tasks = [];
    
    for (let i = 1; i < 4; i++) {

        let task = yield nightmare.goto(`https://news.ycombinator.com/news?p=${i}`)

        .evaluate(() => {

            const hackerArray = []

            for(let i = 0; i < 30; i++) {

                let title = document.querySelectorAll('.storylink')[i].textContent
                let link = document.querySelectorAll('.storylink')[i].href
                let age = document.querySelectorAll('.age a')[i].textContent
                
                let hacker = {
                    "title": title,
                    "link": link,
                    "age": age
                }

                hackerArray.push(hacker)
            }

            return hackerArray

        })
        .then(function (result) {

            let toCsv = {
                data: result,
                fields: fields,
                hasCSVColumnTitle: false
            };

        let csv = json2csv(toCsv) + newLine;

        fs.appendFile('hacker-news.csv', csv, function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        })
    })

    .catch((error) => {
	    console.error('Search failed:', error);
	});
    
    tasks.push(task);

  }

  return tasks;

}

vo(run)(function(err, tasks) {
    console.dir(tasks);
});