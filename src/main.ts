// Angular imports
import { bootstrapApplication } from '@angular/platform-browser';
import { registerLicense } from '@syncfusion/ej2-base';

// Internal imports
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

registerLicense('Ngo9BigBOggjGyl/Vkd+XU9FcVRDQmtWfFN0Q3NYfVRyfV9EYkwxOX1dQl9mSHxSdEVjXXpfdHFVR2RXUkU=');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
