const csv = require('csvtojson')
const https = require('https')
const csvFilePath = 'repolist'
const fs = require('fs');
const dataFile = "repodata.json";
var collectedData = [];
fs.writeFile(dataFile, '');


csv()
    .fromFile(csvFilePath)
    .on('json', (nextRepo) => {
        var url = getCommitsAPIURL(nextRepo.URL);
        var request_options = {
            host: 'api.github.com',
            headers: { 'user-agent': 'Mozilla/5.0' },
            family: 4,
            port: 443,
            path: url
        };

        var commitsData = "";
        https.get(request_options, (res) => {
            res.on('data', (info) => {
                commitsData+=info;
            });

            res.on('end', function(){
                var commits = JSON.parse(commitsData);
                var commitsD = [];
                for(c in commits){
                    commitsD.push(
                        {
                            "message":commits[c].commit.message,
                            "date":commits[c].commit.author.date,
                            "url":commits[c].html_url
                        }
                    )
                    
                }
                
                console.log(nextRepo.Name)
                console.log(commitsD)
                
                collectedData.push({
                    "name":nextRepo.Name,
                    "commits":commitsD
                });
        
                var infStr = JSON.stringify(collectedData) + "\n";
                fs.writeFile(dataFile, infStr, 'utf8');

            });

        }).on('error', (e) => {
            console.error(e);
        });

    })

function parseRepoStringForAPI(repoURL) {
    var ppp = repoURL.split("/");
    return repoParts = {
        "owner": ppp[3],
        "repo": ppp[4]
    }
}

function getCommitsAPIURL(repoURL) {
    var b = parseRepoStringForAPI(repoURL);
    return "/repos/" + b.owner + "/" + b.repo + "/commits";
}

//Test
//var b = parseRepoStringForAPI("https://github.com/Chupakabra111/Programming-3");
