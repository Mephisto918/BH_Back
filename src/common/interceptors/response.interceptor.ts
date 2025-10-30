import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const filters = request.query; // Capture query parameters (filters)

    return next.handle().pipe(
      map((data) => {
        // Determine result count
        let count = 0;
        if (Array.isArray(data)) count = data.length;
        else if (
          data &&
          typeof data === 'object' &&
          Array.isArray(data.results)
        )
          count = data.results.length;
        else count = 1;

        return {
          success: true,
          stats: {
            count,
            filters,
          },
          results: data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
