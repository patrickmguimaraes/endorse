import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthNegativoGuard } from './guards/auth-negativo.guard';
import { FolderPage } from './pages/folder/folder.page';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EndorseAnIdeaComponent } from './pages/endorse-an-idea/endorse-an-idea.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { CopyrightsComponent } from './pages/copyrights/copyrights.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { FaqComponent } from './pages/faq/faq.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SupportComponent } from './pages/support/support.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { LoginComponent } from './pages/login/login.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthNegativoGuard],
  },
  {
    path: 'login/:returnUrl',
    component: LoginComponent,
    canActivate: [AuthNegativoGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthNegativoGuard],
  },
  {
    path: 'signup/:email/:provider/:providerId',
    component: SignupComponent,
    canActivate: [AuthNegativoGuard],
  },
  {
    path: 'verify-email/:token',
    component: VerifyEmailComponent,
    canActivate: [AuthNegativoGuard],
  },
  {
    path: 'recovery-password',
    component: RecoveryPasswordComponent,
    canActivate: [AuthNegativoGuard],
  },
  {
    path: '',
    component: FolderPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'endorse/:id',
        component: EndorseAnIdeaComponent,
        pathMatch: 'full'
      },
      {
        path: 'endorse-an-idea',
        component: EndorseAnIdeaComponent,
        pathMatch: 'full',
      },
      {
        path: 'timeline',
        component: TimelineComponent,
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        pathMatch: 'full'
      },
      {
        path: 'tasks',
        component: TasksComponent,
        pathMatch: 'full'
      },
      {
        path: 'charts',
        component: ChartsComponent,
        pathMatch: 'full'
      },
     
      {
        path: 'copyrights',
        component: CopyrightsComponent,
        pathMatch: 'full'
      },
      {
        path: 'documents',
        component: DocumentsComponent,
        pathMatch: 'full'
      },
      {
        path: 'faq',
        component: FaqComponent,
        pathMatch: 'full'
      },
      {
        path: 'messages',
        component: MessagesComponent,
        pathMatch: 'full'
      },
      {
        path: 'settings',
        component: SettingsComponent,
        pathMatch: 'full'
      },
      {
        path: 'support',
        component: SupportComponent,
        pathMatch: 'full'
      },
      {
        path: 'terms-conditions',
        component: TermsConditionsComponent,
        pathMatch: 'full'
      },
      {
        path: ':id',
        component: ProfileComponent,
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },
  {path: '**', redirectTo: 'page-not-found'}
];
