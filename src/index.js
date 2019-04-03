import { diff } from "atlas-relax";
import { t } from "atlas-relax-jsx-pragmas"; /**@jsx t */
import DOMRenderer from "atlas-mini-dom";
import { AnimationQueue, GraphRenderer } from "./canvas";
import App from "./app";
import "./styles.css"

// code sandbox isn't respecting the index.html, so let's just do this for now
// until we figure out how to get it to use our index.html
document.body.innerHTML = `
  <div id="container">
    <div id="app"></div>
    <canvas id="canvas" width="650px" height="650px"/>
  </div>
`

const canvas = document.getElementById("canvas");
const appRoot = document.getElementById("app");
const canvasRendererPlugin = new GraphRenderer(canvas);
const domRendererPlugin = new DOMRenderer(appRoot)

// mount app with both plugins, immediately render to canvas
const app = diff(<App v={0}/>, null, [domRendererPlugin, canvasRendererPlugin]);

// throttle canvas mutations after first mount
// increase this number to slow down mutation animations
canvasRendererPlugin.setQueue(new AnimationQueue(0))
