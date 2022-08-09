const core = require('@actions/core');
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
      .use(({ value }) => {
        expect(value).toBe(2);
      })
      .run({ value: 0 });

    expect(first).toHaveBeenCalledWith(2);
  });

  it('should handle error and show it to the GH Actions console', async () => {
    core.error = jest.fn();
    core.setFailed = jest.fn();

    const errorMessage = 'Test error';
    const error = new Error(errorMessage);

    expect(
      new Pipeline()
        .use(() => {
          throw error;
        })
        .run()
    );

    expect(core.error).toHaveBeenCalledTimes(1);
    expect(core.error).toHaveBeenCalledWith(error);
    expect(core.setFailed).toHaveBeenCalledWith(errorMessage);
  });
});
