![Bool Logo](images/bool-logo.jpg)
## Introduction

## Features
- a
- b
- c

## Code Examples
````
// Variable Declarations

foo = 101                                       var foo = 101;
string:bar = 101                                var bar = "101";
````
#### Arithmetic & Boolean Expressions
````
// arithmetic
a + b
a - b
a * b
a / b
a % b  --modulo
a ** b --exponentiation
a // b --root

// booleans
tru
fal

// boolean expressions
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
fun foo (bar):                                 var foo = function(bar) {
  result = 0                                       var result = 0;
  for i in bar:                                    for (var i = 0; i < bar; i += 1) {
    if i < 5:                                        if (i < 5) {
      result = "foobar"                                 result = "foobar";
    elif i > 7:                                      } else if (i > 7) {
      result = "barfoo"                                 result = "barfoo";
  ret result                                         }
                                                   }
                                                   return result;
                                               };
````
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
fun fibonacci (x):                           var fibonacci = function(x) {
    a = 0                                        var a = 0, b = 1, c;
    b = 1                                        if (x < 3) return 1;
    c                                            while (--x > 0) {
    if (x < 3):                                    c = a + b, a = b, b = c;
       ret 1                                     }
    while ((x += 1) > 0):                          return c;
       c = a + b                             }
       a = b
       b = c
    ret c
````
