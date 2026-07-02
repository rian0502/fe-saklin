import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { BreadcrumbItem } from '../../types/breadcrumb-item.model';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly items = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.buildTrail()),
      startWith(this.buildTrail()),
    ),
    { initialValue: [] as BreadcrumbItem[] },
  );

  private buildTrail(): BreadcrumbItem[] {
    const trail: BreadcrumbItem[] = [];
    let route: ActivatedRoute | null = this.activatedRoute.root;
    let url = '';

    while (route) {
      const child: ActivatedRoute | null = route.firstChild;

      if (!child?.snapshot) {
        break;
      }

      const segment = child.snapshot.url.map((urlSegment) => urlSegment.path).join('/');

      if (segment) {
        url += `/${segment}`;
      }

      const label = child.snapshot.data['breadcrumb'] as string | undefined;

      if (label) {
        trail.push({ label, url });
      }

      route = child;
    }

    return trail;
  }
}
