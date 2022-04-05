let express = require('express')
let app = express()
const path = require("path")

const Project = require("./routes/Project");
const page404 = require("./routes/404PAGE")
let IDgenerator = require('./IDgenerators')
var validate = require("validate.js");
const { Op } = require("sequelize");

let db = require('./database') // DATABASE
let tasksDatabase = db.tasksDatabase
let dbManager = require("./models")
tasksDatabase.sync().then(() => console.log("[ DB CONNECTED SUCCESSFULLY ]"))

app.set("view-engine", "pug");  // Middlewhere

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/project", Project);
app.use("/page-not-found", page404);

app.route('/')
    .get( async  (req, res) => {
        let projects = await dbManager.Projects.findAll() // { where: {accountID: 'user'}}

        let deadlineProjects = await dbManager.Tasks.findAll({
            where: {
                deadline: {
                    [Op.lt]: new Date().getTime()
                }
            }
        })
        
        let recentTasks = await dbManager.Tasks.findAll({
            where: {
                updatedAt: {
                    [Op.lt]: new Date(),
                }
            }
        })

        res.render("index.pug",{
            projects: projects, 
            deadlines: deadlineProjects,
            recentTasks: recentTasks
        })
    })
    .post( async (req, res) => {
        let form = req.body

        if (form.deleteProject) {
            await dbManager.Projects.destroy({where: {projectID: form.deleteProject}})
            await dbManager.Tasks.destroy({where: {projectID: form.deleteProject}})
            res.redirect('/')
        }else{
            var constraints = {
                projectTitle: {
                    presence: {allowEmpty: false},
                    length: {
                        minimum: 5,
                        message: "must be at least 5 characters"
                    }
                },
            }
            let isValid = validate({
                projectTitle: form.title
            }, constraints);
            if (isValid == undefined){
                let isExists = await (await dbManager.Projects.findAndCountAll({where: {projectTitle: form.title}})).count
                console.log(isExists);
                
                if (isExists == 0){
                    let d = new Date();
                    await dbManager.Projects.create({
                        accountID: 'user',
                        projectID: IDgenerator.ownerID(),
                        projectTitle: form.title
                    })
                    
                    res.redirect('/')
                }else{
                    res.send("<h1> Project with this title already exsits </h1> ")
                }
            }
            else{
                res.redirect('/?error=999')
            }
        }
    })
app.listen(8000)
