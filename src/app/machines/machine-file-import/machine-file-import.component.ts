import { Component, OnInit, ViewChild } from '@angular/core';

import { MachineService } from '../machine.service';

import { MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import * as _ from 'underscore';

@Component({
  selector: 'app-machine-file-import',
  templateUrl: './machine-file-import.component.html',
  styleUrls: ['./machine-file-import.component.css'],
})
export class MachineFileImportComponent implements OnInit {
  private header: boolean = true;
  public isLoading: boolean = false;
  public isValidFile: boolean = false;
  public isHeader: boolean = false;
  public isChecked: boolean = false;

  selectedRadio: string;

  csvRecords: any = [];
  columnKey: any[] = [];
  columnValues = [];

  public row;
  public rows: any[] = [
    { id: 1, name: 'Row 1', value: '0' },
    { id: 2, name: 'Row 2', value: '1' },
    { id: 3, name: 'Row 3', value: '2' },
    { id: 4, name: 'Row 4', value: '3' },
    { id: 5, name: 'Row 5', value: '4' },
  ];

  constructor(
    private ngxCsvParser: NgxCsvParser,
    public machineService: MachineService,
    public dialogRef: MatDialogRef<MachineFileImportComponent>
  ) {}

  ngOnInit(): void {}

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
    this.header =
      (this.header as unknown as string) === 'true' || this.header === false;
    this.readData(files);
  }

  readData(files) {
    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: ',' })
      .pipe()
      .subscribe(
        (result: Array<any>) => {
          this.csvRecords.push(...result);
          this.isValidFile = true;
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        }
      );
  }

  getRadio() {
    this.row = this.selectedRadio;
    this.isValidFile = false;
    this.isHeader = true;
    console.log('Radio value: ', this.selectedRadio);
  }

  getSelectedColumn(value, event: MatCheckboxChange, index) {
    if (event.checked) {
      this.isChecked = true;
      this.columnKey.push({ index: index, Column: value });
    } else {
      console.log('Column Key length:', this.columnKey.length);
      if (this.columnKey.length - 1 == 0) {
        this.isChecked = false;
      }
      let index = this.columnKey.indexOf(value);
      this.columnKey.splice(index, 1);
    }
    console.log(this.columnKey);
  }

  getColumnValues() {
    var i,
      j = 0,
      arr = [];
    for (i = this.row; i < this.csvRecords.length; i++) {
      arr[i] = [];
      for (j = 0; j < this.columnKey.length; j++) {
        var val = this.columnKey[j].index;
        arr[i][j] = this.csvRecords[i][val];
      }
    }
    return arr;
  }

  convertKeyValue(final) {
    var output: any[] = [];
    let i = parseInt(this.row);
    for (let index = i + 1; index < final.length; index++) {
      output.push(_.object(final[i], final[index]));
    }
    return output;
  }

  onAddFile() {
    if (this.csvRecords.length > 0) {
      var filteredData = [],
        final = [];
      final = this.getColumnValues();

      filteredData = this.convertKeyValue(final);
      // console.log('Key value Pairs', filteredData);

      this.machineService.importCsv(filteredData);
      setTimeout(() => {
        this.isLoading = true;
        this.machineService.getMachines();
        this.dialogRef.close();
      }, 1000);
      this.isLoading = false;
    }
    // console.log('CSV: ', this.csvRecords);
  }
}
