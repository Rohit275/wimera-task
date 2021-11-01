import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Machine } from '../machine.model';
import { MachineService } from '../machine.service';

@Component({
  selector: 'app-machine-edit',
  templateUrl: './machine-edit.component.html',
  styleUrls: ['./machine-edit.component.css'],
})
export class MachineEditComponent implements OnInit {
  public machineId: string;
  machine: Machine;
  SignalType = [
    { id: 'Analog', value: 'Analog' },
    { id: 'Standard', value: 'Standard' },
  ];

  constructor(
    public machineService: MachineService,
    public dialogRef: MatDialogRef<MachineEditComponent>
  ) {}

  ngOnInit(): void {
    this.machineId = this.machineService.getId();
    this.machineService.getMachine(this.machineId).subscribe((machineData) => {
      this.machine = {
        id: machineData._id,
        name: machineData.name,
        type: machineData.type,
        signal: machineData.signal,
        angSignal: machineData.angSignal,
        modbus: machineData.modbus,
      };
    });
  }

  onUpdateMachine(form: NgForm) {
    // console.log('Machine create form values: ', form.value);
    if (form.invalid) {
      return;
    }
    console.log('On Update: ', form.value.angSignal);
    this.machineService.updateMachine(
      this.machineId,
      form.value.name,
      form.value.type,
      form.value.signal,
      form.value.angSignal,
      form.value.modbus
    );
    this.onCancel(form);
  }

  onCancel(form: NgForm) {
    form.resetForm();
    this.dialogRef.close();
  }
}
