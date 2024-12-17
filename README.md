
# ⏳ Timepulse

**Timepulse** is a lightweight and flexible library for managing countdown timers with advanced features like event listeners, customizable tick intervals, milestones, and support for chained or simultaneous timers.

---

## 🚀 Features

- **Precise countdown timers**: Accurate to the millisecond using `performance.now()`.
- **Customizable tick intervals**: Set the frequency of tick events (default: `1000ms`).
- **Event-driven**: Listen to `tick`, `start`, `pause`, `resume`, `complete`, and custom milestones.
- **Pause and resume support**: Stop the timer at any point and resume from where it left off.
- **Milestones**: Trigger events at specific time intervals (e.g., every 5s).
- **Multi-timer management**: Manage multiple timers simultaneously.
- **Chained timers**: Run multiple timers in sequence.

---

## 📦 Installation

Install via npm:

```bash
npm install timepulse
```

Or yarn:

```bash
yarn add timepulse
```

---

## 🔧 Usage

### Import the library

```typescript
import { CountdownTimer, MultiTimer, TimerChain } from 'timepulse';
```

---

### 🔹 **Basic Countdown Timer**

Create a countdown timer and listen to `tick` and `complete` events.

```typescript
const timer = new CountdownTimer(5000); // 5 seconds

timer.on('tick', (remainingTime) => {
  console.log(`Time remaining: ${Math.ceil(remainingTime / 1000)}s`);
});

timer.on('complete', () => {
  console.log('Countdown complete!');
});

timer.start();
```

**Output**:
```
Time remaining: 5s
Time remaining: 4s
Time remaining: 3s
Time remaining: 2s
Time remaining: 1s
Countdown complete!
```

---

### 🔹 **Custom Tick Intervals**

Customize the frequency of `tick` events.

```typescript
const timer = new CountdownTimer(3000, 500); // 3 seconds, tick every 500ms

timer.on('tick', (remainingTime) => {
  console.log(`Time remaining: ${remainingTime.toFixed(0)}ms`);
});

timer.on('complete', () => {
  console.log('Timer complete!');
});

timer.start();
```

**Output**:
```
Time remaining: 2500ms
Time remaining: 2000ms
Time remaining: 1500ms
Time remaining: 1000ms
Time remaining: 500ms
Timer complete!
```

---

### 🔹 **Pause and Resume**

Pause the timer and resume it later.

```typescript
const timer = new CountdownTimer(5000);

timer.on('pause', (remainingTime) => console.log(`Paused with ${remainingTime}ms remaining`));
timer.on('resume', (remainingTime) => console.log(`Resumed with ${remainingTime}ms remaining`));

timer.start();

setTimeout(() => timer.pause(), 2000); // Pause after 2s
setTimeout(() => timer.resume(), 4000); // Resume after 4s
```

**Output**:
```
Paused with 3000ms remaining
Resumed with 3000ms remaining
```

---

### 🔹 **Milestones**

Trigger events when specific time intervals are reached.

```typescript
const timer = new CountdownTimer(10000); // 10 seconds

timer.setMilestones(8, 5, 2); // At 8s, 5s, and 2s remaining

timer.on('milestone', (remainingTime) => {
  console.log(`Milestone reached: ${Math.ceil(remainingTime / 1000)}s remaining`);
});

timer.on('complete', () => console.log('Countdown complete!'));

timer.start();
```

**Output**:
```
Milestone reached: 8s remaining
Milestone reached: 5s remaining
Milestone reached: 2s remaining
Countdown complete!
```

---

### 🔹 **Manage Multiple Timers (MultiTimer)**

Create and manage multiple timers simultaneously.

```typescript
const manager = new MultiTimer();

const timer1 = manager.createTimer(3000);
timer1.on('complete', () => console.log('Timer 1 complete!'));

const timer2 = manager.createTimer(5000);
timer2.on('complete', () => console.log('Timer 2 complete!'));

manager.startAll();
```

**Output**:
```
Timer 1 complete!
Timer 2 complete!
```

---

### 🔹 **Chained Timers (TimerChain)**

Run timers in sequence.

```typescript
const chain = new TimerChain();

chain.addTimer(3000); // Timer 1: 3 seconds
chain.addTimer(2000); // Timer 2: 2 seconds

chain.getTimers().forEach((timer, index) => {
  timer.on('complete', () => console.log(`Timer ${index + 1} complete!`));
});

chain.startChain().then(() => console.log('All timers complete!'));
```

**Output**:
```
Timer 1 complete!
Timer 2 complete!
All timers complete!
```

---

## 🛠️ API Reference

### **CountdownTimer**

```typescript
const timer = new CountdownTimer(duration: number, tickInterval?: number);
```

| Parameter      | Type     | Default  | Description                                      |
|----------------|----------|----------|--------------------------------------------------|
| `duration`     | `number` | Required | Timer duration in milliseconds.                  |
| `tickInterval` | `number` | `1000`   | Interval for `tick` events in milliseconds.      |

#### Events

- **`tick`**: Triggered at each tick interval.  
- **`milestone`**: Triggered when a milestone is reached.  
- **`pause`**: Triggered when the timer is paused.  
- **`resume`**: Triggered when the timer is resumed.  
- **`start`**: Triggered when the timer starts.  
- **`complete`**: Triggered when the timer completes.  
- **`reset`**: Triggered when the timer is reset.

#### Methods

- `start(): Promise<void>`: Starts or resumes the timer.  
- `pause(): void`: Pauses the timer.  
- `resume(): void`: Resumes the timer.  
- `reset(): void`: Resets the timer to its initial duration.  
- `setMilestones(...seconds: number[]): void`: Sets milestones at specific times.  
- `getRemainingTime(): number`: Returns the remaining time.

---

### **MultiTimer**

Manage multiple timers.

- **`createTimer(duration, tickInterval?)`**: Creates and adds a timer to the manager.  
- **`startAll()`**: Starts all timers simultaneously.  
- **`pauseAll()`**: Pauses all timers.  
- **`resetAll()`**: Resets all timers.

---

### **TimerChain**

Run timers in sequence.

- **`addTimer(duration, tickInterval?)`**: Adds a timer to the chain.  
- **`startChain()`**: Runs all timers sequentially.  
- **`getTimers()`**: Returns all timers in the chain.

---

## 🧪 Tests

Timepulse is fully tested using Jest. To run tests:

```bash
npm test
```

---

## 📜 License

**MIT**

---

Timepulse: Manage time with precision and ease. 🚀