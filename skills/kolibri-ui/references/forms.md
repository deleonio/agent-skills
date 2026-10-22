# Forms

## The flow `kol-form` defines

1. `kol-form` renders `<form novalidate>` and the required-fields hint. A `_type="submit"` button or
   Enter in a field calls `_on.onSubmit`; `preventDefault()` is already done.
2. A field shows its error only with `_msg` **and** `_touched`.
3. After a failed submit: errors on all fields, set `_errorList` in **visual field order**, call
   `focusErrorList()`. The jump links focus the field through `selector` → `id` on the `kol-*` host.
4. Success: show an `alert` with `_type="success"` and `_alert`.

## React Hook Form + Zod

Packages: `@public-ui/react-v19`, `@public-ui/react-hook-form-adapter`, `react-hook-form`, `zod`,
`@hookform/resolvers`. A `Kol…Controller` sets `_msg`, `_touched`, `_name` and the value itself.
Complete example: MCP `fetch` `scenario/scenarios/contact-form`.

```tsx
const FIELD_ORDER: (keyof Values)[] = ['topic', 'email', 'privacy'];
const fieldId = (name: keyof Values) => `field-${name}`;

const {
  control,
  handleSubmit,
  formState: { errors, isSubmitted, isSubmitting },
} = useForm<Values>({
  defaultValues,
  mode: 'onTouched',
  resolver: zodResolver(schema),
});
const formRef = useRef<HTMLKolFormElement>(null);
const errorList: ErrorListPropType[] = isSubmitted
  ? FIELD_ORDER.filter((name) => errors[name]?.message).map((name) => ({
      message: String(errors[name]?.message),
      selector: `#${fieldId(name)}`,
    }))
  : [];

return (
  <KolForm
    ref={formRef}
    _errorList={errorList}
    _on={{
      onSubmit: () => !isSubmitting && void handleSubmit(onValid, () => void formRef.current?.focusErrorList())(),
    }}
  >
    <KolInputEmailController
      control={control}
      name="email"
      id={fieldId('email')}
      _label="E-mail address"
      _autoComplete="email"
      _required
    />
    <KolButton _label="Send" _type="submit" _variant="primary" />
  </KolForm>
);
```

Values the controllers write into the form:

| Controller                                  | Value                                                             | Zod                                    |
| ------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------- |
| Text, e-mail, date, textarea, radio, select | `string`; `single-select` yields `{ value: null }` after clearing | `z.string({ error: msg }).min(1, msg)` |
| Checkbox                                    | `_value` (default `true`) or `null`                               | `z.boolean().nullable()`               |
| File                                        | `FileList` or `null`                                              | `z.custom<FileList \| null>()`         |

- Conditional fields read the controlling value with `useWatch({ control, name })`; `watch()` from
  `useForm` does not work with the React Compiler.
- `z.string({ error: msg })` gives every non-string the same message as an empty field.
- Conditionally required fields via `.superRefine(fn, { when: () => true })`: without `when`, Zod
  reports them only once all other fields are valid – a second round of errors. `fn` then reads the
  values defensively.

## Web components without a framework

Set `_errorList`, `_on` and `_options` as properties, strings and booleans as attributes:

```html
<kol-form id="contact">
  <kol-input-email id="field-email" _label="E-mail address" _required _auto-complete="email"></kol-input-email>
  <kol-button _label="Send" _type="submit" _variant="primary"></kol-button>
</kol-form>
<script type="module">
  document.querySelector('#contact')._on = { onSubmit: () => validate() };
</script>
```

## Content rules

- Error message = instruction with an example: "Please enter a valid e-mail address, for example
  name@example.com."
- State format requirements up front as `_hint`, not only as an error.
- Links (e.g. privacy policy) as a `link` in the text **next to** the field, never inside the label.
- Prevent double submits (`isSubmitting`), show loading with a `spin` that has a `_label`.
- Resetting with data loss only after confirmation in a `dialog`.
