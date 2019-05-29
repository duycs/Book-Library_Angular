import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBookService } from '../../../core/services/books.service';
import { Book } from '../../../shared/models/book';
import { FormGroup, Validators, NgForm, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  bookForm: FormGroup;
  id: number = null;
  isbn: string = '';
  title: string = '';
  subject: string = '';
  publisher: string = '';
  language: string = '';
  pageNumber: string = '';
  isLoadingResults = false;

  constructor(private router: Router, private route: ActivatedRoute, 
    private api: ApiBookService, 
    private formBuilder: FormBuilder,
     private alertService: AlertService) { }

  ngOnInit() {
    this.getBook(this.route.snapshot.params['id']);
    this.bookForm = this.formBuilder.group({
      'id': [null],
      'isbn': [null, Validators.required],
      'title': [null, Validators.required],
      'subject': [null],
      'publisher': [null],
      'language': [null],
      'pageNumber': [null]
    });
  }

  getBook(id) {
    this.api.getBook(id).subscribe(data => {
      console.log(data);
      this.id = data.id;
      this.bookForm.setValue({
        id: data.id,
        isbn: data.isbn,
        title: data.title,
        subject: data.subject,
        publisher: data.publisher,
        language : data.language,
        pageNumber: data.pageNumber
      });
    });
  }

  onFormSubmit(form: NgForm) {
    this.isLoadingResults = true;
    this.api.updateBook(this.id, form)
      .subscribe(res => {
        this.alertService.showToastSuccess();
        this.router.navigate(['/librarians/findBooks']);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  bookDetails() {
    this.router.navigate(['/librarians/findBook', this.id]);
  }

}