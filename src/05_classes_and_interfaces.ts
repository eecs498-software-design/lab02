/**
 * EECS 498 Lab 02
 * Classes + Interfaces
 *
 * BIG IDEA (Classes):
 *   A class bundles data + behavior, and it is a great place to enforce invariants.
 *   Invariants are rules that should always hold (e.g. "balance never negative").
 *
 * BIG IDEA (Interfaces):
 *   Interfaces define contracts without committing to implementations.
 *   They let you write code that depends on "what something can do", not "what it is".
 *
 * IMPORTANT FOR THIS LAB:
 *   We make the logger deterministic by returning a constant timestamp,
 *   so the output matches the solution diff exactly.
 */

//////////////////////////////
// Part 1: Classes
//////////////////////////////

class BankAccount {
  /**
   * EXERCISE 1:
   * Improve this class design:
   *   - balanceCents must never go negative
   *   - balanceCents should be private (encapsulation)
   *   - implement:
   *       balance(): number
   *       deposit(cents)
   *       withdraw(cents)
   *       transferTo(other, cents)
   *
   * Input validation requirements:
   *   - deposit/withdraw/transfer cents must be positive integers
   *   - withdraw/transfer must not overdraw the account
   *   - throw Error with helpful messages
   *
   * Design tip:
   *   Use withdraw + deposit inside transferTo to reduce duplication.
   */

  public balanceCents: number; // WRONG on purpose: should be private

  constructor(initialCents: number) {
    // TODO: enforce invariant (initialCents must be >= 0)
    this.balanceCents = initialCents;
  }

  balance(): number {
    // TODO
    return 0;
  }

  deposit(cents: number): void {
    // TODO
    void cents;
  }

  withdraw(cents: number): void {
    // TODO
    void cents;
  }

  transferTo(other: BankAccount, cents: number): void {
    // TODO
    void other;
    void cents;
  }
}

function runBankAccount() {
  const a = new BankAccount(1000);
  const b = new BankAccount(500);

  a.deposit(250);
  console.log("a after deposit:", a.balance()); // expect: 1250

  a.withdraw(200);
  console.log("a after withdraw:", a.balance()); // expect: 1050

  a.transferTo(b, 50);
  console.log("a,b after transfer:", a.balance(), b.balance()); // expect: 1000 550

  // This should throw due to insufficient funds.
  try {
    b.withdraw(999999);
    console.log("ERROR: expected throw");
  } catch (e) {
    console.log("caught:", (e as Error).message.includes("Insufficient")); // expect: true
  }
}

//////////////////////////////
// Part 2: Interfaces
//////////////////////////////

interface Logger {
  log(msg: string): void;
}

/**
 * EXERCISE 2:
 * Define TimestampedLogger that extends Logger:
 *   - nowMs(): number
 *
 * Extending interfaces lets you build richer contracts from simpler ones.
 */
interface TimestampedLogger extends Logger {
  // TODO: nowMs(): number
}

/**
 * EXERCISE 3:
 * Implement ConsoleLogger that implements TimestampedLogger.
 *
 * Requirements:
 *   - nowMs returns a constant 1234567890 (deterministic for tests)
 *   - log prints: [t=<nowMs()>] <msg>
 *
 * Example:
 *   [t=1234567890] hello
 */
class ConsoleLogger implements TimestampedLogger {
  // TODO: implement nowMs + log correctly

  log(msg: string): void {
    // WRONG on purpose:
    console.log(msg);
  }
}

/**
 * EXERCISE 4:
 * Define a Counter interface with:
 *   - inc(): void
 *   - value(): number
 */
interface Counter {
  // TODO
}

/**
 * EXERCISE 5:
 * Implement SimpleCounter that implements Counter.
 *
 * Design hint:
 *   - store a private number field
 *   - inc() increments it
 *   - value() returns it
 */
class SimpleCounter implements Counter {
  // TODO
}

/**
 * EXERCISE 6:
 * Write runTask that depends ONLY on interfaces.
 *
 * Requirements:
 *   - increment the counter n times
 *   - log "count=<value>" at the end using logger
 *
 * The point:
 *   This function shouldn’t care whether counter is SimpleCounter, FancyCounter,
 *   database-backed counter, etc. It only cares that it satisfies Counter.
 */
function runTask(counter: Counter, logger: Logger, n: number): void {
  // TODO
  void counter;
  void logger;
  void n;
}

function runInterfaces() {
  const logger = new ConsoleLogger();
  logger.log("hello"); // expect: [t=1234567890] hello

  const c = new SimpleCounter();
  runTask(c, logger, 3); // expect: logs [t=1234567890] count=3
  console.log("final:", c.value()); // expect: 3
}

/**
 * STRETCH EXERCISE:
 * Implement additional Counter and Logger implementations to demonstrate
 * the power of interface-based design.
 *
 * Suggested implementations:
 *
 * Counters:
 *   - StepCounter: increments by a configurable step size (e.g., 2, 5, 10)
 *   - BoundedCounter: has a maximum value and wraps around when exceeded
 *   - NegativeCounter: can count backwards (decrement) as well as forwards
 *   - ResettableCounter: extends Counter with a reset() method
 *
 * Loggers:
 *   - FileLogger: writes logs to a file (or simulates it with console.log)
 *   - PrefixLogger: adds a configurable prefix to all log messages
 *   - SilentLogger: implements Logger but does nothing (useful for testing)
 *   - MultiLogger: logs to multiple loggers simultaneously
 *
 * Testing:
 *   - Create instances of your new Counter and Logger implementations
 *   - Test that runTask works with ALL combinations:
 *     - runTask(new SimpleCounter(), new ConsoleLogger(), 5)
 *     - runTask(new StepCounter(2), new PrefixLogger("DEBUG"), 3)
 *     - runTask(new BoundedCounter(10), new FileLogger(), 15)
 *     - ... and so on
 *
 * The key insight:
 *   Because runTask depends only on the Counter and Logger interfaces,
 *   it works with ANY implementation without modification. This is the
 *   power of polymorphism and interface-based design!
 */

function main() {
  runBankAccount();
  runInterfaces();
}

main();
