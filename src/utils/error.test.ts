import {
  getErrorMessage,
  getErrorWithStack,
  isErrorWithMessage,
  toErrorMessage,
  toErrorWithMessage,
} from './error';

describe('toErrorMessage', () => {
  it('returns the message for Error instances', () => {
    const err = new Error('Test error');
    expect(toErrorMessage(err)).toBe('Test error');
  });

  it('returns fallback string for non-Error values', () => {
    expect(toErrorMessage(123)).toBe('error could not be parsed');
    expect(toErrorMessage({ foo: 'bar' })).toBe('error could not be parsed');
    expect(toErrorMessage(null)).toBe('error could not be parsed');
  });
});

describe('isErrorWithMessage', () => {
  it('identifies objects with a string message property', () => {
    const withMessage = { message: 'hello' };
    expect(isErrorWithMessage(withMessage)).toBe(true);
  });

  it('rejects objects without a message property', () => {
    const noMessage = { foo: 'bar' };
    expect(isErrorWithMessage(noMessage)).toBe(false);
  });

  it('rejects objects with non-string message property', () => {
    const badMessage = { message: 123 };
    expect(isErrorWithMessage(badMessage)).toBe(false);
  });

  it('rejects non-object values', () => {
    expect(isErrorWithMessage(null)).toBe(false);
    expect(isErrorWithMessage(123)).toBe(false);
    expect(isErrorWithMessage('error')).toBe(false);
  });
});

describe('toErrorWithMessage', () => {
  it('returns original ErrorWithMessage objects', () => {
    const custom: { message: string } = { message: 'custom' };
    expect(toErrorWithMessage(custom)).toBe(custom);
  });

  it('wraps non-message values in an Error via JSON.stringify', () => {
    const value = { foo: 'bar' };
    const wrapped = toErrorWithMessage(value);
    expect(wrapped).toBeInstanceOf(Error);
    expect(wrapped.message).toBe(JSON.stringify(value));
  });

  it('falls back for circular references', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circular: any = {};
    circular.self = circular;

    const wrapped = toErrorWithMessage(circular);
    expect(wrapped).toBeInstanceOf(Error);
    // Should fallback to String(circular) === '[object Object]'
    expect(wrapped.message).toBe(String(circular));
  });
});

describe('getErrorMessage', () => {
  it('uses toErrorWithMessage under the hood', () => {
    const err = { message: 'hey' };
    expect(getErrorMessage(err)).toBe('hey');

    const numeric = 42;
    expect(getErrorMessage(numeric)).toBe(JSON.stringify(numeric));
  });
});

describe('getErrorWithStack', () => {
  it('returns name, message, and stack for Error instances', () => {
    const err = new Error('oops');
    const result = getErrorWithStack(err);
    expect(result).toHaveProperty('name', err.name);
    expect(result).toHaveProperty('message', 'oops');
    expect(result).toHaveProperty('stack', err.stack);
  });

  it('returns only message for non-Error values', () => {
    const val = { message: 'xyz' };
    const result = getErrorWithStack(val);
    expect(result).toEqual({ message: 'xyz' });

    const num = 123;
    const numResult = getErrorWithStack(num);
    expect(numResult).toEqual({ message: JSON.stringify(num) });
  });
});
