import { Controller } from '@nestjs/common';
import { PurchaseService } from '../services/purchase.service';


@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  // get orders
  // get an order
  // update order
  // create order
  // delete order
}
