import { createTodoSuccess } from './../../../todo/state/actions/todo-api.actions';
import { Todo } from '@core/interfaces/todo';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppState } from '@core/interfaces/app.state';
import { Issue, IssueStatus, IssuePriority } from '@core/interfaces/issue';
import { IssuePageActions } from '@features/issues/state/actions';
import { TodoApiActions, TodoPageActions } from '@features/todo/state/actions';
import { Store, ActionsSubject } from '@ngrx/store';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { ofType } from '@ngrx/effects';
import { skip, takeUntil } from 'rxjs/operators';
import { getAllTodos } from '@features/todo/state/todo.selectors';
import { loadTodos } from '@features/todo/state/actions/todo-page.actions';

@Component({
  selector: 'app-workspace-create-todo',
  templateUrl: './workspace-create-todo.component.html',
  styleUrls: ['./workspace-create-todo.component.scss'],
})
export class WorkspaceCreateTodoComponent implements OnInit, OnDestroy {
  @Input() todo$: Observable<Todo>;
  private destroy$ = new Subject();
  todoForm: FormGroup;
  isLoading: boolean;

  todo: Todo;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private modalRef: NzModalRef,
    private actionSubject: ActionsSubject
  ) {}

  ngOnInit(): void {
    this.todo$.subscribe((todo) => {
      this.todo = todo;
      this.initForm(todo);
    });

    this.actionSubject
      .pipe(
        skip(1),
        ofType(
          TodoApiActions.createTodoSuccess,
          TodoApiActions.createTodoFailure,
          TodoApiActions.updateTodoSuccess,
          TodoApiActions.updateTodoFailure
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.store.dispatch(loadTodos());
        this.closeModal();
      });
  }

  submitForm() {
    if (this.todoForm.invalid) {
      return;
    }
    this.isLoading = true;

    const todo: Todo = {
      ...this.todoForm.getRawValue(),
      listPosition: 0,
      status: IssueStatus.BACKLOG,
    };

    if (this.todo) {
      this.store.dispatch(TodoPageActions.updateTodo({ todo }));
    } else {
      this.store.dispatch(TodoPageActions.createTodo({ todo }));
    }
  }

  private initForm(todo?: Todo): void {
    this.todoForm = this.fb.group({
      id: [todo?.id],
      label: [todo?.label, [Validators.required, Validators.minLength(5)]],
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
