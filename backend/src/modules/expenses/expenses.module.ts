import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesAgentController } from './expenses.agent.controller';
import { ExpensesService } from './expenses.service';

@Module({
  controllers: [ExpensesController, ExpensesAgentController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
