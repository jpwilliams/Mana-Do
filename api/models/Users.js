/**
 * Users
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

  	email: {
  		type: 'string',
  		email: true,
  		required: true,
  		unique: true
  	},

  	password: {
  		type: 'string',
  		required: true
  	},

  	groupId: {
  		type: 'int'
  	}
  }

};
