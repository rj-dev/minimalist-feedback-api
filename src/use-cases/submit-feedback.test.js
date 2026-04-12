import { describe, it, expect } from 'vitest';
import { SubmitFeedback } from './submit-feedback';
import { InMemoryFeedbackRepository } from '../repositories/in-memory/in-memory-feedback-repository';

describe('Submit Feedback Use Case', () => {
  it('should be able to submit a feedback', async () => {
    const repository = new InMemoryFeedbackRepository();
    const submitFeedback = new SubmitFeedback(repository);

    const response = await submitFeedback.execute({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This API architecture is amazing!'
    });

    expect(response.name).toBe('John Doe');
    expect(repository.feedbacks).toHaveLength(1);
  });

  it('should not be able to submit feedback with invalid email', async () => {
    const repository = new InMemoryFeedbackRepository();
    const submitFeedback = new SubmitFeedback(repository);

    await expect(submitFeedback.execute({
      name: 'John Doe',
      email: 'invalid-email',
      message: 'Oops'
    })).rejects.toThrow();
  });
});