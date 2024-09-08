import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    NgxMaterialTimepickerModule,
    MatButtonModule,
    MatDividerModule,
  ],
})
export class AddDataComponent implements OnInit {
  dataForm: FormGroup;
  maxDate: Date;
  submittedData: any[] = [];

  constructor(private fb: FormBuilder) {
    this.maxDate = new Date();
    this.dataForm = this.fb.group({
      entries: this.fb.array([this.createEntry()])
    });
  }
  ngOnInit() {
    const storedData = localStorage.getItem('addedData');
    if (storedData) {
      const formData = JSON.parse(storedData);
      this.patchFormData(formData);
      this.submittedData = formData
    }
  }

  patchFormData(formData: any[]) {
    this.entries.clear();

    formData.forEach(data => {
      const entry = this.createEntry();
      entry.patchValue(data);
      this.entries.push(entry);
    });
  }

  get entries(): FormArray {
    return this.dataForm.get('entries') as FormArray;
  }

  createEntry(): FormGroup {
    return this.fb.group({
      date: ['', [Validators.required, this.pastDateValidator.bind(this)]],
      time: ['', Validators.required],
      temperature: ['', [Validators.required, Validators.min(-50), Validators.max(50)]],
    });
  }

  addEntry() {
    this.entries.push(this.createEntry());
  }

  removeEntry(index: number) {
    if (this.entries.length > 1) {
      this.entries.removeAt(index);
    }
  }

  pastDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today ? null : { futureDate: true };
  }

  onSubmit() {
    if (this.dataForm.valid) {
      this.submittedData = this.dataForm.value.entries
      localStorage.setItem('addedData', JSON.stringify(this.submittedData))
    } else {
      alert("invalid form")
    }
  }
}
