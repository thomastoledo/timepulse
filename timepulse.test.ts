import { CountdownTimer, MultiTimer, TimerChain } from './timepulse';

// Mock global requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
    return setTimeout(() => callback(performance.now()), 1000 / 60) as unknown as number; // ~16ms (60 FPS)
};
global.cancelAnimationFrame = (id: number) => clearTimeout(id);

describe('CountdownTimer', () => {
  test('should trigger start and complete events', async () => {
    const timer = new CountdownTimer(1000);
    const startMock = jest.fn();
    const completeMock = jest.fn();

    timer.on('start', startMock);
    timer.on('complete', completeMock);

    await timer.start();

    expect(startMock).toHaveBeenCalledTimes(1);
    expect(completeMock).toHaveBeenCalledTimes(1);
  });

  test('should trigger tick events at a custom interval', async () => {
    const timer = new CountdownTimer(1500, 500); 
    const tickMock = jest.fn();
  
    timer.on('tick', tickMock);
    timer.start();
    await new Promise((resolve) => setTimeout(resolve, 1600));
    expect(tickMock).toHaveBeenCalledTimes(3);
  });
  
  

  test('should pause and resume correctly', async () => {
    const timer = new CountdownTimer(3000);
    const pauseMock = jest.fn();
    const resumeMock = jest.fn();
  
    timer.on('pause', pauseMock);
    timer.on('resume', resumeMock);
  
    timer.start();
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
    timer.pause();
    expect(pauseMock).toHaveBeenCalledTimes(1);
  
    await new Promise((resolve) => setTimeout(resolve, 500));
    timer.resume();
    expect(resumeMock).toHaveBeenCalledTimes(1);
  
    await new Promise((resolve) => setTimeout(resolve, 2200));
    expect(timer.getRemainingTime()).toBeLessThanOrEqual(0.1);
  });
});
  

describe('MultiTimer', () => {
  test('should manage multiple timers simultaneously', async () => {
    const manager = new MultiTimer();
    const timer1 = manager.createTimer(1000);
    const timer2 = manager.createTimer(2000);

    const complete1 = jest.fn();
    const complete2 = jest.fn();

    timer1.on('complete', complete1);
    timer2.on('complete', complete2);

    await manager.startAll();

    expect(complete1).toHaveBeenCalledTimes(1);
    expect(complete2).toHaveBeenCalledTimes(1);
  });
});

describe('TimerChain', () => {
  test('should run timers sequentially', async () => {
    const chain = new TimerChain();
  
    chain.addTimer(1000); // Timer 1
    chain.addTimer(2000); // Timer 2
  
    const completeMock = jest.fn();
  
    chain.getTimers().forEach((timer) => {
      timer.on('complete', completeMock);
    });
  
    await chain.startChain();
  
    expect(completeMock).toHaveBeenCalledTimes(2);
  });
  
});
