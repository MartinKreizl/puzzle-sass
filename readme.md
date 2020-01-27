# Puzzle sass
This package provides composable (atomic) css classes wich are grouped to related modules.
We provide consistent APIs across the modules including "conditional parameters" which are awesome and handy for responsive designs.
You can configure whole project from within one javascript file and use its power in your scss files.

## Configuration
By default puzzle-sass searching for **puzzleSass.config.js** in working directory.


## Terminology
**Module** - Set of css classes which operates on related css properties eg. font, flex padding margin etc..
So APIs are divided into modules.
modules are prefixed with **mod-** keyword.


**Submodule** - Targets on spacific css property. There is point where atomicity is created.
```css
.mod-flex-align /* Submodule of flex which target on align-content css property */
.mod-flex-justify /* Submodule of flex which target on justify-content css property */

.mod-grid-container /* Submodule of grid which creates container */
.grid-item /* Submodule of grid which creates item */
```

**Submodule params** - Are class names with module name prefix which acts as values for css properties.

```css

.mod-flex-align .flex-center /* Parameter of submodule flex-align which tells where to align items */
.mod-flex-justify .flex-center /* Parameter of submodule flex-justify which tells where to justify content */
```

**Conditional params** - Are class names very similar to "submodule params" with one exception.
They ends with breakpoint value.
```
.mod-flex-align .flex-center-md .flex-bottom-lg .flex-start-xl /* conditionaly pass parameters to flex-align css property*/
```

Rules of css class APIs
1) Each module class name begins with **mod** followed by module name eg. .mod-flex, .mod-grid
2) Each module namespace its arguments eg. .mod-grid-container .grid-align-top, .mod-flex-align .flex-center
3) Each module supports breakpoints modificators (aka. conditional parameters) eg. .flex-center-xs .flex-top-md

## Usage
We can divide usage on two parts:
1) class inheritance approach
2) using sass functions approach (they are backed by javascript under the hood 👍👍)

We can achive best usage comfort with combined together.

## Usa case of "class inheritance approach"
todo

## Build process
todo

## Modules
todo