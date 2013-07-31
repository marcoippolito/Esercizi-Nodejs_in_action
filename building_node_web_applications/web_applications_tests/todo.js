// Define to-do database //
function Todo() {
  this.todos = [];
}
// Add a to-do item //
Todo.prototype.add = function (item) {
  if (!item) {
    throw new Error('Todo#add requires an item');
  }
  this.todos.push(item);
};
//Delete all to-do items //
Todo.prototype.deleteAll = function() {
   this.todos = [];
};
//Get count of to-do items//
Todo.prototype.getCount = function() {
  return this.todos.length;
};
// Call back with "true" after 2 secs //
Todo.prototype.doAsync = function(cb) {
  setTimeout(cb, 2000, true);
};
// Export Todo function //
module.exports = Todo;
