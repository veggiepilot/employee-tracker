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
                    addEmployeePrompt();
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
let roles = [];
let managers = [ {name: 'None', value: 'NULL'} ];

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
    db.query(`SELECT id, name FROM department`, (err, results) => {
        results.forEach(e => {
            depts.push({name: e.name, value: e.id});
        })
        console.log(depts);
    })
};

const rolesListing = () => {
    db.query(`SELECT id, title FROM role`, (err, results) => {
        results.forEach(e => {
            roles.push({name: e.title, value: e.id});
        })
    })
};


const managersListing = () => {
    db.query(`SELECT id,
    concat(employee.first_name, ' ', employee.last_name) AS name
    FROM employee`, (err, results) => {
        results.forEach(e => {
            managers.push({name: e.name, value: e.id});
        })
    })
};

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
    
];

const employeePrompt = [
    {
        type: 'input',
        name: 'first_name',
        message: `What is the employee's first name?`
    },
    {
        type: 'input',
        name: 'last_name',
        message: `What is the employee's last name?`
    },
    {
        type: 'list',
        name: 'role',
        message: `What is the employee's role?`,
        choices: roles
    }, 
    {
        type: 'list',
        name: 'manager',
        message: `Who is the employee's manager?`,
        choices: managers
    }
];

function addRolePrompt() {
    deptListing();
    inquirer.prompt(rolePrompt).then(answers => {
        if (answers) {
            // Adding role to the database
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answers.name}', '${answers.salary}', '${answers.department}')`, (err, results) => {
                console.log(`Added ${answers.name} to the database`)
            })  
            prompts();
        }
    })
};

function addEmployeePrompt() {
    rolesListing();
    managersListing();
    inquirer.prompt(employeePrompt).then(answers => {
        if (answers) {
            // Adding role to the database
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}', '${answers.last_name}', ${answers.role}, ${answers.manager})`, (err, results) => {
                console.log(`Added ${answers.first_name} ${answers.last_name} to the database`);
            })  
            prompts();
        }
    })
};


//UPDATE
    // Update Employee Role
        // Which employee's role do you want to update?
            //Show all employees
        // Which role do you want to assign the selected employee?
            //Show all roles
    
prompts();

    