import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzProgressModule } from 'ng-zorro-antd/progress';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { User } from '@core/interfaces/user';
import * as fromFilterActions from '@features/board/state/filter.actions';
import * as fromFilterSelectors from '@features/board/state/filter.selectors';

@Component({
  selector: 'app-board-filter',
  templateUrl: './board-filter.component.html',
  styleUrls: ['./board-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardFilterComponent implements OnInit, OnDestroy {
  porcentaje = 0;

  @Input() assignedUsers$: Observable<User[]>;
  filterForm!: FormGroup;
  onlyMyIssues: Observable<boolean>;
  recentlyUpdatedIssues: Observable<boolean>;
  anyFilter: Observable<boolean>;

  selectedUserIds: string[];
  private destroy$ = new Subject();

  constructor(private fb: FormBuilder, private store: Store<{}>) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      filterQuery: [null],
    });

    this.onlyMyIssues = this.store.select(fromFilterSelectors.getOnlyMyIssues);
    this.recentlyUpdatedIssues = this.store.select(
      fromFilterSelectors.getRecentlyUpdatedIssues
    );
    this.anyFilter = this.store.select(fromFilterSelectors.isAnyFilter);
    // this.onlyMyIssues.subscribe((data) => {
    //   console.log(data);
    // });
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) =>
        this.store.dispatch(
          fromFilterActions.setSearchTermFilter({
            searchTerm: value.filterQuery,
          })
        )
      );

    this.store
      .select(fromFilterSelectors.getUserIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userIds) => (this.selectedUserIds = userIds));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // increase(): void {
  //   this.porcentaje = this.porcentaje + 10;
  //   if (this.porcentaje > 100) {
  //     this.porcentaje = 100;
  //   }
  // }

  // decline(): void {
  //   this.porcentaje = this.porcentaje - 10;
  //   if (this.porcentaje < 0) {
  //     this.porcentaje = 0;
  //   }
  // }

  toggleUser(userId: string = 'unassigned'): void {
    this.store.dispatch(fromFilterActions.toggleUser({ userId }));
  }

  isUserSelected(userId: string = 'unassigned'): boolean {
    return this.selectedUserIds.includes(userId);
  }

  toggleOnlyMyIssues(): void {
    this.store.dispatch(fromFilterActions.toggleOnlyMyIssues());
  }

  toggleRecentlyUpdatedIssues(): void {
    this.store.dispatch(fromFilterActions.toggleRecentlyUpdated());
  }

  clearAll(): void {
    this.filterForm.reset();
    this.store.dispatch(fromFilterActions.clearAllFilters());
  }
}
