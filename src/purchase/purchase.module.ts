import { Module } from '@nestjs/common';
import { PurchaseService } from './services/purchase.service';
import { PurchaseController } from './controllers/purchase.controller';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';


@Module({
  controllers: [PurchaseController, CartController],
  providers: [PurchaseService, CartService],
})
export class PurchaseModule {}
