const express = require("express");
const { async } = require("validate.js");
const router = express.Router();

var validate = require("validate.js");
const { Op } = require("sequelize");

let db = require("../database"); // DATABASE
let tasksDatabase = db.tasksDatabase;
let dbManager = require("../models");
tasksDatabase.sync().then(() => console.log("[ DB CONNECTED SUCCESSFULLY ]"));

router.get("/:id", async (req, res) => {
  try {
    let projectID = req.params.id; // ProjectID

    let project = await dbManager.Projects.findOne({
      where: { projectID: projectID },
    }); // Finding project by its ID (projectID)

    let tasks = await dbManager.Tasks.findAll({
      where: { projectID: projectID },
    }); // Getting all the tasks with that belongs to this project

    let projectTitled =
      project.projectTitle.charAt(0).toUpperCase() +
      project.projectTitle.slice(1); // One way of capitalizing the string

    let numOFtodo = await dbManager.Tasks.findAndCountAll({
      where: {
        projectID: projectID,
        status: "1",
      },
    });

    let numOFprogress = await dbManager.Tasks.findAndCountAll({
      where: {
        projectID: projectID,
        status: "2",
      },
    });

    let numOFcompleted = await dbManager.Tasks.findAndCountAll({
      where: {
        projectID: projectID,
        status: "3",
      },
    });

    res.render("tasks.pug", {
      projectTitle: projectTitled,
      Tasks: tasks,
      numOFtodo: numOFtodo,
      numOFprogress: numOFprogress,
      numOFcompleted: numOFcompleted,
      projectID: projectID,
    });
  } catch {
    res.redirect("/page-not-found");
  }
});

router.post("/:id", async (req, res) => {
  let form = req.body;
  let projectID = req.params.id;
  console.log(form.deadline);

  // When deleting task
  if (form.delete) {
    let result = await dbManager.Tasks.destroy({
      where: {
        id: form.delete,
      },
    });
    res.redirect("/project/" + projectID);

    // Editing task title
  } else if (form.projectTitle) {
    let isExists = await (
      await dbManager.Projects.findAndCountAll({
        where: { projectTitle: form.projectTitle },
      })
    ).count;
    // Checking if task exists
    if (isExists == 0) {
      var constraints = {
        projectTitle: {
          presence: { allowEmpty: false },
          length: {
            minimum: 5,
            message: "must be at least 5 characters",
          },
        },
      };

      let isValid = validate(
        {
          projectTitle: form.projectTitle,
        },
        constraints
      );

      if (isValid == undefined) {
        await dbManager.Projects.update(
          { projectTitle: form.projectTitle },
          { where: { projectID: projectID } }
        );
        res.redirect("/project/" + projectID);
      } else {
        res.send("<h1> You violated the rules of submittion ! </h1>");
      }
    } else {
      res.send("<h1> Project with this title already exsits </h1> ");
    }

    // ADDING NEW TASK
  } else {
    var constraints = {
      taskTitle: {
        presence: { allowEmpty: false },
        length: {
          minimum: 5,
          message: "must be at least 5 characters",
        },
      },

      taskText: {
        presence: { allowEmpty: false },
        length: {
          minimum: 10,
          message: "must be at least 10 characters",
        },
      },

      // YOU CAN ALSO ENABLE THIS FOLLOWING LINES OF CODES TO VALIDATE TASK STATUS

      // taskStatus: {
      //     presence: {allowEmpty: false},
      //     numericality: {
      //       onlyInteger: true,
      //       greaterThan: 0,
      //       lessThanOrEqualTo: 3,
      //       notEven: "must be between 0 and 3"
      //     }
      // },

      taskDeadline: {
        presence: { allowEmpty: false },
      },
    };

    let isDate = validate.isDate(new Date(form.deadline));
    let isValid = validate(
      {
        taskTitle: form.taskTitle,
        taskText: form.taskText,
        taskDeadline: form.deadline,
      },
      constraints
    );

    if (isValid == undefined) {
      let d = new Date();
      if (form.taskStatus == null) {
        await dbManager.Tasks.create({
          projectID: projectID,
          ownerID: "admin",
          title: form.taskTitle,
          text: form.taskText,
          status: "1",
          startDate: new Date().toISOString().slice(0, 10),
          deadline: form.deadline,
          date: "02-02-2002",
        });
        res.redirect("/project/" + projectID);
      } else {
        await dbManager.Tasks.create({
          projectID: projectID,
          ownerID: "admin",
          title: form.taskTitle,
          text: form.taskText,
          status: form.taskStatus,
          startDate: new Date().toISOString().slice(0, 10),
          deadline: form.deadline,
          date: "02-02-2002",
        });
        res.redirect("/project/" + projectID);
      }
    } else {
      res.send("<h1> You violated the rules of submittion ! </h1>");
    }
  }
});

router.get("/:id/task/:taskID", async (req, res) => {
  try {
    let projectID = req.params.id;
    let taskID = req.params.taskID;
    let project = await dbManager.Projects.findOne({
      where: { projectID: projectID },
    });
    let projects = await dbManager.Projects.findAll({
      attributes: ["projectID", "projectTitle"],
    });

    let task = await dbManager.Tasks.findOne({
      where: {
        id: taskID,
        projectID: projectID,
      },
    });
    if (task == null) {
      res.redirect("/page-not-found");
    } else {
      res.render("viewTask.pug", {
        task: task,
        project: project,
        projects: projects,
      });
    }
  } catch {
    res.redirect("/page-not-found");
  }
});

router.post("/:id/task/:taskID", async (req, res) => {
    let form = req.body;

    let projectID = req.params.id;
    let taskID = req.params.taskID;

  // Checking if task exists
    var constraints = {
        taskTitle: {
        presence: { allowEmpty: false },
        length: {
            minimum: 5,
            message: "must be at least 5 characters",
        },
        },
    };

    let isValid = validate(
        {
        taskTitle: form.title,
        },
        constraints
    );

    if (isValid == undefined) {
        await dbManager.Tasks.update(
        {
            projectID: form.owner,
            title: form.title,
            text: form.taskText,
            status: form.taskStatus,
            deadline: form.deadline,
        },
        {
            where: {
            id: taskID,
            projectID: projectID,
            },
        }
        );
        if (form.owner == undefined) {
        res.redirect("/project/" + projectID + "/task/" + taskID);
        } else {
        res.redirect("/project/" + form.owner + "/task/" + taskID);
        }
    } else {
        res.send("<h1> You violated the rules of submittion ! </h1>");
    }
});
module.exports = router;
