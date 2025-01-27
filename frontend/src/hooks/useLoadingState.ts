import { useState, useCallback } from 'react';
import { errorTracking } from '../services/errorTracking';

interface UseLoadingStateOptions {
  trackError?: boolean;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const withLoading = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      if (options.trackError) {
        errorTracking.trackError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [options.trackError]);

  return { isLoading, error, withLoading };
} 