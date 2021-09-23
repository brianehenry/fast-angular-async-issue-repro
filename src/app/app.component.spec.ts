import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TextField } from '@microsoft/fast-components';
import { DOM } from '@microsoft/fast-element';
import { AppComponent } from './app.component';

import {
  provideFASTDesignSystem,
  fastTextField
} from '@microsoft/fast-components';

provideFASTDesignSystem()
  .register(
      fastTextField()
  );

describe('fakeAsync() DOM.nextUpdate() issue', () => {
  it('test 1', fakeAsync(() => {
      const textField = document.createElement('fast-text-field');
      document.body.appendChild(textField);
      // By creating a FAST element, DOM.queueUpdate() will be called. But since this is within
      // fakeAsync(), the requestAnimationFrame in DOM.queueUpdate() will never resolve unless
      // we explicitly flush it. This causes issues for subsequent tests that will queue processes
      // on the same requestAnimationFrame call that will never resolve.

      // Calling tick(16) here will flush the requestAnimationFrame queued by DOM.nextUpdate()
      // and will allow the other tests to pass. But it's not ideal to have to call that at the
      // end of every test. And calling it in a beforeEach or afterEach wouldn't work because
      // it would be in a different Zone context.
  }));

  it('test 2', fakeAsync(() => {
      // This test will succeed if run by itself, but will fail if test 1 is run first

      const textField = document.createElement('fast-text-field') as TextField;
      document.body.appendChild(textField);
      textField.disabled = true;
      tick(16);
      expect(textField.getAttribute('disabled')).toBe('');
  }));

  it('test 3', async () => {
      // This test will succeed if run by itself, but will time out if test 1 is run first
      await DOM.nextUpdate()
  });
});
