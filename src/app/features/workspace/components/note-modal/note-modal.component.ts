import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppState } from '@core/interfaces/app.state';
import { IssueStatus } from '@core/interfaces/issue';
import { Note } from '@core/interfaces/note';
import { QuillEditorUtil } from '@core/utils/quill';
import { NoteApiActions, NotePageActions } from '@features/note/state/actions';
import { loadNotes } from '@features/note/state/actions/note-page.actions';
import { ofType } from '@ngrx/effects';
import { Store, ActionsSubject } from '@ngrx/store';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.scss'],
})
export class NoteModalComponent implements OnInit, OnDestroy {
  @Input() note$: Observable<Note>;
  private destroy$ = new Subject();
  noteForm: FormGroup;
  isLoading: boolean;

  note: Note;

  editorOptions = QuillEditorUtil.getModuleOptionsWithMedia();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalRef: NzModalRef,
    private actionSubject: ActionsSubject
  ) {}

  ngOnInit(): void {
    this.note$.subscribe((Note) => {
      this.note = Note;
      this.initForm(Note);
    });

    this.actionSubject
      .pipe(
        skip(1),
        ofType(
          NoteApiActions.createNoteSuccess,
          NoteApiActions.createNoteFailure,
          NoteApiActions.updateNoteSuccess,
          NoteApiActions.updateNoteFailure
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.store.dispatch(loadNotes());
        this.closeModal();
      });
  }

  submitForm() {
    if (this.noteForm.invalid) {
      return;
    }
    this.isLoading = true;

    const note: Note = {
      ...this.noteForm.getRawValue(),
    };

    if (this.note) {
      this.store.dispatch(NotePageActions.updateNote({ note }));
    } else {
      this.store.dispatch(NotePageActions.createNote({ note }));
    }
  }

  private initForm(note?: Note): void {
    this.noteForm = this.fb.group({
      id: [note?.id],
      label: [note?.label, [Validators.required, Validators.minLength(5)]],
    });
  }

  closeModal(): void {
    this.modalRef.destroy();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
