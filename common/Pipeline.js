const core = require('@actions/core');

// Code adopted from https://muniftanjim.dev/blog/basic-middleware-pattern-in-javascript/
class Pipeline {
  constructor(...middlewares) {
    this.stack = middlewares;
  }

  use(middleware) {
    this.stack.push(middleware);
    return this;
  }

  async run(context = {}) {
    let prevIndex = -1;

    const runner = async (index) => {
      if (index === prevIndex) {
        throw new Error('next() called multiple times');
      }
      prevIndex = index;

      const middleware = this.stack[index];

      if (middleware) {
        try {
          await middleware(context, () => runner(index + 1));
        } catch (e) {
          core.error(e);
          core.setFailed(e.message);
        }
      }
    };

    await runner(0);
  }
}

module.exports = Pipeline;
