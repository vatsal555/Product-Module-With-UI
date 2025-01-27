interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  additionalData?: Record<string, unknown>;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  init() {
    if (this.isInitialized) return;

    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    this.isInitialized = true;
  }

  trackError(error: Error | unknown, details?: ErrorDetails) {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', { error, details });
      return;
    }

    // In production, you could send to a service like Sentry
    // this.sendToErrorService({ error, details });
    
    // For now, just log to console
    console.error('Error tracked:', { error, details });
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.trackError(event.reason, {
      message: 'Unhandled Promise Rejection',
      additionalData: { reason: event.reason }
    });
  };

  private sendToErrorService(data: { error: unknown; details?: ErrorDetails }) {
    // Implement integration with error tracking service (e.g., Sentry)
    // Example:
    // Sentry.captureException(data.error, {
    //   extra: data.details
    // });
  }
}

export const errorTracking = ErrorTrackingService.getInstance(); 