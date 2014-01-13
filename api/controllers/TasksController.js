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
            console.log(list);

            var length = list.length;
            var smallLength = length - 1;

            for (var i = 0; i < list.length; i++) {
                var task = list.splice(i, 1)[0];

                if (task.sortAfterId > 0) {
                    var sortAfterId = task.sortAfterId;
                    var found = false;

                    for (var index = 0; index < smallLength; index++) {
                        if (list[index].id == sortAfterId) {
                            found = index;
                            break;
                        }
                    }

                    if (typeof found == 'number') {
                        found++; //insert item one index after
                        list.splice(found, 0, task);
                    } else {
                        list.splice(smallLength, 0, task);
                    }
                } else {
                    list.splice(0, 0, task);
                }
            }

            console.log(list);

    		res.view({
    			tasks: list,
    			stats: {
    				total: list.length,
    				awaiting: list.length
    			}
    		});
    	})
    },

    'create': function(req, res) {
    	Tasks.create(req.params.all(), function taskCreated (err, task) {
    		if (err) {
    			console.log(err);
    			req.session.flash = {
    				err: err
    			};
    		}

            console.log(task);
            console.log('Returning task now...');

            return res.view({task: task, layout: null});
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
        var updates = req.param('updates');
        var length = updates.length;

        for (var i = 0; i < length; ++i) {
            console.log('Updating task #' + updates[i].id + ' to sort after task #' + updates[i].sortAfterId);

            Tasks.update(
                { id: updates[i].id },
                { sortAfterId: updates[i].sortAfterId },
                function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                    }
                }
            );
        }

        res.send({status: 'Done'});
    },

    'bySort': function(req, res) {
        console.log(req.params.all());

        Tasks.findOne({sortAfterId: req.param('taskID')}).done(function(err, task) {
            if (err) {
                console.log(err);
            } else {
                res.send({taskID: (task) ? task.id : 0});
            }
        });
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TaskController)
   */
  _config: {}
};
