import { loadNotes } from './../../../note/state/actions/note-page.actions';
import { getTodoById } from './../../../todo/state/todo.selectors';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { ActionsSubject, Store } from '@ngrx/store';

import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import {
  tap,
  map,
  switchMap,
  takeUntil,
  toArray,
  mergeMap,
  skip,
} from 'rxjs/operators';

import {
  Issue,
  IssueStatus,
  WorkspaceStatus,
  IssueType,
} from '@core/interfaces/issue';

import { IssuePageActions } from '@features/issues/state/actions';
import { AppState } from '@core/interfaces/app.state';
import * as fromFilterSelectors from '@features/board/state/filter.selectors';
import * as fromFilter from '@features/board/state/filter.reducer';
import * as fromUserSelectors from '@features/user/state/user.selectors';
import { DateUtil } from '@core/utils/date';
import { WorkspaceCreateTodoComponent } from '@features/workspace/components/workspace-create-todo/workspace-create-todo.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  loadMeetingIssues,
  loadUpcommingIssues,
} from '@features/issues/state/actions/issue-page.actions';
import {
  deleteTodo,
  loadTodos,
  updateTodo,
} from '@features/todo/state/actions/todo-page.actions';
import { Todo } from '@core/interfaces/todo';
import { getAllTodos } from '@features/todo/state/todo.selectors';
import { getAllNotes, getNoteById } from '@features/note/state/todo.selectors';
import { Note } from '@core/interfaces/note';
import { NoteModalComponent } from '@features/workspace/components/note-modal/note-modal.component';
import { deleteNote } from '@features/note/state/actions/note-page.actions';
import { NoteApiActions } from '@features/note/state/actions';
import { ofType } from '@ngrx/effects';
import { TodoApiActions } from '@features/todo/state/actions';
import {
  getAllMeetingIssues,
  getAllUpcomingIssues,
} from '@features/issues/state/selectors/issue.selectors';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-board-workspace',
  templateUrl: './board-workspace.component.html',
  styleUrls: ['./board-workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class BoardWorkspaceComponent implements OnInit, OnDestroy {
  items = [
    {
      id: 1,
      active: true,
    },
    {
      id: 2,
      active: true,
    },
    {
      id: 3,
      active: true,
    },
    {
      id: 4,
      active: true,
    },
    {
      id: 5,
      active: true,
    },
    {
      id: 6,
      active: false,
    },
    {
      id: 7,
      active: false,
    },
    {
      id: 8,
      active: false,
    },
    {
      id: 9,
      active: false,
    },
    {
      id: 10,
      active: false,
    },
  ];

  @Input() status: any;
  issues$: Observable<Issue[]>;
  upcomingIssues$: Observable<Issue[]>;
  todos$: Observable<Todo[]>;
  notes$: Observable<Note[]>;
  issuesCount$: Observable<number>;
  anyFilter: Observable<boolean>;
  totalIssuesFiltered: Observable<number>;

  currentUserId: string;
  private destroy$ = new Subject();

  issuesStatuses: IssueStatus[] = [
    IssueStatus.BACKLOG,
    IssueStatus.IN_PROGRESS,
    IssueStatus.IN_REVIEW,
    IssueStatus.DONE,
  ];

  today = new Date();
  tomorrow = new Date();
  firstDayOfWeek;
  weeklyIssuesNumber = 0;
  weeklyIssuesDoneNumber = 0;

  constructor(
    private store: Store<AppState>,
    private modalService: NzModalService,
    private actionSubject: ActionsSubject,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    this.tomorrow.setDate(this.tomorrow.getDate() + 2);
    this.tomorrow.setHours(0, 0, 0, 0);

    const inputDate = new Date(this.today);
    const dayOfWeek = inputDate.getDay();
    const diff = inputDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday being the first day of the week
    this.firstDayOfWeek = new Date(inputDate.setDate(diff));

    this.store.dispatch(loadMeetingIssues());
    this.store.dispatch(loadTodos());
    this.store.dispatch(loadNotes());
    this.store.dispatch(loadUpcommingIssues());

    this.store
      .select(fromUserSelectors.getCurrentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentUserId) => (this.currentUserId = currentUserId));

    this.anyFilter = this.store.select(fromFilterSelectors.isAnyFilter);

    this.issues$ = combineLatest([
      this.store.select(getAllMeetingIssues).pipe(
        map((issues) =>
          issues
            .filter((i) => i.type == 'Meeting')
            .sort((a, b) => a.listPosition - b.listPosition)
        ),
        tap((issues) => (this.issuesCount$ = of(issues.length)))
      ),
      this.store.select(fromFilterSelectors.getFilterState),
    ]).pipe(
      switchMap(([issues, filterState]) =>
        this.filterIssues(issues, filterState)
      ),
      tap((issues) => (this.totalIssuesFiltered = of(issues.length)))
    );

    this.todos$ = this.store
      .select(getAllTodos)
      .pipe(
        map((items) =>
          [...items].sort(
            (a, b) =>
              new Date(b['createdAt']).getTime() -
              new Date(a['createdAt']).getTime()
          )
        )
      );

    this.notes$ = this.store
      .select(getAllNotes)
      .pipe(
        map((items) =>
          [...items].sort(
            (a, b) =>
              new Date(b['createdAt']).getTime() -
              new Date(a['createdAt']).getTime()
          )
        )
      );

    this.upcomingIssues$ = this.store
      .select(getAllUpcomingIssues)
      .pipe(
        map((issues) =>
          [...issues].filter(
            (issue) =>
              new Date(issue.deadline).getTime() >= this.today.getTime() &&
              new Date(issue.deadline).getTime() <= this.tomorrow.getTime()
          )
        )
      );

    const WeeklyIssues$ = this.store
      .select(getAllUpcomingIssues)
      .pipe(
        map((issues) =>
          [...issues].filter(
            (issue) =>
              new Date(issue.deadline).getTime() >=
                this.firstDayOfWeek.getTime() &&
              new Date(issue.deadline).getTime() <= new Date().getTime()
          )
        )
      );

    WeeklyIssues$.subscribe((issues) => {
      if (issues.length > 0) {
        this.weeklyIssuesNumber = issues.length;

        const doneWeeklyTasks = issues.filter(
          (issue) => issue.status === IssueStatus.DONE
        );
        this.weeklyIssuesDoneNumber = doneWeeklyTasks.length;
        (doneWeeklyTasks.length / this.weeklyIssuesNumber) * 100;
        this.items.forEach((item, index) => {
          const nes =
            (this.weeklyIssuesDoneNumber * 10) / this.weeklyIssuesNumber;
          console.log('nes >> ', nes);
          if (item.id <= nes) {
            item.active = true;
          } else {
            item.active = false;
          }
        });
      }
    });

    this.actionSubject
      .pipe(ofType(NoteApiActions.deleteNoteSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(loadNotes());
      });

    this.actionSubject
      .pipe(ofType(TodoApiActions.deleteTodoSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(loadTodos());
      });
  }

  private filterIssues(
    issues: Issue[],
    filter: fromFilter.State
  ): Observable<Issue[]> {
    const { searchTerm, userIds, onlyMyIssues, recentlyUpdated } = filter;
    return of(
      issues.filter((issue) => {
        const isMatchTerm = searchTerm
          ? issue.title
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase())
          : true;

        const issueUserIds = issue.assignees.map((u) => u.id);

        if (!issueUserIds.length) {
          // no user assigned in the issue
          issueUserIds.push('unassigned');
        }
        const isIncludeUsers = userIds.length
          ? issueUserIds.some((userId) => userIds.includes(userId))
          : true;

        const areMyIssues = onlyMyIssues
          ? this.currentUserId && issueUserIds.includes(this.currentUserId)
          : true;

        const areRecentlyUpdated = recentlyUpdated
          ? DateUtil.getDays(new Date(issue.updatedAt)) === 0
          : true;

        return (
          isMatchTerm && isIncludeUsers && areMyIssues && areRecentlyUpdated
        );
      })
    );
  }

  openNoteModal(note?: Note) {
    this.modalService.create({
      nzTitle: note ? 'Edit Note' : 'Create Note',
      nzContent: NoteModalComponent,
      nzWidth: 500,
      nzClosable: false,
      nzFooter: null,
      nzComponentParams: {
        note$: note
          ? this.store.select(getNoteById, { noteId: note['id'] })
          : of(null),
      },
    });
  }

  openTodoModal(todo?: Todo): void {
    this.modalService.create({
      nzTitle: todo ? 'Edit ToDo' : 'Create ToDo',
      nzContent: WorkspaceCreateTodoComponent,
      nzWidth: 500,
      nzClosable: false,
      nzFooter: null,
      nzComponentParams: {
        todo$: todo
          ? this.store.select(getTodoById, { todoId: todo['id'] })
          : of(null),
      },
    });
  }

  updateTodoChecked(todo: Todo, event) {
    const newTodo = {
      ...todo,
      checked: event.target.checked,
    };
    this.store.dispatch(updateTodo({ todo: newTodo }));
    this.store.dispatch(loadTodos());
  }

  deleteTodo(todo: Todo) {
    this.store.dispatch(deleteTodo({ todoId: todo['id'] }));
  }

  deleteNote(note: Note) {
    this.store.dispatch(deleteNote({ noteId: note['id'] }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
