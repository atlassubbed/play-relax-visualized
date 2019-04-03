// make a renderer like the LCRSRenderer but for forcelayout

// animate updates, moves, adds and removes
import LCRSSyncedTree from "./LCRSSyncedTree";
import createGraph from "ngraph.graph";
import createLayout from "ngraph.forcelayout";
import SyncAnimationQueue from "./SyncAnimationQueue";
import { id, getName } from "./util";
import draw from "./draw";

// actual graph mutations
const unlink = (r, prev, node) => {
  r.queue.push(() => {
    r.graph.removeLink(r.graph.getLink(prev.id, node.id));
  })
}
const link = (r, prev, node) => {
  const g = r.graph;
  r.queue.push(() => {
    if (g.hasNode(node.id) && g.hasNode(prev.id)){
      r.graph.addLink(prev.id, node.id);
    }
  })
}
const create = (r, node, name) => {
  r.queue.push(() => {
    r.graph.addNode(node.id)
  })
}
const destroy = (r, node) => {
  r.queue.push(() => {
    r.graph.removeNode(node.id)
  })
}

const updates = [];
const update = (r, node) => {
  const isFirst = !updates.length;
  updates.push(node);
  if (isFirst){
    r.queue.push(() => {
      updates.forEach(i => {
        const n = r.graph.getNode(i.id)
        if (n) n.data = "#ffffff";
      })
    })
    r.queue.push(() => {
      let i;
      while(i = updates.pop()){
        const n = r.graph.getNode(i.id);
        if (n) n.data = null;
      }
    })
  }  
}

// TODO, allow specific properties for each node
// use graph metadata from ngraph and hook into it in draw()
export class GraphRenderer extends LCRSSyncedTree {
  constructor(canvas, animationQueue=new SyncAnimationQueue, drawingOptions={}, physicsOptions={}){
    super();
    this.graph = createGraph();
    this.queue = animationQueue;
    // sensible defaults
    this.layout = createLayout(this.graph, Object.assign({
      springLength : 100,
      springCoeff : 0.0008,
      dragCoeff : 0.02,
      gravity : -4,
      theta : .8
    }, physicsOptions))
    draw(canvas, this.graph, this.layout, Object.assign({
      backgroundColor: "#ff4444",
      nodeColor: "#444444",
      selectedNodeColor: "#ffff44",
      linkColor: "#666666",
      linkInColor: "#4444ff",
      linkOutColor: "#ffff44",
      labelColor: "#ffffff",
      labelFont: "12px sans-serif",
      showLabels: true,
      nodeSize: 8
    }, drawingOptions));
  }
  setQueue(queue){
    this.queue = queue
  }
  link(node, par, prevSib){
    if (par){
      const prev = prevSib || par;
      const next = prevSib ?
        prevSib._node && prevSib._node.sib && prevSib._node.sib.node :
        par._node.next && par._node.next.node;
      link(this, prev, node, !!prevSib);
      if (next) unlink(this, prev, next), link(this, node, next);
    }
  }
  unlink(node, par, prevSib){
    const prev = prevSib || par;
    par && unlink(this, prev, node);
    const next = node._node.sib && node._node.sib.node;
    if (par && next) unlink(this, node, next), link(this, prev, next)
  }
  add(node, par, prevSib, {name}){
    prevSib = prevSib && prevSib._node ? prevSib : null;
    node.id = `${getName(name)} (${id()})`;
    create(this, node, name);
    this.link(node, par, prevSib);
    super.add(node, par, prevSib, {name})
  }
  remove(node, par, prevSib){
    this.unlink(node, par, prevSib);
    destroy(this, node);
    super.remove(node, par, prevSib);
  }
  move(node, par, prevSib, nextSib){
    prevSib = prevSib && prevSib._node ? prevSib : null;
    nextSib = nextSib && nextSib._node ? nextSib : null;
    this.unlink(node, par, prevSib);
    this.link(node, par, nextSib);
    super.move(node, par, prevSib, nextSib);
  }
  temp(node){
    update(this, node);
  }
}
