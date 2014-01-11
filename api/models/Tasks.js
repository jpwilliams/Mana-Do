/**
 * Task
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
  	name: {
  		type: 'string',
  		required: true
  	},

  	userAssignedId: {
  		type: 'int'
  	},

  	listId: {
  		type: 'int'
  	},

  	statusId: {
  		type: 'int',
      defaultsTo: 1
  	},

    due: {
      type: 'date'
    },

    sortAfterId: {
      type: 'int'
    }
  }
};
