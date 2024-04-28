import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [ConfigModule.forRoot(), ItemsModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
