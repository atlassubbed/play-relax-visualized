const insertAfter = (f, p, s) => {
  f.sib = s ? s.sib : p.next;
  if (s) s.sib = f;
  else p.next = f;
}
const removeAfter = (f, p, s) => {
  if (s) s.sib = f.sib;
  else p.next = f.sib;
}
export default class LCRSSyncedTree {
  add(f, p, s, {name}){
    const node = f._node = {node: f, name, next: null, sib: null}
    p && insertAfter(node, p._node, s && s._node);
  }
  remove(f, p, s){
    const node = f._node;
    if (p && p._node) removeAfter(node, p._node, s && s._node);
     // could also set the sib/next pointers to null here
     // but garbage collect should work without doing so
    f._node = null;
  }
  move(f, p, ps, ns){
    const node = f._node, parent = p._node;
    removeAfter(node, parent, ps && ps._node);
    insertAfter(node, parent, ns && ns._node);
  }
}
