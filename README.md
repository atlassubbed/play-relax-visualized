# play-relax-visualized

Interactive visualization of how Relax's diffing engine works.

---

<img src="https://user-images.githubusercontent.com/38592371/55458548-3ea8b580-55bb-11e9-9d8f-ea05144d96cb.gif">

## live on codesandbox

https://codesandbox.io/s/github/atlassubbed/play-relax-visualized

### what's the app?

This is a basic todo app built with Relax and Munchlax. You can add/remove items, clear all items, change the sort order, etc. This functionality demos what happens to the VDOM when you update, mount, unmount and move nodes.

### what's on the canvas?

The canvas renders the todo list, but in graph form. Go ahead and play around with the list and see the graph structure of the app change in real-time. Note that the tree is in [LCRS form](https://en.wikipedia.org/wiki/Left-child_right-sibling_binary_tree). All that means is that instead of a parent node storing pointers to all of its children, it only points to its first child, which in turn points to the next sibling, etc.

### updates

Note that nodes on the canvas will flash white for a frame when you start an update. This is on purpose, so you can see which parts of the app were traversed for the update. 


### reactivity scope

This TODO app is a crude implementation of a todo list. It could be smarter. One thing you'll notice is that the reactivity can be much better scoped. Scoped reactivity refers to confining the reactive downstream to the minimum set of dependent nodes. Bringing state "up" disrespects reactive scope, which is why "sideways" data is preferred.

### ☠ mobile ☠

I haven't bothered tuning the canvas stuff for mobile. Check it out if you're on desktop Chrome. Ye be warned.

### made with 💜

[Relax](https://github.com/atlassubbed/atlas-relax)
