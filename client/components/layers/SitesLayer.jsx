import Cartesian2 from 'cesium/Core/Cartesian2'
import Cartesian3 from 'cesium/Core/Cartesian3'
import Color from 'cesium/Core/Color'
import HeightReference from 'cesium/Scene/HeightReference'
import LabelGraphics from 'cesium/DataSources/LabelGraphics'
import NearFarScalar from 'cesium/Core/NearFarScalar'
import React from 'react'
import { branch } from 'baobab-react/higher-order'
import css2json from 'css2json'
import { getSites } from '../../actions/actions'
import jsonMarkup from 'json-markup'

const jsonCss = css2json(`
  .json-markup {
  	line-height: 17px;
  	font-size: 13px;
  	font-family: monospace;
  	white-space: pre;
  }
  .json-markup-key {
  	font-weight: bold;
  }
  .json-markup-bool {
  	color: firebrick;
  }
  .json-markup-string {
  	color: green;
  }
  .json-markup-null {
  	color: gray;
  }
  .json-markup-number {
  	color: blue;
  }
`)

const SitesLayer = branch(
  { sites: ['globe', 'sites'] },
  ({ viewer, sites }) => {
    if (!sites || sites.length === 0) {
      getSites()
      return false
    }
    sites.map(site => {
      viewer.entities.add({
        name: `${site.siteName} Camera Site`,
        description: jsonMarkup(site, jsonCss),
        label: new LabelGraphics({
          text: site.siteName,
          font: '12px Arial',
          fillColor: Color.WHITE,
          pixelOffset: new Cartesian2(22, 15),
          translucencyByDistance: new NearFarScalar(
            site.visibility * 4.3e4,
            1.0,
            site.visibility * 4.6e4,
            0.0
          )
        }),
        position: Cartesian3.fromDegrees(
          parseFloat(site.longitude),
          parseFloat(site.latitude)
        ),
        point: {
          color: Color.GREEN,
          outlineColor: Color.WHITE,
          outlineWidth: 2,
          pixelSize: 8,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          shadows: true,
          translucencyByDistance: new NearFarScalar(
            site.visibility * 4.3e4,
            1.0,
            site.visibility * 4.6e4,
            0.0
          )
        }
      })
    })
    return <div className="airports-layer" />
  }
)

export default SitesLayer
