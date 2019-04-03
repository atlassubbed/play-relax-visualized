export class AnimationQueue {
  constructor(waitTime){
    this.head = null;
    this.tail = null;
    this.waitTime = waitTime || 0;
  }
  process(){
    requestAnimationFrame(job => {
      if (job = this.head){
        job(), setTimeout(() => {
          this.head = job.next, this.process()
        }, this.waitTime);
      }
    })
  }
  push(job){
    const shouldProcess = !this.head;
    if (!this.head) this.head = job;
    if (!this.tail) this.tail = job;
    else this.tail = this.tail.next = job;
    shouldProcess && this.process();
  }
}
