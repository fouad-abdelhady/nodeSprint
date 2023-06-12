const {readFile, writeFile} = require('fs/promises');
const moment = require('moment');

function begin(){
    readFile('./problem2.json', {encoding:'utf8'})
    .then(changeDateFormat)
    .then(writeOutput);
}
function changeDateFormat(data){
    data = JSON.parse(data);
    let newFormatedDate;
    for(let accident of data.accidents){
        newFormatedDate = moment(accident.date, 'MM/DD/YYYY').format('YYYY-MM-DD');
        accident.date = newFormatedDate;
    }
    return data;
}
function writeOutput(data){
    writeFile('./output/output2.json', JSON.stringify(data));
}
begin();