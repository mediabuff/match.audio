'use strict';

var React = require('react');
var request = require('superagent');
var Router = require('react-router');
var Link = require('react-router').Link;
var Foot = require('./foot.jsx');

var MusicItem = React.createClass({

  render: function() {
    if (!this.props.item.name) {
      return (
        <div className="col-md-3 col-xs-6">
          <div className="service">
            <div className="matching-from hidden-xs"></div>
            <img src={this.props.items[0].artwork.small} className="img-rounded album-artwork not-found" width="100%" />
            <div className="service-link">
              <img src={"/images/" + this.props.item.service + ".png"} className="img-rounded" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-md-3 col-xs-6">
          <div className="service">
            <div className="matching-from hidden-xs"></div>
            <a href={this.props.item.streamUrl || this.props.item.purchaseUrl}>
            <img src={this.props.item.artwork.small} className="img-rounded album-artwork" width="100%" /></a>
            <div className="service-link">
              <a href={this.props.item.streamUrl || this.props.item.purchaseUrl}>
                <img src={"/images/" + this.props.item.service + ".png"} className="img-rounded" />
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

});

var VideoItem = React.createClass({

  render: function() {
    if (this.props.item.id) {
      return (
        <div className="col-md-6 col-xs-12">
          <div className="service">
            <div className="js-video widescreen">
              <iframe width="100%" src={"//www.youtube.com/embed/" + this.props.item.id} frameBorder="0" allowFullScreen></iframe>
            </div>
            <a href={"https://www.youtube.com/results?search_query=" + this.props.items[0].name + " " + this.props.items[0].artist.name}>More Youtube matches</a>
          </div>
        </div>
      );
    } else {
      return (<div />);
    }
  }

});

module.exports = React.createClass({

  mixins: [ Router.State ],

  getInitialState: function () {
    return {
      name: this.props.shares[0].name || "",
      artist: this.props.shares[0].artist.name || "",
      shares: this.props.shares || []
    };
  },

  componentDidMount: function () {
    if (!this.props.shares) {
      request.get(this.getPathname()).set('Accept', 'application/json').end(function(res) {
        var shares = res.body.shares;
        this.setState({
          name: shares[0].name,
          artist: shares[0].artist.name,
          shares: shares
        });
      }.bind(this))
    }
    
    // Some hacks to pop open the Twitter/Facebook/Google Plus sharing dialogs without using their code.
    Array.prototype.forEach.call(document.querySelectorAll(".share-dialog"), function(dialog){
      dialog.addEventListener("click", function(event) {
        event.preventDefault();
        var w = 845;
        var h = 670;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    
        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    
        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;
        var newWindow = window.open(dialog.href, "Share Music", 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        if (window.focus) {
          newWindow.focus();
        }
      });
    });
  },

  render: function() {
    return (
      <div>
        <div className="page-wrap share">
          <header>
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <h1><Link to="home">match<span className="audio-lighten">.audio</span></Link></h1>
                </div>
              </div>
            </div>
          </header>
          <div className="container">
            <div className="row">
              <div className="col-md-9 col-sm-8 col-xs-12">
                <h3>Matched {this.state.shares[0] ? this.state.shares[0].type + "s" : ""} for</h3>
                <h2>{this.state.name} <span className="artist-lighten">- {this.state.artist}</span></h2>
              </div>
              <div className="col-md-3 col-sm-4 hidden-xs">
                <ul className="list-inline share-tools">
                  <li>Share this</li>
                  <li><a href={"http://twitter.com/intent/tweet/?text=Check out " + this.state.name + " by " + this.state.artist + "&via=MatchAudio"} className="share-dialog"><img src="/images/twitter.png" alt="Twitter" /></a></li>
                  <li><a href="http://www.facebook.com/sharer/sharer.php" className="share-dialog"><img src="/images/facebook.png" alt="Facebook" /></a></li>
                  <li><a href="https://plus.google.com/share" className="share-dialog"><img src="/images/googleplus.png" alt="Google+" /></a></li>
                </ul>
              </div>
            </div>
            <div className="row">
              {this.state.shares.map(function(item, i){
                if (item.service == "youtube") {
                  return (<VideoItem items={this.state.shares} item={item} inc={i} key={i} />);
                } else {
                  return (<MusicItem items={this.state.shares} item={item} inc={i} key={i} />);
                }
              }.bind(this))}
            </div>
          </div>
        </div>
        <Foot page="share" />
      </div>
    );
  }
});