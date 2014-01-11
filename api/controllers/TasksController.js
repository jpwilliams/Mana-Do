/**
 * TaskController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    'index': function(req, res) {
    	Tasks.find().done(function(err, list) {
    		res.view({
    			tasks: list,
    			stats: {
    				total: list.length,
    				awaiting: list.length
    			}
    		});

            console.log(list);
    	})
    },

    'create': function(req, res) {
    	Tasks.create(req.params.all(), function taskCreated (err, task) {
    		if (err) {
    			console.log(err);
    			req.session.flash = {
    				err: err
    			};
    		};

    		return res.redirect('/tasks');
    	});
    },

    'delete': function(req, res) {
        console.log(req.params.all());

        Tasks.destroy({id: req.param('taskID')}).done(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Task #' + req.param('taskID') + ' successfully deleted!');
                res.send({taskID: req.param('taskID')});
            }
        });
    },

    'click': function(req, res) {
        console.log(req.params.all());
        var taskStatus = 0;

        Tasks.findOne(req.param('task')).done(function(err, foundTask) {
            if (err) {
                console.log(err);
            } else {
                if (foundTask.statusId > 0) {
                    taskStatus = foundTask.statusId;
                } else {
                    taskStatus = 1;
                }
            }
        });

        if (taskStatus > 0) {
            if (taskStatus == 3) {
                taskStatus = 1;
            } else {
                taskStatus++;
            }

            Tasks.update(
                { id: req.param('task') },
                { statusId: taskStatus },
                function(err, task) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Task ' + task + ' successfully set to status ' + taskStatus);
                        res.send({ taskID: req.param('task'), status: taskStatus });
                    }
                }
            );
        }
    },

    'drop': function(req, res) {
        console.log(req.params.all());
        //should have taskID, date task was dropped on and sort index

        Tasks.findOne(req.param('taskID')).done(function(err, task) {
            if (err) {
                console.log(err);
            } else {
                if (req.param('date') != task.due) {
                    Tasks.update(
                        { id: req.param('taskID') },
                        { due: req.param('date') },
                        function (err, updatedTask) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Task ' + task + ' successfully set to due date of ' + date);
                                res.send({ taskID: req.param('taskID'), due: req.param('date')});
                            }
                        }
                    );
                }
            }
        });
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TaskController)
   */
  _config: {}
};
