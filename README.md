Independable
============

Dead simple dependency container for node.js

## Context

Independable was inspired by the [dependable](https://www.npmjs.com/package/dependable) module, however I didn't like the way of defining dependencies, as it uses Function.toString() to identify the dependencies.
Things will go wrong when you try to minify such files, and it simply isn't a "clean" solution.

## Installation

```
npm install independable
```

## Usage

You can retreive the container as
```javascript
var independable = require('independable');
var container = independable();
```
Subsequently there are two ways to specify your dependencies. You could either _register_ them, or _define_ them.

### Registering dependencies

The ```container.register()``` method expects you to specify a dependency directly. For example
```javascript
// Registering a string dependency
container.register('some-string', 'a string value');

// Registering an object as dependency
var object = {};
container.register('some-object', object);
```
or equivalent
```javascript
container.register({
  "some-string": "a string value",
  "some-object": {}
});
```
to register multiple dependencies at once.

### Defining dependencies

If you want to only create objects on-the-fly as they are needed, you may provide a factory function using the ```container.define()```method.
For example
```javascript
var Constructor = function() {
  this.foo = 'bar';
};
container.define('on-the-fly', function() {
  return new Constructor();
});
```
As such, ```new Constructor()``` is only called when requested by ```container.get('on-the-fly')```.
Note that if you use ```container.get('on-the-fly');``` the constructor is not called again, but the object that was created earlier is returned.
Also note that
```javascript
container.register('dep', 'value');
```
and
```javascript
container.define('dep', function() {
  return 'value';
});
```
are equivalent.

#### Relying on other dependencies

If a certain dependency depends on another dependency, there are two ways to handle this. Either
```javascript
container.register('one', 1);
container.register('two', 2);
container.define('three', {
  deps: [one, two],
  get: function(one, two) {
    return one + two;
  }
});
```
or
```javascript
container.register('one', 1);
container.register('two', 2);
container.define('three', function() {
  var one = this.get('one'),
      two = this.get('two');
  return one + two;
});
```
are equivalent. As can be seen, ```this``` in the factory function refers to the dependency container itself.
As such, you can also pass it functions depending on the container as
```javascript
var needsTheContainer = function(container) {
  // Do something with the container
};
container.define('dependent', function() {
  return needsTheContainer(this);
});
```

### Retreiving dependencies

```javascript
var dep = container.get('dependency-id');
```

## License

Copyright (c) 2015 Sebastiaan Marynissen

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
