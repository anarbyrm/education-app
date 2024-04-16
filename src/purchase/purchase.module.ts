import { Module } from '@nestjs/common';
import { PurchaseService } from './services/purchase.service';
import { PurchaseController } from './controllers/purchase.controller';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Purchase } from './entities/purchase.entity';
import { OrderItem } from './entities/order-item.entity';
import { CourseModule } from 'src/course/course.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Purchase, OrderItem]),
    CourseModule
  ],
  controllers: [PurchaseController, CartController],
  providers: [PurchaseService, CartService],
  exports: [TypeOrmModule]
})
export class PurchaseModule {}
