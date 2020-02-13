import React, { Component } from "react";
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import {toStringHDMS} from 'ol/coordinate';
import TileLayer from 'ol/layer/Tile';
import {toLonLat} from 'ol/proj';
import TileJSON from 'ol/source/TileJSON';

class PublicMap extends Component {

  constructor(props) {
    super(props);
    
    this.contentText = "";

    this.overlay = new Overlay({
      element: null,
      autoPan: true,
      element: document.getElementById("popup"),
      autoPanAnimation: {
        duration: 250
      }
    });

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new TileJSON({
            url: 'https://api.tiles.mapbox.com/v4/mapbox.natural-earth-hypso-bathy.json?access_token=pk.eyJ1IjoibW9uc2lkZXYiLCJhIjoiY2s2a3kyMWsxMDNhMjNscXM0bTZhanB3ZyJ9.u0zc38DH6qbS0WjsafvX1w',
            crossOrigin: 'anonymous'
          })
        })
      ],
      target: null,
      overlays: [this.overlay],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
  }

  componentDidMount() {
    this.map.setTarget("map");
    this.map.on('singleclick', function(evt) {
      var coordinate = evt.coordinate;
      var hdms = toStringHDMS(toLonLat(coordinate));
      this.contentText = '<p>You clicked here:</p><code>' + hdms + '</code>';
      this.overlay.setPosition(coordinate);
    });
    document.getElementById('popup-closer').on( () => {
      this.overlay.setPosition(undefined);
      document.getElementById('popup-closer').blur();
      return false;
    });
  }

  render() {
    return (
      <div>
        <div id="map" className="map"></div>
        <div id="popup" className="ol-popup">
          <a href="#" id="popup-closer" className="ol-popup-closer"></a>
          <div id="popup-content">{this.contentText}</div>
        </div>
      </div>
    );
  }
}

export default PublicMap;
