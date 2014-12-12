#binding-stream-test

Testing out my idea for a "data binding stream" that I'll use for stream-based UIs

## The idea

The idea is to have the entire UI update using streams. And one important thing
is to get user input to work with this streaming paradigm as well.

## How it works

Streams are composed into the following pipeline

* Listen for changes in the input and send the DOM event to the next stream
* Parse out the input element's data-binding property, generate a new object
which contains the input's value under the given keypath
* Merged the generated object into a main "state" stream
* Pipe the enitre state to the next step on every change
* Render the data with any templating language you want (I chose mustache)
* Pipe the HTML template into an [HTML patcher stream](https://github.com/RangerMauve/html-patcher-stream)
* ????
* Profit!

## Running

Check out the demo [here](http://rangermauve.github.io/binding-stream-test/), or clone the project and do the following:

* `npm install`
* `npm run build`
* Open `index.html` in your browser

This project uses [Browserify](http://browserify.org/) for building everything.
