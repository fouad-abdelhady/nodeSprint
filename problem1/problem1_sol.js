const {readFile, writeFile} = require('fs/promises');

async function begin(){
    readFile('./problem1.json', {encoding:"utf8"})
    .then(readFileData)
    .then(addWeightToFluffy)
    .then(correctFluffyName)
    .then(listCatFriendsActivities)
    .then(printCatFriendsNames)
    .then(printTotalWeightOfFriends)
    .then(printTotalActivitesOfFriends)
    .then(addMoreActivities)
    .then(updateBarFurColor)
    .then(finalMessege);
}
function readFileData(content){
    console.log();
    console.log("1 - The content of problem1.json");
    console.log(content);
    console.log();
    return content;
}
async function addWeightToFluffy(content){
    content = JSON.parse(content);
    content.weight = 6;
    content.height = 20;
    writeOutput('weightOutput', content)
    return content;
}
function correctFluffyName(content){
    content.name = "Fluffyy";
    writeOutput('nameCorrectionOutput', content);
    return content;
}
function listCatFriendsActivities(content){
    console.log(`4 - ${content.name}'s friends activities :- `);
    for(let friend of content.catFriends) 
        console.log(friend.name,friend.activities);
    console.log();
    return content;
}
function printCatFriendsNames(content){
    console.log(`5 - Cate friends names are :-`);
    for(let friend of content.catFriends) 
        console.log(friend.name);
    console.log();
    return content;
}
function printTotalWeightOfFriends(content){
    let totalWeight = 0
    for(let friend of content.catFriends) 
        totalWeight += friend.weight;
    console.log(`6 - Cat Friends total weight is:`, totalWeight);
    console.log();
    return content;
}
function printTotalActivitesOfFriends(content){
    let totalActivities = 0;
    console.log("7 - The total activities of Cat Friends: ");
    for(let friend of content.catFriends){
        console.log(friend.name);
        for(let activity of friend.activities){
            console.log('- ',activity);
            totalActivities++;
        }
    }
    console.log("The total activities of Cat Friends: ", totalActivities);
    console.log();
    return content;
}
function addMoreActivities(content){
    let [bar,foo] = content.catFriends;
    bar.activities.push('Playing with String Ball');
    bar.activities.push('Chasing Rats');
    foo.activities.push('Running around');
    foo.activities.push('Playing with shoes');
    writeOutput('moreActivitiesOutput', content);
    return content;
}
function updateBarFurColor(content){
    let [bar] = content.catFriends;
    bar.furcolor = "Brown";
    writeOutput('barColorOutput', content);
}
function finalMessege(content){
    console.log("********************* Important *********************");
    console.log("The rest of the output in the file .\output");
    console.log("*****************************************************");
}
async function writeOutput(fileName, content){
    await writeFile(`./output/${fileName}.json`, JSON.stringify(content));
}
begin();