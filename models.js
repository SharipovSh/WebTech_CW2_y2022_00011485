let { DataTypes } = require('sequelize')

let db = require('./database')

let tasksDatabase = db.tasksDatabase

let Tasks = tasksDatabase.define('Tasks', {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    projectID: {
        type: DataTypes.STRING,
    },
    title: {
        type: DataTypes.STRING,
    },
    text: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    startDate: {
        type: DataTypes.DATE,
        defaultValue: '04/04/2010'
    },
    deadline: {
        type: DataTypes.DATE,
        defaultValue: '04/04/2022'
    },
    date: {
        type: DataTypes.DATE
    }
},{
    tableName: 'Tasks'
})

let Projects = tasksDatabase.define('Projects',{
    projectID: {
        type: DataTypes.STRING,
    },
    projectTitle:{
        type: DataTypes.STRING,
    }
},{
    tableName: 'Projects'
})

module.exports = {Tasks, Projects}
