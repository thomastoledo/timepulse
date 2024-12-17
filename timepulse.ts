// countdown-timer.ts

export type CountdownEvents = {
    tick: (remainingTime: number) => void;
    milestone: (remainingTime: number) => void;
    complete: () => void;
    pause: (remainingTime: number) => void;
    resume: (remainingTime: number) => void;
    start: () => void;
    reset: () => void;
  };
  
  export class CountdownTimer {
    private duration: number;
    private remainingTime: number;
    private milestones: Set<number> = new Set();
    private timerId: number | null = null;
    private isRunning: boolean = false;
    private startTime: number = 0;
    private lastTickTime: number = 0;
    private tickInterval: number;
  
    private eventListeners: Partial<CountdownEvents> = {};
  
    constructor(duration: number, tickInterval: number = 1000) {
      this.duration = duration;
      this.remainingTime = duration;
      this.tickInterval = tickInterval;
    }
  
    start(): Promise<void> {
      if (this.isRunning) return Promise.resolve();
  
      this.isRunning = true;
      this.startTime = performance.now();
      this.lastTickTime = this.startTime;
  
      this.triggerEvent('start');
  
      return new Promise((resolve) => {
        const loop = () => {
          const now = performance.now();
          const elapsed = now - this.startTime;
          this.remainingTime = Math.max(this.duration - elapsed, 0);
  
          const ticksToTrigger = Math.floor((now - this.lastTickTime) / this.tickInterval);
          if (ticksToTrigger > 0) {
            this.lastTickTime += ticksToTrigger * this.tickInterval; 
            this.triggerEvent('tick', this.remainingTime);
          }
  
          if (this.milestones.has(Math.ceil(this.remainingTime / 1000))) {
            this.triggerEvent('milestone', this.remainingTime);
          }
  
          if (this.remainingTime <= 0) {
            this.complete();
            resolve();
          } else {
            this.timerId = requestAnimationFrame(loop);
          }
        };
  
        this.timerId = requestAnimationFrame(loop);
      });
    }
  
    pause() {
      if (!this.isRunning) return;
      this.isRunning = false;
      if (this.timerId !== null) cancelAnimationFrame(this.timerId);
      this.timerId = null;
      this.triggerEvent('pause', this.remainingTime);
    }
  
    resume() {
      if (this.isRunning) return;
      this.duration = this.remainingTime;
      this.start();
      this.triggerEvent('resume', this.remainingTime);
    }
  
    reset() {
      if (this.timerId !== null) cancelAnimationFrame(this.timerId);
      this.timerId = null;
      this.remainingTime = this.duration;
      this.triggerEvent('reset');
    }
  
    setMilestones(...seconds: number[]) {
      this.milestones = new Set(seconds);
    }
  
    on<EventName extends keyof CountdownEvents>(
      event: EventName,
      callback: CountdownEvents[EventName]
    ) {
      this.eventListeners[event] = callback;
    }
  
    getRemainingTime() {
      return this.remainingTime;
    }
  
    private triggerEvent<EventName extends keyof CountdownEvents>(
      event: EventName,
      ...args: CountdownEvents[EventName] extends (...params: infer P) => any ? P : never
    ) {
      const callback = this.eventListeners[event];
      if (callback) (callback as Function)(...args);
    }
  
    private complete() {
      if (this.timerId !== null) cancelAnimationFrame(this.timerId);
      this.timerId = null;
      this.isRunning = false;
      this.triggerEvent('complete');
    }
  }
  
  
  
  
  /** MultiTimer Manager */
  export class MultiTimer {
    private timers: CountdownTimer[] = [];
  
    createTimer(duration: number) {
      const timer = new CountdownTimer(duration);
      this.timers.push(timer);
      return timer;
    }
  
    async startAll() {
      await Promise.all(this.timers.map((timer) => timer.start()));
    }
  
    pauseAll() {
      this.timers.forEach((timer) => timer.pause());
    }
  
    resetAll() {
      this.timers.forEach((timer) => timer.reset());
    }
  }
  
  /** Timer Chain Manager */
  export class TimerChain {
    private timers: CountdownTimer[] = [];
  
    addTimer(duration: number) {
      const timer = new CountdownTimer(duration);
      this.timers.push(timer);
    }
  
    async startChain() {
      for (const timer of this.timers) {
        await timer.start();
      }
    }
  
    getTimers() {
      return this.timers;
    }
  }
  
  