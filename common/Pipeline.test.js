const Pipeline = require('./Pipeline');

describe('Pipeline', () => {
  it('should implement basic middleware pattern', () => {
    const first = jest.fn();
    const second = jest.fn();

    new Pipeline()
      .use((_, next) => {
        first();
        next();
      })
      .use((_, next) => {
        second();
        next();
      })
      .run();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('should not call another function in pipeline when next() was not executed', () => {
    const first = jest.fn();

    const test = false;

    new Pipeline()
      .use((_, next) => {
        if (test) {
          next();
        }
      })
      .use(() => {
        first();
      })
      .run();

    expect(first).toHaveBeenCalledTimes(0);
  });

  it('should use context to pass data down the pipeline', () => {
    const first = jest.fn();
    const value = 0;

    new Pipeline()
      .use((context, next) => {
        context.value += 1;
        next();
      })
      .use((context, next) => {
        context.value += 1;
        first(context.value);
        next();
      })
      .run({ value });
    expect(first).toHaveBeenCalledWith(2);
  });
});
