import { Component, OnInit, ViewChild } from '@angular/core';

import { MachineService } from '../machine.service';

import { MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import * as _ from 'underscore';
import { ThisReceiver, ThrowStmt } from '@angular/compiler';

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
  public isKeyValue: boolean = false;
  public KeyValueRow: boolean = false;
  public keyValue: boolean = false;
  public isValueAdded: boolean = false;
  selectedRadio: string;

  csvRecords: any = [];
  columnKey: any[] = [];
  keyValuePairs: any[] = [];
  columnValues = [];

  public row;
  public choiceVal;
  public keyvalrow;
  public FileName;
  public rows: any[] = [
    { id: 1, name: 'Row 1', value: '0' },
    { id: 2, name: 'Row 2', value: '1' },
    { id: 3, name: 'Row 3', value: '2' },
    { id: 4, name: 'Row 4', value: '3' },
    { id: 5, name: 'Row 5', value: '4' },
  ];
  public choice: any[] = [
    { id: 1, value: 'Yes' },
    { id: 2, value: 'No' },
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
    this.FileName = $event.srcElement.files[0].name;
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
          this.isKeyValue = true;
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        }
      );
  }

  getChoice() {
    this.choiceVal = this.selectedRadio;
    if (this.choiceVal == 'Yes') {
      this.isKeyValue = false;
      this.KeyValueRow = true;
      this.isValidFile = false;
      this.selectedRadio = null;
    } else if (this.choiceVal == 'No') {
      this.KeyValueRow = false;
      this.isKeyValue = false;
      this.isValidFile = true;
      this.selectedRadio = null;
    }
  }

  getKeyValuesRow() {
    this.keyvalrow = this.selectedRadio;
    this.selectedRadio = null;
    this.KeyValueRow = false;
    this.isKeyValue = false;
    this.keyValue = true;
  }
  getRadio() {
    this.row = this.selectedRadio;
    this.isValidFile = false;
    this.isHeader = true;
    console.log('Radio value: ', this.selectedRadio);
  }

  getSelectedKeyValues(value, event: MatCheckboxChange) {
    if (event.checked) {
      this.isValueAdded = true;
      this.keyValuePairs.push(value);
    } else {
      if (this.keyValuePairs.length - 1 == 0) {
        this.isValueAdded = false;
      }
      let index = this.keyValuePairs.indexOf(value);
      this.keyValuePairs.splice(index, 1);
    }
    console.log(this.keyValuePairs);
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

  onNextFile() {
    this.keyValue = false;
    this.isValidFile = true;
    console.log('File Name :', this.FileName);
    this.machineService.passKeyValue(this.FileName, this.keyValuePairs);
  }

  onBack() {
    this.KeyValueRow = false;
    this.isKeyValue = true;
    if (this.isValidFile) {
      this.isValidFile = false;
      this.isKeyValue = true;
    }
    if (this.keyValue) {
      this.keyValue = false;
      this.isKeyValue = true;
    }
    if (this.isHeader) {
      this.isHeader = false;
      this.isKeyValue = true;
    }
  }
  onAddFile() {
    if (this.csvRecords.length > 0) {
      var filteredData = [],
        final = [];
      final = this.getColumnValues();

      filteredData = this.convertKeyValue(final);

      this.machineService.importCsv(this.FileName, filteredData);
      setTimeout(() => {
        this.isLoading = true;
        this.machineService.getMachines();
        this.machineService.getCollections();
        this.dialogRef.close();
      }, 1000);
      this.isLoading = false;
    }
    // console.log('CSV: ', this.csvRecords);
  }
}
