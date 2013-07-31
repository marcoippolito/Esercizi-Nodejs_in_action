var assert = require('assert');
var Todo = require('./todo');
var todo = new Todo();
var testsCompleted = 0;

// Test to make sure that no to-do items remain after deletion //
function deleteTest() {
// Add some data in order to test delete//
  todo.add('Delete Me');
// Assert data was added correctly //
  assert.equal(todo.getCount(), 1, '1 item should exist');
// Delete all the records //
  todo.deleteAll();
// Assert record was deleted //
  assert.equal(todo.getCount(), 0, 'No items should exist');
// Note that test has completed //
  testsCompleted++;
}
// Test to make sure adding a to-do works fine //
function addTest() {
// Delete any existing items //
  todo.deleteAll();
// Add item //
  todo.add('Added');
// Assert that item exists //
  assert.notEqual(todo.getCount(), 0, '1 item should exist');
// Note that the test has completed //
  testsCompleted++;
}
// Test to see if the doAsync callbck is passed true //
function doAsyncTest(cb) {
// callback will fire 2 secs later //
  todo.doAsync(function(value) {
// Assert value is true //
    assert.ok(value,'Callback should be passed true');
// Note that the test has completed //
    testsCompleted++;
// Trigger callback when done //
    cb();
  });
}
// Test to see if add throws when missing a parameter //
function throwsTest(cb) {
//todo.add called with no arguments
  assert.throws(todo.add, /requires/);
// Note that test has completed //
  testsCompleted++;
}
// running the tests and reporting test completion //
deleteTest();
addTest();
throwsTest();
doAsyncTest(function() {
// Indicate completetion //
  console.log('Completed ' + testsCompleted + ' tests');
})
