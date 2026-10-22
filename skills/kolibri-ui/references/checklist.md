# Check

## Checklist

KoliBri coverage

- [ ] No native `button`, `input`, `select`, `textarea`, `a`, `h1`–`h6`, `dialog`.
- [ ] No deprecated component.

Accessibility

- [ ] Meaningful `_label`s; heading levels without gaps.
- [ ] Required fields via `_required`, format requirements via `_hint`, `_autoComplete` on personal data.
- [ ] Empty submit: all errors in one round, error summary in field order with focus, every jump link
      focuses its field.
- [ ] Error messages say what to do.
- [ ] Success is announced (`alert` with `_alert`).
- [ ] Dialog: Escape closes, focus returns to the trigger.
- [ ] Everything operable by keyboard, order logical.

Code

- [ ] Type check and lint pass.

## Browser test

Focus and values live in the shadow DOM. Playwright helpers:

```js
// Focus path through all shadow roots, e.g. "kol-form > a" or "kol-input-text#field-email > input"
const focusPath = () =>
  page.evaluate(() => {
    const path = [];
    for (let el = document.activeElement; el; el = el.shadowRoot?.activeElement ?? null) {
      path.push(el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''));
    }
    return path.join(' > ');
  });
// Entries of the error summary
const errorLinks = () =>
  page.evaluate(() =>
    [...document.querySelector('kol-form').shadowRoot.querySelectorAll('a')].map((a) => a.textContent.trim()),
  );
// Value of a field
const value = (id) => page.evaluate((i) => document.getElementById(i).getValue(), id);
```

The options of a `single-select` are `[role=option]` elements in its shadow root; the first arrow key
opens the list, each further one moves the selection. After a failed submit the focus is in the error
summary, so Enter there activates a jump link, not the submit.
