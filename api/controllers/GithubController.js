/**
 * GithubController
 *
 * @description :: Server-side logic for managing searchprs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const _ = require('lodash');
const github = require('octonode');
const moment = require('moment');
const { GithubSearch } = require('../services/GithubSearch');
const constants = require('../constants/constants');

module.exports = {
    search: async function (req, res) {
        const request = _.get(req, 'body', {});
        const users = _.get(request, 'users', {});
        const dateRange = _.get(request, 'dateRange', {});
        const status = _.get(request, 'status', {});
        let results = [];
        const errors = this.validate(request);

        if (_.isEmpty(errors)) {
            const client = github.client(sails.config.statos.githubAccessToken);
            const githubSearch = new GithubSearch(client);
            results = await githubSearch.searchPrs(users, dateRange, status);
        }

        return res.json({ results, errors });
    },
    validate: (request) => {
        const users = _.get(request, 'users', {});
        const {usersArray, role:userRole} = users;
        const dateRange = _.get(request, 'dateRange', {});
        const {from:dateFrom, to:dateTo, type:dateRangeFilter} = dateRange;
        const status = _.get(request, 'status', {});
        const roles = Object.values(constants.GITHUB.ROLES);
        const prsStatuses = Object.values(constants.GITHUB.PR_STATUSES);
        const dateRangeFilters = Object.values(constants.GITHUB.DATE_RANGE_FILTERS);
        const errors = [];

        if (_.isEmpty(users)) {
            errors.push('users object is missing');
        }

        if (_.isEmpty(usersArray)) {
            errors.push('users is missing');
        }

        if (roles.indexOf(userRole) === -1) {
            errors.push('invalid role');
        }

        if (_.isEmpty(dateRange)) {
            errors.push('date range object is missing');
        }

        if (moment(dateTo).diff(moment(dateFrom)) <= 0) {
            errors.push('date from should be greater than date to');
        }

        if (dateRangeFilters.indexOf(dateRangeFilter) === -1) {
            errors.push('invalid date range filter');
        }

        if (_.isEmpty(status)) {
            errors.push('status is missing');
        }

        if (prsStatuses.indexOf(status) === -1) {
            errors.push('invalid status');
        }

        return errors;
    }
};

