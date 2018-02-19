/**
 * SearchPrController
 *
 * @description :: Server-side logic for managing searchprs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const _ = require('lodash');
const githubSearch = require('../services/GithubSearch');

module.exports = {
    prSearch: async function (req, res) {
        const request = _.get(req, 'body', {});
        const users = _.get(request, 'users', {});
        const dateRange = _.get(request, 'dateRange', {});
        const status = _.get(request, 'status', {});

        const results = await githubSearch.prsSearch(users, dateRange, status);
        return res.json(results);
    },
};

