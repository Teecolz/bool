![Bool Logo](images/bool.png)
## Introduction
Bool is an object-oriented, dynamically typed, and strongly-typed programming language influenced by the languages of Python and OCaml. Bool comes with a plethora of benefits including the ability to be compiled to Javascript, the absence of curly braces and semi-colons, intuitive and simple readability, and so much more. Bool's simple, easy to learn syntax emphasizes readability and therefore reduces the cost of program maintenance.

Often, programmers will fall in love with Bool because of its similarity to Python and the productivity it provides. The original reason we decided to create Bool was to create a language that would allow programmers to have a similar "out-of-the-box," "plug-and-play" coding experience that each of us liked about Python. To make it more user-friendly, we decided to combine the safety and power of another favorite language, OCaml. The pattern-matching aspect of OCaml is a really intuitive way of programming and with its compile-time analysis of programs, this rules out many programming errors. More precisely, this protects the integrity of the data manipulated by an OCaml program.

For Bool, security is a high concern, and so we tried to adopt many of the same things that worked for the two parent languages that ensure some degree of protection and help for the programmer.

Feel free to check out [Bool's homepage](https://teecolz.github.io/bool/)to view code examples, syntax diagrams, and semantic error messages.

## Features
- Compilation to Javascript
- Use of indentations instead of curly braces
- No semi-colons
- Optional type specification
- String interpolation
- List comprehensions
- First-class functions
- Higher-order functions

## Code Examples: Bool (Left) vs. Javascript (Right)
#### Variable Declarations
````
# Variable Declarations
let foo:int = 101                               var foo = 101;
let bar:string = 101                            var bar = "101";
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
  let result:string                             var result;
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
foods [                                       foods [
  {name: 'apple', kind: 'fruit'}                {name: 'apple', kind: 'fruit'},
  {name: 'carrot', kind: 'veg'}                 {name: 'carrot', kind: 'veg'},
  {name: 'banana', kind: 'fruit'}               {name: 'banana', kind: 'fruit'},
  {name: 'broccoli', kind: 'veg'}               {name: 'broccoli', kind: 'veg'},
  {name: 'strawberry', kind: 'fruit'}           {
]                                                 name: 'strawberry',
                                                  kind:'fruit'
                                                },
                                              ];                                         

fun fruits = foods.filter((food):               var fruits = foods.filter(function(foods) {
  ret food.kind === fruit                         return food.kind === 'fruit';    
)                                               });                

````
#### Classes
````
class Point:                                     class Point {
  build (_x _y) :                                  constructor(x, y) {
    _x = _x                                           this.x = x;
    _y = _y                                           this.y = y;
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
    let a:int = 0                                  var a = 0, b = 1, c;
    let b:int = 1                                  if (x < 3) return 1;
    let c:int                                      while (--x > 0) {
    if (x < 3):                                       c = a + b, a = b, b = c;
       ret 1                                       }
    while x > 0:                                    return c;
       c = a + b                                };
       a = b
       b = c
       x += 1
    ret c
````
