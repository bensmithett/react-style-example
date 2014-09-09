# Styling JS Components

Components!

components/
  Profile/
    index.hbs
    index.css
    index.js

```html
<div class="profile">
  <img class="profile__avatar" src="{{avatarUrl}}.jpg" />
  <strong>{{username}}</strong>
</div>
```

```css
.profile {
  border: 1px solid #ddd;
  overflow: hidden;
}

.profile__avatar {
  float: left;
  margin-right: 10px;
}
```

```javascript
var Profile = function (el) {
  el.querySelector("img").addEventListener("click", function () {
    console.log("hai!");
  });
  this.tmpl = Handlebars.compile(someTemplateStriong)
};

Profile.prototype.render = function (state) {
  this.el.innerHTML = this.tmpl(state);
};
```

With React, the template part of the component, the HTML structure, merges with the JS part:

```javascript
var React = require("react");

var Profile = React.createClass({
  handleClick: function () {
    console.log("hai");
  },
  render: function () {
    return (
      <div class="profile">
        <img class="profile__avatar" src="{this.props.avatarUrl}.jpg" onClick={this.handleClick} />
        <strong>{this.props.username}</strong>
      </div>
    );
  }  
});

module.exports = Profile;
```

Slide from a talk I did a couple of months ago:
All this component's concerns in one place!

That's a bald faced lie.

components/
  Profile/
    index.css
    index.jsx

CSS is still separate.
There's a single, really vague, loose connection between them:
  They both refer to the same class names.

```javascript
render: function () {
  return (
    <div class="profile">
      // ...
    </div>
  )
}
```

```
.profile
  border: 1px solid #ddd;
  overflow: hidden;
```


It's a dependency of the component, but that's not explicitly spelled out like the other dependencies.

So while the JS & the HTML & any external dependencies get bundled up as a neat commonJS module, CSS is handled seperately.
- The template is right there in the JS file
- The view logic is right there in the JS file
- Dependencies are stated right there in the JS file
- The styles are handled completely seperately

You probably build your CSS seperately. This is how we do it with Sass:

```scss
@import vendor/Normalize.css;
@import base;

@import components/Header;
@import components/Profile;
@import components/Footer;
```

You kinda just have to *know* which bits of CSS a given page needs.
And that sucks.
Especially if one of those components has other nested components
  Header might have a logo
You need to know, from out here at this birds eye view of your app, every single CSS module you need.
Not great.

If any of you saw Nicolas Gallagher's talk at CSSConf earlier this year on this component-based architecture,
something he mentioned that I found really exciting: 
- A build tool that automatically creates a stylesheet based on the components you use on a given page.

So if I my main app JS file looked like this:

```javascript
var React = require("react");
var Profile = require("./components/Profile");
var Header = require("./components/Header");
var Footer = require("./components/Footer");

React.renderComponent(document.body, <div>
  <Header />
  <Profile username="ben" avatarUrl="ben.jpg" />
  <Footer />
</div>);
```

It would automatically construct a stylesheet that had all the styles that those 3 components need.

At the time I was stoked with the idea, but I also thought it was one of those things
that we wouldn't actually see for 5 years.

But then Webpack came along!

And the great thing about Webpack is you can treat your component's CSS just like any other dependency:

```javascript
var React = require("react");
require("./index.css");

var Profile = React.createClass({
  render: function () {
    return (
      <div class="profile">
        // ...
      </div>
    );
  }  
});

module.exports = Profile;
```

So if we have an app that requires this module and a couple of others:

```javascript
var React = require("react");
var Profile = require("./components/Profile");
var Header = require("./components/Header");
var Footer = require("./components/Footer");

React.renderComponent(document.body, <div>
  <Header />
  <Profile username="ben" avatarUrl="ben.jpg" />
  <Footer />
</div>);
```

And we assume that the Header & Footer modules are requiring their own CSS files, Webpack 
will combine them all into a single CSS file that includes everything we need for this particular app
and nothing more.

Which is awesome! We can do away with those big old Sass manifests where you need to list every component that may ever
be used in your app, and just let it happen automatically.

So that's pretty cool. The dependency management side is solved.

components/
  Profile/
    index.css
    index.jsx

But when you're developing this component, you're still working across two different files.
Still writing classes in the CSS, then remembering those class names as you jump across to where you're editing the HTML.

But the CSS is as much a core part of the component as its behavior and its markup. 
So wouldn't it be cool if you could edit its styles right there in context in the same file?

Vanilla React lets you do this with inline styles

```javascript
var Profile = React.createClass({
  styles: {
    border: "1px solid #ddd",
    overflow: "hidden"
  },
  render: function () {
    return(
      <div style={this.styles} />
    );
  }
});
```

```html
<div style="border: 1px solid #ddd; overflow: hidden;">
  ...
</div>
```

But that's kinda lame, nobody likes inline styles.
Especially if you have lots of these components rendered on the page, it seems kinda wasteful to be declaring these styles again and again.

What we really want is the ability to declare styles right here in the component file
as if they're going to be inline
but then we want our built process to come along and bundle those styles up into a CSS class,
and do the same thing for every component in our app, and end up with a single .css file.

React-Style by @SanderSpies
does exactly that.

```javascript
var React = require("react/addons");
var ReactStyle = require("react-style");
 
var Profile = React.createClass({
  styles: ReactStyle(function () {
    return {
      backgroundColor: "green",
      border: "1px solid #ddd"
    };
  }),
  render: function () {
    return(
      <div styles={this.styles()} />
    );
  }
});
 
module.exports = Profile;
```

This is mostly the same as the inline styles example
We still pass it our styles as a JavaScript object
But it's wrapped in that ReactStyle function

What that gives us:

```html
<div class="a">
  ...
</div>
```

```css
.a {
  background-color: green;
  border: 1px solid #ddd
}
```

Those styles bundled up into an automatically generated class name.
When React renders the component, it gives it that class name rather than inline styles.

DEMO IT

If you don't like the auto-generated class names, you can format them however you like.

DEMO IT

The styles are *part of the component*.
CSS class naming conventions are just a per-project setting.
You could generate BEM classes for debugging in development & tiny compressed classes for production.

Also:

I <3 Sass
I hear Less & Stylus have some fans too
Rework & Myth are pretty awesome
Native CSS variables are... ok

"CSS Preprocessor"
A language that helps us generate blocks of key:value pairs

selector {
  key: value;
  other-key: other-value;
}

JavaScript is pretty good at doing that...

selector = {
  key: "value",
  other-key: "other-value"
};

and it's already got lots of real programming language things like
variables
functions
arrays & objects
maths
string manipulation
dependency management
third party libraries

Color variables

```javascript
var colors = require("./colors");
 
var Profile = React.createClass({
  styles: ReactStyle(function () {
    return {
      color: colors["skyBlue"],
    };
  }),
  render: function () {
    return(
      <div styles={this.styles()} />
    );
  }
});
 
module.exports = Profile;
```


Generate grid classes

```javascript
var styles = {};
var gridColumns = 12;

for (var i = 1; i <= gridColumns; i++) {
  var width = (i / gridColumns) * 100;

  styles["span" + i] = ReactStyle(function () {
    float: "left",
    width: width + "%"
  });
}

var GridColumn = React.createClass({
  styles: styles,
  render: function () {
    var columns = "span" + this.props.columns
    return(
      <div styles={this.styles[columns]()} />
    );
  }
});
 
module.exports = Profile;
```

JS is a really nice CSS preprocessor.

That's all!

