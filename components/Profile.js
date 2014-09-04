/**
 * @jsx React.DOM
 */
 
"use strict";
 
var React = require("react/addons");
var ReactStyle = require("react-style");
 
var Profile = React.createClass({
  css: ReactStyle(function () {
    return {
      backgroundColor: "green",
      fontStyle: "italic"
    };
  }),
  css__subcomponent: ReactStyle(function () {
    return {
      backgroundColor: "blue",
      color: "white"
    };
  }),
 
  render: function () {
    return(
      <div styles={this.css()}>
        This is a <b styles={this.css__subcomponent()}>Rad Component!!!</b>
      </div>
    );
  }
});
 
module.exports = Profile;
