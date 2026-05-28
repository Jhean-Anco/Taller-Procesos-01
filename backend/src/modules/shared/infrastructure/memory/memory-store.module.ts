import { Global, Module } from '@nestjs/common';
import { InstitutionalMemoryStore } from './institutional-memory-store';

@Global()
@Module({
  providers: [InstitutionalMemoryStore],
  exports: [InstitutionalMemoryStore],
})
export class MemoryStoreModule {}
