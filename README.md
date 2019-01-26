## jsdraw

A library to create freehand components as set of core HTML elements (without HTML5 canvas). This is kind of a drawing library. (Still in progress)

### How to Use:

To make an HTML element drawable, include ```'/jsdraw-min.js'``` file as per the [example](https://github.com/harshalitalele/openseadragon-circular-annotation/tree/gh-pages) into the project along with icons, inside ```img/``` folder.

```markdown

<script src="jsdraw-min.js"></script>

```

Then it can be used like this:

```markdown
var myboard = new DrawingBoard();

```

You can also use options to customize board as you want.
By default, if you don't provide any paramters to the DrawingBoard(), it makes the whole body element drawable.

DrawingBoard options can be used as follows:

```markdown
var options = {
    elemProp: {
        id: "myid"
    },
    saveHandler: function(drawings) {
        console.log(drawings);
    }
};
var myboard = new DrawingBoard(options);
```

### Demo:

You can see a [live demo](https://harshalitalele.github.io/jsdraw) here.

### Suggestions:

If you have any suggestion or you find any bug, feel free to log an issue.

### Development:

Will update soon...
