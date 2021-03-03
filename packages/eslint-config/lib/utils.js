const fs = require('fs');
const path = require('path');

const isTsProject = fs.existsSync(path.join(process.cwd(), './tsconfig.json'));

module.exports = {
  isTsProject,
};
