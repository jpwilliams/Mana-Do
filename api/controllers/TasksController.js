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
    		res.view({
    			tasks: list,
    			stats: {
    				total: list.length,
    				awaiting: list.length
    			}
    		})
    	});
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

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TaskController)
   */
  _config: {}
};
