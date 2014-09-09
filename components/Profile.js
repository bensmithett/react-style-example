/**
 * @jsx React.DOM
 */
 
"use strict";
 
var React = require("react/addons");
var ReactStyle = require("react-style");
 
var Profile = React.createClass({
  css: {
    main: ReactStyle(function () {
      return {
        backgroundColor: "green",
        fontStyle: "italic"
      };
    }),
    subcomponent: ReactStyle(function () {
      return {
        backgroundColor: "blue",
        color: "white"
      };
    }),
  },
 
  render: function () {
    return(
      <div styles={this.css.main()}>
        This is a <b styles={this.css.subcomponent()}>Rad Component!!!</b>
      </div>
    );
  }
});
 
module.exports = Profile;
