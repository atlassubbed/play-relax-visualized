import sceneify from "./sceneify";

// quick check to see if the mouse intersects a bounding box
// since we're doing a simple O(V + E) traversal in the draw loop anyway,
// i don't see the advantage of using a quad-tree or r-tree spatial index here
const contains = ([x, y, w, h], mX, mY) => {
  return mX > x && mY > y &&
    mX < x+w && mY < y+h;
}

const draw = (canvas, graph, layout, drawingOptions) => {
  const getTransforms = sceneify(canvas);
  // initialize the canvas, graph, layout.
  const {
    backgroundColor,
    nodeSize: size,
    nodeColor,
    linkColor,
    linkInColor,
    linkOutColor,
    labelColor,
    labelFont,
    showLabels,
    selectedNodeColor: highlight } = drawingOptions;
  const {width: w, height: h} = canvas;
  const ctx = canvas.getContext("2d");
  // node positions are centered in canvas & corrected w/ pan/drag offset & zoom factor
  const posOf = (node, x, y, z) => {
    const pos = layout.getNodePosition(node.id);
    return [(pos.x + x)/z + w/2, (pos.y + y)/z + h/2];
  }
  const posOfInverse = (mX, mY, x, y, z) => {
    return [z*(mX - w/2)-x-size/2, z*(mY - h/2)-y-size/2];
  }
  const drawLink = (par, chi, x, y, z) => {
    const parPos = posOf(par, x, y, z);
    const chiPos = posOf(chi, x, y, z);
    // center link sources and sinks on each node
    parPos[0] += size/2, parPos[1] += size/2
    chiPos[0] += size/2, chiPos[1] += size/2
    ctx.moveTo(...parPos);
    ctx.lineTo(...chiPos);
  }
  const drawLabel = (node, pos) => {
    ctx.font = labelFont;
    ctx.fillStyle = labelColor
    ctx.fillText(node.id, pos[0]-size, pos[1]-3)
  }
  let draggedNode;
  document.addEventListener("keydown", e => {
    const code = e.keyCode;
    if (code === 80 && draggedNode)
      layout.pinNode(draggedNode, !layout.isNodePinned(draggedNode));
  })
  // actual render/draw loop
  const render = () => {
    requestAnimationFrame(() => {
      // disable panning via mouse if we have a drag candidate
      const [offX, offY, zoom, isDragging, mX, mY] = getTransforms(!!draggedNode);
      // if we're dragging, immediately force-set dragged node's position to current mouse
      if (isDragging && draggedNode && graph.hasNode(draggedNode.id)){
        canvas.style.cursor = "grabbing";
        layout.setNodePosition(draggedNode.id, ...posOfInverse(mX, mY, offX, offY, zoom))        
      } else {
        canvas.style.cursor = "pointer";
        draggedNode = null;
      }
      // advance the physics engine and reset the canvas
      layout.step();
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = "#000000"
      ctx.font = "10px sans-serif";
      ctx.fillText("click & hold to drag highlighted node", 2, 12)
      ctx.fillText("press p to pin highlighted node", 2, 24)
      ctx.fillText("trackpad/arrow-keys to pan around", 2, 36)
      ctx.fillText("press +/- to zoom in/out", 2, 48)
      ctx.beginPath();
      // draw all nodes
      graph.forEachNode(node => {
        const pos = posOf(node, offX, offY, zoom);
        ctx.fillStyle = node.data || nodeColor;
        // create a rect: [x, y, width, height]
        pos.push(size, size);
        // prevents other nodes from being dragged while dragging a node
        draggedNode = draggedNode || (contains(pos, mX, mY) && node);
        if (node !== draggedNode) ctx.fillRect(...pos);
      })
      ctx.strokeStyle = linkColor
      // draw focused links later
      const outLinks = [], inLinks = [];
      // draw unfocused links
      graph.forEachLink(link => {
        const par = graph.getNode(link.fromId);
        const chi = graph.getNode(link.toId);
        if (linkOutColor && par === draggedNode) outLinks.push(chi);
        else if (linkInColor && chi === draggedNode) inLinks.push(par);
        else drawLink(par, chi, offX, offY, zoom);
      })
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      if (draggedNode){
        ctx.beginPath();
        ctx.strokeStyle = linkOutColor;
        for (let chi of outLinks)
          drawLink(draggedNode, chi, offX, offY, zoom);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = linkInColor;
        for (let par of inLinks)
          drawLink(par, draggedNode, offX, offY, zoom);
        ctx.stroke();
        ctx.closePath();
        const pos = posOf(draggedNode, offX, offY, zoom);
        pos.push(size, size);
        ctx.fillStyle = highlight;
        ctx.fillRect(...pos);
        if (!showLabels) drawLabel(draggedNode, pos);
      }
      // draw labels
      if (showLabels) graph.forEachNode(node => {
        drawLabel(node, posOf(node, offX, offY, zoom));
      })
      render();
    })
  }
  render();
}

export default draw;
