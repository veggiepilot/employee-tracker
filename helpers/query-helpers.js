const db = require('../db/connection');
const cTable = require('console.table');

class Queries {
    constructor () {

    }

    getDepartments() {
        db.query(`SELECT * FROM department`, (err, results) => {
            console.table(results);
        });
    }
}

const getDepartmentsData = new Queries().getDepartments;
// console.log(getDepartmentsData);
// const getDepartmentsData = new Queries.getDepartments();
// console.log(getDepartmentsData);

    // const getDepartments = db.query(`SELECT * FROM department`, (err, results) => {
    //     console.log(results);
    // });

    // console.log(getDepartments);

module.exports = getDepartmentsData;