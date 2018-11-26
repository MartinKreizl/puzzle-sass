# Puzzle sass
This package provides composable (atomic) css classes with lowest CSS specificity as possible.
You can configure whole stylesheet in **config.scss**. See modules & configuration section
for more details. 

## Build process
```
npm run build
```

## Configuration
You can configure "global" or module based variables in configuration file.

## Modules

### Spacing
**CSS specificity = 010**. Adds padding on all sides, only top or only bottom

API:
- .spacing-{SCALE}
- .spacing-{SCALE}-top
- .spacing-{SCALE}-bottom

Configuration:
- $spacing_scale_base - Base unit which is multiply across available $sizes.

Example:

```scss
$spacing_scale_base: 24px; //.spacing-xs {padding: 24px}, .spacing-sm {padding: 48px} ...
$spacing_scale_base: 16px; //.spacing-xs {padding: 16px}, .spacing-sm {padding: 32px} ... 
```

### Typography
**CSS specificity = 010**. Adds sizes, weights and gutters

API:
- .typography-size-{SIZE} - SIZE is value from enum(h1-h6, body1-body3)
- .typography-weight-{WEIGHT} - WEIGHT is value within range 1-9
- .typography-align-{ALIGN} - ALIGN is value from enum(left, center, right)
- .typography-gutter
- .typography

Configuration:
- $typography_color - Default color for .typography classes

### Grid