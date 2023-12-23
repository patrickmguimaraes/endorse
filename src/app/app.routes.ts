import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthNegativoGuard } from './guards/auth-negativo.guard';
import { FolderPage } from './pages/folder/folder.page';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TimelineComponent } from './components/timeline/timeline.component';
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
import { RequestCopyrightComponent } from './pages/request-copyright/request-copyright.component';
import { IdeaComponent } from './pages/idea/idea.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthNegativoGuard],
    title: "Endorse an Idea - Login"
  },
  {
    path: 'login/:returnUrl',
    component: LoginComponent,
    canActivate: [AuthNegativoGuard],
    title: "Endorse an Idea - Login"
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthNegativoGuard],
    title: "Endorse an Idea - Signup"
  },
  {
    path: 'signup/:email/:provider/:providerId',
    component: SignupComponent,
    canActivate: [AuthNegativoGuard],
    title: "Endorse an Idea - Signup"
  },
  {
    path: 'verify-email/:token',
    component: VerifyEmailComponent,
    canActivate: [AuthNegativoGuard],
    title: "Endorse an Idea - Verify Email"
  },
  {
    path: 'recovery-password',
    component: RecoveryPasswordComponent,
    canActivate: [AuthNegativoGuard],
    title: "Endorse an Idea - Recovery Password"
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Terms and Conditions"
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
    title: "Endorse an Idea - Page not Found"
  },
  {
    path: '',
    component: FolderPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        title: "Endorse an Idea"
      },
      {
        path: 'idea/:code',
        component: IdeaComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Idea"
      },
      {
        path: 'request-copyright/:id',
        component: RequestCopyrightComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Request Copyright"
      },
      {
        path: 'request-copyright',
        component: RequestCopyrightComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Request Copyright"
      },
      {
        path: 'profile',
        component: ProfileComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Profile"
      },
      {
        path: 'tasks',
        component: TasksComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Tasks"
      },
      {
        path: 'charts',
        component: ChartsComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Charts"
      },
     
      {
        path: 'copyrights',
        component: CopyrightsComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Copyrights"
      },
      {
        path: 'documents',
        component: DocumentsComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Documents"
      },
      {
        path: 'faq',
        component: FaqComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - FAQ"
      },
      {
        path: 'messages',
        component: MessagesComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Messages"
      },
      {
        path: 'settings',
        component: SettingsComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Settings"
      },
      {
        path: 'support',
        component: SupportComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - Support"
      },
      {
        path: ':userId',
        component: ProfileComponent,
        pathMatch: 'full',
        title: "Endorse an Idea - User",
      },
    ]
  },
  {path: '**', redirectTo: 'page-not-found'}
];
