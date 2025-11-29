const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Manager',
        email: 'manager@gmail.com',
        password: 'manager123',
        role: 'manager',
        employeeId: 'MGR001',
        department: 'Management',
    },
    {
        name: 'pavankumar',
        email: 'pavankumar@gmail.com',
        password: 'pavankumar123',
        role: 'employee',
        employeeId: 'EMP001',
        department: 'Engineering',
    },
    {
        name: 'S Pavan',
        email: 'pavan@gmail.com',
        password: 'pavan123',
        role: 'employee',
        employeeId: 'EMP002',
        department: 'HR',
    },
];

module.exports = users;
