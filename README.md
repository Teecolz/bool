![Bool Logo](images/bool-logo.jpg)
### Code Examples
````
// Bool
fun foo(bar):
  result = 0
  for i in bar:
    if i < 5:
      result = "foobar"
    elif i > 7:
      result = "barfoo"
  ret result
````
````
// Javascript
function foo(bar) {
  var result = 0;
  for (var i = 0; i < bar; i += 1) {
    if (i < 5) {
      result = "foobar";
    } else if (i > 7) {
      result = "barfoo";
    }
  }
  return result;
}
````
