const github = require('octonode');
const _ = require('lodash');

const client = github.client(sails.config.statos.githubAccessToken);

const tajawalSearch = client.search();


/**
 *
 * @param users
 * @param dateRange
 * @param status open | merged | closed
 * @returns {Promise}
 */
const getPrs = (users = {}, dateRange = {}, status = 'open') => {
    return new Promise((resolve, reject) => {
        const { role, usersArray } = users;
        const usersStr = getUsers(usersArray, role);
        const dateStr = getDateRange(dateRange);
        tajawalSearch.issues({
            q: `user:tajawal type:pr is:${status} ${usersStr} ${dateStr}`,
            sort: 'created',
            order: 'asc'
        }, (error, data) => {
            resolve(data);
        });
    })
};


/**
 *
 * @param users
 * @param dateRange
 * @param status open | merged | closed
 * @returns {Promise.<*>}
 */
const searchPrs = async (users = {}, dateRange = {}, status = 'open') => {
    return await getPrs(users, dateRange, status);
};


/**
 *
 * @param users
 * @param role author | assignee | reviewed-by | review-requested | commenter | mentions
 * @returns {string}
 */
const getUsers = (users, role = 'author') => {
    let usersStr = '';
    if (users.length > 0) {
        for (let i = 0; i < users.length; i += 1) {
            usersStr += `${role}:${users[i]} `;
        }
    }
    return usersStr;
};

/**
 *
 * @param dateRange
 * @returns {string}
 */
const getDateRange = (dateRange) => {
    let dateStr = '';
    // type: created | merged | updated
    const { type, from, to } = dateRange;

    if (!_.isEmpty(from) && !_.isEmpty(to)) {
        dateStr = `${type}:${from}..${to}`;
    } else if (!_.isEmpty(from)) {
        dateStr = `${type}:>=${from}`;
    } else if (!_.isEmpty(to)) {
        dateStr = `${type}:<=${to}`;
    }
    return dateStr;
};

module.exports = { searchPrs };