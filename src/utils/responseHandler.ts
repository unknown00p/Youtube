export class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  constructor(statusCode: number, message: string, data: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}