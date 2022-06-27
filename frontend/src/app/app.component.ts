import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subject, Observable, of, combineLatest } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { NavigationService } from '@features/navigation/services/navigation.service';
import { ProjectPageActions } from '@features/project/state/actions';
import { AppState } from '@core/interfaces/app.state';
import { Project } from '@core/interfaces/project';
import { getProjects } from '@features/project/state/project.selectors';
import { User } from '@core/interfaces/user';
import { getCurrentUser } from '@features/user/state/user.selectors';
import { loadUsers } from '@features/user/state/actions/user.actions';
import { Location } from '@angular/common';
import { NzProgressModule } from 'ng-zorro-antd/progress';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private subsNotifier = new Subject();
  projects$: Observable<Project[]>;
  currentUser$: Observable<User>;

  isSidebarCollapsed = false;
  public actualRoute: string = '';
  public canMenuVisible: boolean = true;

  constructor(
    private navigationService: NavigationService,
    private store: Store<AppState>,
    private location: Location
  ) {

    this.actualRoute = this.location.path();

    if (this.actualRoute === '' || this.actualRoute === '/register') {
      this.canMenuVisible = false
    } else {
      this.canMenuVisible = true;
    }

  }

  ngOnInit(): void {
    this.navigationService.sidebarCollapseStatusChanged$.pipe(takeUntil(this.subsNotifier)).subscribe(collapseStatus => this.isSidebarCollapsed = collapseStatus);

    this.store.dispatch(ProjectPageActions.loadProjects());
    this.projects$ = combineLatest([this.store.select(getProjects)]).pipe(
      switchMap(([projects]) => {
        const id = localStorage.getItem('currentuserId');
        return of(
          projects?.filter((p) => {
            Boolean(id)
              ? p.leader.id.includes(id)
              : true
          })
        )
      })
    )
    this.store.dispatch(loadUsers());
    this.currentUser$ = this.store.select(getCurrentUser);
  }

  onSidebarCollapsed(sidebarCollapsedStatus: boolean): void {
    this.navigationService.collapseSidebar(sidebarCollapsedStatus);
  }

  ngOnDestroy(): void {
    this.subsNotifier.next();
    this.subsNotifier.complete();
  }
}
