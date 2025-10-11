import { Injectable, LoggerService, Scope } from '@nestjs/common';

export type LogContext = {
  [key: string]: unknown;
};

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  private formatMessage(
    level: string,
    message: string,
    meta?: LogContext,
  ): string {
    const base = `[${level}]${this.context ? ' [' + this.context + ']' : ''} ${message}`;
    return meta ? `${base} | ${JSON.stringify(meta)}` : base;
  }

  private normalizeInput(input: unknown): {
    message: string;
    stack?: string;
    extra?: unknown;
  } {
    if (input instanceof Error) {
      return { message: input.message, stack: input.stack };
    }
    if (typeof input === 'string') {
      return { message: input };
    }
    return { message: 'Unknown error object', extra: input };
  }

  log(message: string | Error, meta?: LogContext) {
    const { message: msg, extra } = this.normalizeInput(message);
    console.log(this.formatMessage('INFO', msg, { ...meta, extra }));
  }

  error(error: unknown, trace?: string, meta?: LogContext) {
    const { message, stack, extra } = this.normalizeInput(error);
    console.error(this.formatMessage('ERROR', message, { ...meta, extra }));
    if (stack) console.error(stack);
    if (trace) console.error(trace);
  }

  warn(errorOrMessage: unknown, meta?: LogContext) {
    const { message, extra } = this.normalizeInput(errorOrMessage);
    console.warn(this.formatMessage('WARN', message, { ...meta, extra }));
  }

  debug(errorOrMessage: unknown, meta?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      const { message, extra } = this.normalizeInput(errorOrMessage);
      console.debug(this.formatMessage('DEBUG', message, { ...meta, extra }));
    }
  }
}
