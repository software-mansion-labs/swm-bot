const withErrorHandling = require('./withErrorHandling');
const core = require('@actions/core');

describe('withErrorHandling', () => {
  it('should handle error and show it to GH Actions console', async () => {
    core.error = jest.fn();
    core.setFailed = jest.fn();

    const errorMessage = 'Test error';
    const error = new Error(errorMessage);

    const fn = async () => {
      throw error;
    };

    await expect(withErrorHandling(fn)).resolves.toBe(undefined);
    expect(core.error).toHaveBeenCalledWith(error);
    expect(core.setFailed).toHaveBeenCalledWith(errorMessage);
  });
});
