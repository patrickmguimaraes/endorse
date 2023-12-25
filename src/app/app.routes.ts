import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthNegativoGuard } from './guards/auth-negativo.guard';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileHomeComponent } from './pages/profile/profile-home.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ChartsComponent } from './pages/charts/charts.component';
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
import { IdeaComponent } from './pages/profile/profile/idea/idea/idea.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { HomeIdeaComponent } from './pages/profile/profile/idea/home-idea.component';
import { ShowcaseComponent } from './pages/profile/profile/idea/showcase/showcase.component';
import { CollaborationComponent } from './pages/profile/profile/idea/collaboration/collaboration.component';
import { CopyrightComponent } from './pages/profile/profile/idea/copyright/copyright.component';
import { DiscussionsComponent } from './pages/profile/profile/idea/discussions/discussions.component';
import { TimelineComponent } from './pages/profile/profile/idea/timeline/timeline.component';
import { FeedbackComponent } from './pages/profile/profile/idea/feedback/feedback.component';

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
    component: HomeComponent,
    pathMatch: 'full',
    title: "Endorse an Idea",
    canActivate: [AuthGuard],
  },
  {
    path: 'request-copyright/:id',
    component: RequestCopyrightComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Request Copyright",
    canActivate: [AuthGuard],
  },
  {
    path: 'request-copyright',
    component: RequestCopyrightComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Request Copyright",
    canActivate: [AuthGuard],
  },
  {
    path: 'tasks',
    component: TasksComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Tasks",
    canActivate: [AuthGuard],
  },
  {
    path: 'charts',
    component: ChartsComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Charts",
    canActivate: [AuthGuard],
  },
  {
    path: 'copyrights',
    component: CopyrightsComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Copyrights",
    canActivate: [AuthGuard],
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Documents",
    canActivate: [AuthGuard],
  },
  {
    path: 'faq',
    component: FaqComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - FAQ",
    canActivate: [AuthGuard],
  },
  {
    path: 'messages',
    component: MessagesComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Messages",
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Settings",
    canActivate: [AuthGuard],
  },
  {
    path: 'support',
    component: SupportComponent,
    pathMatch: 'full',
    title: "Endorse an Idea - Support",
    canActivate: [AuthGuard],
  },
  {
    path: ':userId',
    component: ProfileHomeComponent,
    title: "Endorse an Idea - User",
    canActivate: [AuthGuard],
    data: { reuseComponent: false },
    children: [
      {
        path: '',
        component: ProfileComponent,
        title: "Endorse an Idea",
        pathMatch: 'full',
        data: { reuseComponent: false }
      },
      {
        path: ':postId',
        component: HomeIdeaComponent,
        children: [
          {
            path: '',
            component: IdeaComponent,
            title: "Endorse an Idea - Idea",
            pathMatch: 'full',
          },
          {
            path: 'idea-showcase',
            component: ShowcaseComponent,
            title: "Endorse an Idea - Idea Showcase",
          },
          {
            path: 'collaboration',
            component: CollaborationComponent,
            title: "Endorse an Idea - Collaboration",
          },
          {
            path: 'legal-copyright',
            component: CopyrightComponent,
            title: "Endorse an Idea - Legal and Copyright",
          },
          {
            path: 'discussions',
            component: DiscussionsComponent,
            title: "Endorse an Idea - Discussions",
          },
          {
            path: 'timeline',
            component: TimelineComponent,
            title: "Endorse an Idea - Timeline",
          },
          {
            path: 'feedback',
            component: FeedbackComponent,
            title: "Endorse an Idea - Feedback",
          },
        ]
      },
    ]
  },
  {path: '**', redirectTo: 'page-not-found'}
];
