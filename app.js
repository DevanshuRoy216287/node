// lodash => utility package
const _ = require("lodash")

items = [1,[2,[3,[4]]]]
newItems = _.flattenDeep(items) // makes it a flat array

console.log(newItems)