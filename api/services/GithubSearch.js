const github = require('octonode');
const _ = require('lodash');

const CLIENT_ACCESS_TOKEN = '9dbfd48ea30d2ee0c84c3410fe878a02fa0cdb35';

const client = github.client(CLIENT_ACCESS_TOKEN);

const tajawalSearch = client.search();

const handleResponse = (error, data) => {
    return new Promise((resolve, reject) => {
        resolve(data);
    });
};


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
            if (error) {
                reject(error);
            }
        });
    })
};


// status: open | merged | closed
const prsSearch = async (users = {}, dateRange = {}, status = 'open') => {
    return await getPrs(users, dateRange, status);
};
// role: author | assignee | reviewed-by | review-requested | commenter | mentions
const getUsers = (users, role = 'author') => {
    let usersStr = '';
    if (users.length > 0) {
        for (let i = 0; i < users.length; i += 1) {
            usersStr += `${role}:${users[i]} `;
        }
    }
    return usersStr;
};

// type: created | merged | updated
const getDateRange = (dateRange) => {
    let dateStr = '';
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

//prsSearch(['mohammedelkady', 'ibrahim-sakr'], { from: '2018-01-01', to: '2018-01-30' }, 'open');

module.exports = { prsSearch };