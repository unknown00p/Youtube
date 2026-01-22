import type { RequestHandler } from "express";

// this is a warper function(high lvl fn) where you warp incomming function where your main logic lies. so we don't have to wrap our logic in try catch, We are forwarding errors to error handling middleware
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  // we are returning the function with req, res and next.
  return (req, res, next) => {
    // here we are resolving the incomming fn if its a promise and sending the error to error handling middleware
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
