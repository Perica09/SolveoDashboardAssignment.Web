import { HttpParams } from '@angular/common/http';

/**
 * Utility function to build HttpParams from an object
 * Handles null/undefined values and arrays
 * 
 * @param params - Object with key-value pairs to convert to HttpParams
 * @returns HttpParams object ready to use in HTTP requests
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildHttpParams(params?: any): HttpParams {
  let httpParams = new HttpParams();
  
  if (!params) {
    return httpParams;
  }

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => {
          httpParams = httpParams.append(key, item.toString());
        });
      } else {
        httpParams = httpParams.set(key, value.toString());
      }
    }
  });

  return httpParams;
}
