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
let y = tru                                     var y = true;
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
fun tricky (a b c):                     let tricky = (a, b, c) => {
  ret c(a)(b)                             return c(a)(b);
fun add2 (a):                           };
  fun add1(b):                          let add2 = (a) => {
    ret a + b                              let add1 = (b) => {
  ret add1                                   return (a + b);
let sum:int = tricky(1 2 add2)             };
                                           return add1;
                                        };
                                        let sum = tricky(1, 2, add2);
````
#### Classes
````

class Person:                                                    class Person {
  build (_nameFirst _nameLast _age)                                 constructor(nameFirst, nameLast, age) {
                                                                        this.nameFirst = nameFirst;
class Fam isa Person:                                                   this.nameLast = nameLast;
  build (_nameFirst _nameLast _age):                                    this.age = age;
    _affiliation = "blood"                                          }
  cap (foo:PoliceMan):                                            }
    fun bopim (numBops):
      for bop in range(numBops):                                  class Fam extends Person {
        print(_nameFirst + (" bopped " + (foo.nameFirst              constructor(nameFirst, nameLast, age) {
          + (" " + (foo.nameLast + (" "                                 this.nameFirst = nameFirst;
          + (bop + (" times"))))))))                                    this.nameLast = nameLast;
    ret bopim                                                           this.age = age;
class PoliceMan isa Person:                                             this.affiliation = "blood";
  build (_nameFirst _nameLast _age):                                 }
    _affiliation = "twelvy"                                          cap(foo) {
  woopwoop ():                                                         let bopim = (numBops) => {
    ret "Time to narc"                                                     for (let bop = 0; bop < numBops; bop += 1) {
                                                                               console.log((this.nameFirst + (" bopped " + (foo.nameFirst + (" " + (foo.nameLast + (" " + (bop + " times"))))))));
let fiveO:PoliceMan = new PoliceMan("john" "doe" 24)                       }
let yg:Fam = new Fam("yg" "hootie" 23)                                  };
yg.cap(fiveO)(5)                                                        return bopim;
                                                                     }
                                                                   }
                                                                   class PoliceMan extends Person {
                                                                     constructor(nameFirst, nameLast, age) {
                                                                       this.nameFirst = nameFirst;
                                                                       this.nameLast = nameLast;
                                                                       this.age = age;
                                                                       this.affiliation = "twelvy";
                                                                     }
                                                                     woopwoop() {
                                                                       return "Time to narc";
                                                                     }
                                                                   }
                                                                   let fiveO = new PoliceMan("john", "doe", 24);
                                                                   let yg = new Fam("yg", "hootie", 23);
                                                                   yg.cap_3(fiveO)(5);
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
    ret gcd(b a % b)                                }
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
       x -= 1
    ret c
````
