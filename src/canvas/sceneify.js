// 2d vector add/subtract, scalar multiplication
const add = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];
const sub = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];
const mult = (s, v1) => [s*v1[0], s*v1[1]]

const sceneify = (canvas, speed=100) => {
  // allow dragging on the canvas to move around the scene
  let allowDrag = true;
  let offset = [0, 0], zoom = 1, start = null, mouse = [0, 0];
  canvas.addEventListener("mousedown", e => start = [e.clientX, e.clientY])
  canvas.addEventListener("mouseup", e => start = null);
  canvas.addEventListener("mousemove", e => {
    mouse = [e.offsetX, e.offsetY];
    if (!start || !allowDrag) return;
    const end = [e.clientX, e.clientY];
    const delta = mult(zoom, sub(end, start))
    start = end;
    offset = add(offset, delta);
  })
  // allow arrow keys to move around the scene
  document.addEventListener("keydown", e => {
    const code = e.keyCode
    if (code === 37) offset = add(offset, [speed*zoom, 0]);
    else if (code === 38) offset = add(offset, [0, speed*zoom]);
    else if (code === 39) offset = sub(offset, [speed*zoom, 0]);
    else if (code === 40) offset = sub(offset, [0, speed*zoom]);
  })
  // allow wheel/swipe to move around the scene
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    offset = sub(offset, [e.deltaX*zoom, e.deltaY*zoom]);
  })
  // allow -/+ to zoom out/in respectively
  document.addEventListener("keydown", e => {
    const code = e.keyCode;
    if (code === 189) zoom++
    if (code === 187) zoom = Math.max(zoom-1, 1)
  })
  // returns state: [offsetX, offsetY, zoomLevel, isDragging, mouseX, mouseY]
  return disableMouseDragging => {
    allowDrag = !disableMouseDragging;
    return [...offset, zoom, !!start, ...mouse]
  }
}

export default sceneify
