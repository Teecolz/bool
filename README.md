![Bool Logo](images/bool.png)
## Introduction
Bool is an object-oriented, dynamically-typed, and strongly-typed programming language influenced by the languages of Python and OCaml. Bool comes with a plethora of benefits including the ability to be compiled to Javascript, the absence of curly braces and semi-colons, intuitive and simple readability, and so much more. Programmers everywhere are boolin' with Bool, so give it a shot, we guarantee you won't regret it.

## Features
- Compilation to Javascript
- Use of indentations instead of curly braces
- No semi-colons
- Optional type specification
- Pattern matching
- String interpolation
- List comprehensions
- First-class functions
- Higher-order functions

## Code Examples: Bool (Left) vs. Javascript (Right)
#### Variable Declarations
````
# Variable Declarations
foo:int = 101                                   var foo = 101;
bar:string = 101                                var bar = "101";
````
#### Arithmetic Expressions
````
# Arithmetic
a + b
a - b
a * b
a / b
a % b  --modulo
a ** b --exponentiation
a // b --root
````
#### Booleans and Boolean Expressions
````
# Booleans
tru
fal

# Boolean Expressions
!a
a > b
a < b
a >= b
a <= b
a == b
a != b
````
#### Loops & Conditional Statements
````
fun foo (bar):                                  var foo = function(bar) {
  result:string                                 var result;
  for i in range(bar):                          for (var i = 0; i < bar; i += 1) {
    if i < 5:                                       if (i < 5) {
      result = "foobar"                                 result = "foobar";
    elif i > 7:                                     } else if (i > 7) {
      result = "barfoo"                                 result = "barfoo";
  ret result                                        }
                                                    return result;
                                                };
````
````
while a < 99:                                   while (a < 99) {
  a += 5                                            a += 5;
                                                }
````
#### Array Comprehension
````
fun doubleEvens (array):                        var doubleEvens = function(array) {
  ret [for i in array if i % 2 === 0 i * 2]       return [for (i of array) if (i % 2 === 0) i * 2];
                                                }

````
#### Higher Order Functions
````
foods [                                                   foods [
  {name: string:'apple', kind: string:'fruit'}              {name: 'apple', kind: 'fruit'},
  {name: string:'carrot', kind: string:'vegetable'}         {name: 'carrot', kind: 'vegetable'},
  {name: string:'banana', kind: string:'fruit'}             {name: 'banana', kind: 'fruit'},
  {name: string:'broccoli', kind: string:'vegetable'}       {name: 'broccoli', kind: 'vegetable'},
  {name: string:'strawberry', kind: string:'fruit'}         {name: 'strawberry', kind: 'fruit'},  
]                                                         ]

fun fruits = foods.filter((food):               var fruits = foods.filter(function(foods) {
  ret food.kind === fruit                         return food.kind === 'fruit';    
)                                               });                

````
#### Classes
````
class Point:                                     class Point {
  constructor(x, y):                               constructor(x, y) {
    x = x                                            this.x = x;
    y = y                                            this.y = y;
                                                   }
                                                }
````
#### Comments
````
# This is a comment in Bool                      // This is a comment in Javascript

## If you need more lines, Bool can               /* If you need more lines, Javascript
   do that too. ##                                   handles it like this. */
````
## Example Programs

#### GCD Function Example
````
fun gcd (a b):                                  var gcd = function(a, b) {
    if !b:                                          if (!b) {
      ret a                                           return a;
    ret gcd(b, a % b)                               }
                                                    return gcd(b, a % b);
                                                };
````
#### Fibonacci Function Example
````
fun fibonacci (x):                              var fibonacci = function(x) {
    a:int = 0                                       var a = 0, b = 1, c;
    b:int = 1                                       if (x < 3) return 1;
    c:int                                           while (--x > 0) {
    if (x < 3):                                        c = a + b, a = b, b = c;
       ret 1                                        }
    do (x += 1):                                    return c;
       c = a + b                                };
       a = b
       b = c
    until x > 0
    ret c
````
