# Component catalog

Tag `kol-<name>`, adapter `Kol<Name>` (e.g. `single-select` → `KolSingleSelect`). Only the props that
decide the choice are listed; the script returns all others.

## Form fields

All fields: `_label`, `_hint`, `_msg`, `_touched`, `_required`, `_disabled`, `_value`, `_on`,
`_infoPopover` (extra info at the label), methods `focus()` and `getValue()`.

| Need                               | Component                    | Deciding props                                                             |
| ---------------------------------- | ---------------------------- | -------------------------------------------------------------------------- |
| Text, phone, URL, search           | `input-text`                 | `_type`: `text`, `tel`, `url`, `search`                                    |
| E-mail                             | `input-email`                | `_multiple`                                                                |
| Password                           | `input-password`             | `_variant: 'visibility-toggle'`                                            |
| Number                             | `input-number`               | `_min`, `_max`, `_step`                                                    |
| Date, time, month, week            | `input-date`                 | `_type`: `date`, `datetime-local`, `time`, `month`, `week`; `_min`, `_max` |
| File                               | `input-file`                 | `_accept`, `_multiple`                                                     |
| Range, color                       | `input-range`, `input-color` |                                                                            |
| Multi-line text                    | `textarea`                   | `_rows`, `_maxLength` + `_hasCounter`                                      |
| Yes/no, consent, switch            | `input-checkbox`             | `_variant`: `default`, `switch`, `button`                                  |
| One of up to 5 options             | `input-radio`                | `_options: { label, value }[]`, `_orientation`                             |
| One of more than 5 options         | `single-select`              | `_options: Option<T>[]`, `_placeholder`                                    |
| Several from a list, option groups | `select`                     | `_options: SelectOption<T>[]`, `_multiple`                                 |
| Free text with suggestions         | `combobox`                   | `_suggestions: string[]`                                                   |

Import `Option` and `SelectOption` as types from `@public-ui/components`; `SelectOption` includes
option groups and therefore only fits `select`.

## Form, action, feedback

| Need                                                    | Component                     | Deciding props                                                                                                    |
| ------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Form, required hint, error summary                      | `form`                        | `_errorList`, `_on.onSubmit`/`onReset`, `focusErrorList()`                                                        |
| Action                                                  | `button`                      | `_type`: `button`, `submit`, `reset`; `_variant`: `primary`, `secondary`, `normal`, `tertiary`, `danger`, `ghost` |
| Navigation                                              | `link`                        | `_href`                                                                                                           |
| Link looking like a button / button looking like a link | `link-button` / `button-link` |                                                                                                                   |
| Status message                                          | `alert`                       | `_type`: `default`, `info`, `success`, `warning`, `error`; `_alert` = announced                                   |
| Confirmation, modal content                             | `dialog`                      | `showModal()`, `close()`                                                                                          |
| Loading, progress                                       | `spin`, `progress`            | `_show` / `_value`, `_max`                                                                                        |
| Extra info placed freely                                | `popover-button`              | slot = content                                                                                                    |

## Structure and content

| Need                         | Component                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| Heading                      | `heading` (`_level` 1–6)                                                              |
| Section with title           | `card`                                                                                |
| Expand/collapse              | `details`, `accordion`                                                                |
| Tabs                         | `tabs`                                                                                |
| Skip links, navigation, path | `skip-nav`, `nav`, `breadcrumb`                                                       |
| Table                        | `table-stateful` (sorts and paginates itself), `table-stateless`                      |
| Image, icon                  | `image` (`_alt`), `icon` (`_label`; empty = decorative)                               |
| Abbreviation, quote          | `abbr`, `quote`                                                                       |
| More                         | `avatar`, `badge`, `drawer`, `meter`, `pagination`, `split-button`, `toolbar`, `tree` |

## Deprecated

| Do not use                          | Instead                                            |
| ----------------------------------- | -------------------------------------------------- |
| `modal`                             | `dialog`                                           |
| `ToasterService`, `toast-container` | `alert` in the content, `dialog` for confirmations |
| `tooltip-wc`                        | `_hideLabel` (shows a tooltip), `_infoPopover`     |

## Native HTML

Native HTML is correct only here:

- Layout: `div`, `section`, `main`, `header`, `footer`, grid/flex.
- Running text and lists: `p`, `ul`, `ol`, `strong`, `em`.
- Field groups: a sub-heading via `heading`; `input-radio` brings its own fieldset.
