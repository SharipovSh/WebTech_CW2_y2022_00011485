let { Sequelize } = require('sequelize')

let tasksDatabase = new Sequelize('Tasks', 'admin', 'admin', {
    host: 'db.dqlite3',
    dialect: 'sqlite'
})
let usersProjects = new Sequelize('Projects', 'admin', 'admin', {
    host: 'db.dqlite3',
    dialect: 'sqlite'
})

module.exports = {
    tasksDatabase,
    usersProjects
}
