import { Request, Response } from 'express';
import { paymentServices } from './payment.service';

const confirmationController = async (req: Request, res: Response) => {
  console.log(req.query.transactionId);
  const { transactionId, status } = req.query;

  const result = await paymentServices.confirmationService(
    transactionId as string,
    status as string
  );
  // res.send(result)
  res.send(result);
};

const getAllPayments = async (req: Request, res: Response) => {
  const result = await paymentServices.getAllPaymentsFromDB();
  res.send(result);
};

export const paymentControler = {
  confirmationController,
  getAllPayments,
};
