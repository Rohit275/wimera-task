import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Machine } from './machine.model';

@Injectable({ providedIn: 'root' })
export class MachineService {
  private machines: any = [];
  private machinesUpdated = new Subject<any[]>();
  dynamicColumns: any = [];
  private editId;
  config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  constructor(private http: HttpClient, public router: Router) {}

  public getDataMachines() {
    return this.http
      .get('http://localhost:3000/api/machines')
      .subscribe((machineData) => {
        this.machines = machineData;
        this.machinesUpdated.next([...this.machines]);
      });
  }

  getMachines() {
    // console.log('Service getMachine: ', this.machines);
    // return this.machines;
    this.http
      .get<{ message: string; machines: any }>(
        'http://localhost:3000/api/machines'
      )
      .pipe(
        map((machineData) => {
          return machineData.machines;
        })
      )
      .subscribe((machineData) => {
        this.machines = machineData;
        this.machinesUpdated.next([...this.machines]);
      });
  }

  getMachineUpdateListener() {
    return this.machinesUpdated.asObservable();
  }

  putDynamicColumns(value) {
    this.dynamicColumns = value;
  }

  getDynamicColumns() {
    return this.dynamicColumns;
  }

  importCsv(csvData) {
    this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/machines/import',
        csvData,
        this.config
      )
      .subscribe((respData) => {
        console.log(respData.message);
        this.machinesUpdated.next([...this.machines]);
      });
  }

  addData(data) {
    this.http
      .post<{ message: string }>('http://localhost:3000/api/machines', data)
      .subscribe((respData) => {
        console.log(respData.message);
        this.machinesUpdated.next([...this.machines]);
      });
  }

  getHeaders(headers) {
    console.log('Received the headers in service.js', headers);
    this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/machines/passHeaders',
        headers,
        this.config
      )
      .subscribe((respData) => {
        console.log(respData.message);
      });
  }

  postId(id: string) {
    this.editId = id;
  }
  getId() {
    return this.editId;
  }

  getMachine(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      type: string;
      signal: string;
      angSignal: string;
      modbus: number;
    }>('http://localhost:3000/api/machines/' + id);
  }

  addMachine(
    name: string,
    type: string,
    signal: string,
    angSignal: string,
    modbus: number
  ) {
    const machine: Machine = {
      id: null,
      name: name,
      type: type,
      signal: signal,
      angSignal: angSignal,
      modbus: modbus,
    };
    this.http
      .post<{ message: string; machineId: string }>(
        'http://localhost:3000/api/machines',
        machine
      )
      .subscribe((respData) => {
        console.log(respData.message);
        const id = respData.machineId;
        machine.id = id;
        this.machines.push(machine);
        this.machinesUpdated.next([...this.machines]);
      });
  }

  updateMachine(
    id: string,
    name: string,
    type: string,
    signal: string,
    angSignal: string,
    modbus: number
  ) {
    const machine: Machine = {
      id: id,
      name: name,
      type: type,
      signal: signal,
      angSignal: angSignal,
      modbus: modbus,
    };
    this.http
      .put('http://localhost:3000/api/machines/' + id, machine)
      .subscribe((res) => {
        console.log('At machine update service: ', machine);
        const updatedMachines = [...this.machines];
        const oldMachineIndex = updatedMachines.findIndex(
          (m) => m.id === machine.id
        );
        updatedMachines[oldMachineIndex] = machine;
        this.machines = updatedMachines;
        this.machinesUpdated.next([...this.machines]);
      });
  }

  deleteMachine(machineId: string) {
    this.http
      .delete('http://localhost:3000/api/machines/' + machineId)
      .subscribe(() => {
        console.log('Deleted!');
        const updatedMachines = this.machines.filter(
          (machine) => machine.id !== machineId
        );
        this.machines = updatedMachines;
        this.machinesUpdated.next([...this.machines]);
      });
  }
}
