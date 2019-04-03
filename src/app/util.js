// import { obs } from "atlas-munchlax";

// basically a HOC helper for munchlax to give a
// non-observed render function certain scoped observations
// we could use JSX here, but JSX is really not necessary
// const dep = (...args) => {
//   const Component = args.pop();
//   // HOC observes dependencies
//   return obs(({data, next, key}) => {
//     // actual Component is dumb
//     const temp = {
//       name: Component, next,
//       data: Object.assign({deps: args.map(a => a())}, data),
//     }
//     if (key != null) temp.key = key;
//     return temp;
//   })
// }

const asap = Promise.resolve().then.bind(Promise.resolve())

const shouldUpdate = (p, n) => p !== n;

export { asap, shouldUpdate };
