export default class SyncAnimationQueue {
  push(job){
    job();
  }
}
