import createGraph from "ngraph.graph";
import renderGraph from "ngraph.pixel";
import LCRSSyncedTree from "./LCRSSyncedTree";
import { id, isFn, getName } from "./util";

const getStyle = node => node.data && node.data();

// old, to be used with ngraph.pixel

// actual graph mutations
const unlink = (r, prev, node) => {
  r.queue.push(() => {
    r.graph.removeLink(r.graph.getLink(prev.id, node.id));
  })
}
const link = (r, prev, node, isSib) => {
  r.queue.push(() => {
    const color = isSib ? 0x00ff00 : 0x0000ff
    r.graph.addLink(prev.id, node.id, () => ({
      fromColor: color, toColor: color
    }));
  })
}
const create = (r, node, name) => {
  r.queue.push(() => {
    r.graph.addNode(node.id, () => ({
      color: node.color, size: node.size
    }))
  })
}
const destroy = (r, node) => {
  r.queue.push(() => {
    node.size = node.size/2
    r.graph.removeNode(node.id)
  })
}
const update = (r, node) => {
  
}

export default class LCRSRenderer extends LCRSSyncedTree {
  constructor(container, animationQueue){
    super();
    this.graph = createGraph();
    this.queue = animationQueue;
    this.anchorNode = this.graph.addNode(-1);
    this.rootNode = this.graph.addNode("DOM root (0)", () => ({
      color: 0xff66ff,
      size: 100
    }));
    this.graph.addLink(this.anchorNode.id, this.rootNode.id);
    this.renderer = renderGraph(this.graph, {
      container, node: getStyle, link: getStyle, is3d: false
    });
  }
  link(node, par, prevSib){
    if (par){
      const prev = prevSib || par;
      const next = prevSib ?
        prevSib._node.sib && prevSib._node.sib.node :
        par._node.next && par._node.next.node;
      link(this, prev, node, !!prevSib);
      if (next) unlink(this, prev, next), link(this, node, next, true);
    } else link(this, this.rootNode, node)
  }
  unlink(node, par, prevSib){
    const prev = prevSib || par || this.rootNode;
    unlink(this, prev, node);
    const next = node._node.sib && node._node.sib.node;
    if (next) link(this, prev, next, prev !== par)
  }
  add(node, par, prevSib, {name}){
    node.id = `${getName(name)} (${id()})`;
    node.color = isFn(name) ? 0x66ffff : name ? 0xff66ff : 0xffff66;
    node.size = isFn(name) ? 30 : name ? 20 : 10;
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
    this.unlink(node, par, prevSib);
    this.link(node, par, nextSib);
    super.move(node, par, prevSib, nextSib);
  }
  temp(node){
    update(this, node);
  }
}
