const Pipeline = require('./Pipeline');

describe('Pipeline', () => {
  it('should implement basic middleware pattern', () => {
    const first = jest.fn();
    const second = jest.fn();

    new Pipeline()
      .use((next) => {
        first();
        next();
      })
      .use((next) => {
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
      .use((next) => {
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
});
