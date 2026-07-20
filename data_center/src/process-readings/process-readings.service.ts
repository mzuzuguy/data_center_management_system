import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessReading } from './entities/process-reading.entity';


@Injectable()
export class ProcessReadingsService {


constructor(
@InjectRepository(ProcessReading)
private repo:Repository<ProcessReading>
){}



create(data:any){

return this.repo.save(data);

}



findAll(){

return this.repo.find({
order:{
 cpu_usage:'DESC'
}
});

}


}