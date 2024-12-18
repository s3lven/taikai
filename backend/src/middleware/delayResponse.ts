import { Request, Response, NextFunction } from 'express';

const REQUEST_DELAY = 5000;
// const RESPONSE_DELAY = 5000;

export const delayResponse = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.url)
  if (req.url === '/') {
    // Delay request
    setTimeout(next, REQUEST_DELAY);
  }
};

