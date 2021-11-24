const cTable = require('console.table');
const db = require('./db/connection');

const inquirer = require('inquirer');

const prompts = () => {inquirer
    .prompt([
        {
            type: 'list',
            name: 'prompt',
            message: 'What would you like to do?', 
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ]
        }
    ])
    .then(answers => {
        if (answers) {
            switch(answers.prompt) {
                // View all employees
                case 'View All Employees':
                    db.query(`SELECT 
                    employee.id,
                    employee.first_name, 
                    employee.last_name,
                    role.title AS title, 
                    department.name AS department, 
                    role.salary AS salary, 
                    concat(manager.first_name, ' ', manager.last_name) AS manager
                    FROM employee
                    JOIN role 
                    ON employee.role_id = role.id 
                    JOIN department ON
                    role.department_id = department.id
                    LEFT JOIN employee manager
                    ON employee.manager_id = manager.id
                    ORDER BY employee.id ASC`, 
                    (err, results) => {
                        console.table(results);
                        prompts();
                    });    
                break;
                case 'Add Employee':
                console.log(answers.prompt)
                break;
                case 'Update Employee Role':
                console.log(answers.prompt)
                break;
                // View All roles
                case 'View All Roles':
                    db.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id ORDER BY role.id`, (err, results) => {
                        console.table(results);
                        prompts();
                    });
                break;
                case 'Add Role':
                    addRolePrompt();
                break;
                // View All Departments 
                case 'View All Departments':
                    getDepartments();
                break;
                case 'Add Department':
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'prompt',
                                message: 'What is the name of the department?'
                            }
                        ])
                        .then(answers => {
                            if (answers) {
                                // Adding department to the database
                                db.query(`INSERT INTO department (name) VALUES ('${answers.prompt}');`)
                                console.log(`Added ${answers.prompt} to the database`)
                                prompts();
                            }
                        })
                break;
                case 'Quit':
                process.exit;
                console.log(answers.prompt)
                break;
            }
        }
    })
};

let depts = [];

const getDepartments =  () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.table(results);
             prompts();
        }  
    })
}
const deptListing =  () => {
    db.query(`SELECT name FROM department`, (err, results) => {
        results.forEach(e => {
            depts.push(e.name);
        })
    })
}

const rolePrompt = [
    
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of the role?'
    }, 
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?'
    },
    {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?', 
        choices: depts
    }
    
]
function getDeptId(data) {
    db.query(`SELECT id FROM department WHERE name = "${data.department}"`, (err, results) => {
        return results[0].id;
    });
}

function addRolePrompt() {
    deptListing();
    inquirer.prompt(rolePrompt).then(answers => {
        console.log(answers);
        if (answers) {
            getDeptId(answers);

            db.query(`SELECT id FROM department WHERE name = "${answers.department}"`, (err, results) => {
                id = results[0].id;
            });
            // Adding role to the database
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answers.name}', '${answers.salary}', '${id}')`, (err, results) => {
                console.log(`Added ${answers.name} to the database`)
            })
           
            // prompts();
        }
    })
};



    
//CREATE
    // Add employee 
        // What is the employee's first name?
        // What is the employee's last name?
        // What is the employee's role?
            //Show all roles to choose from
        // Who is the employee's manager?
            // Show all employees including none option
        // added <employee> to the database

    // Add a role
        // What is the name of the role?
        // What is the salary of the role?
        // Which department does the roll belong to?
        // Show all the choices of the departments to choose from?
        // Added <role> to the database

//UPDATE
    // Update Employee Role
        // Which employee's role do you want to update?
            //Show all employees
        // Which role do you want to assign the selected employee?
            //Show all roles
    
prompts();

    