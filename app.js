
class CoverLayout {
    constructor() {

        this.pageWidth = 300;
        this.pageHeight = 500;
        this.paperThickness = 0.1;
        this.numberOfPages = 350;
        this.bleed = 10;

        this.centre = v2(500, 500);
    }

    get spineWidth() {
        return this.paperThickness * this.numberOfPages;
    }

    update() { }

    draw(graphics) {
        var a = 5000;
        var c = "hsla(220, 60%, 70%, 1)";

        var e1 = this.centre.add(v2(-this.spineWidth / 2 - this.pageWidth, -this.pageHeight / 2));
        var e2 = e1.add(v2(this.pageWidth * 2 + this.spineWidth, 0));
        var e3 = e2.add(v2(0, this.pageHeight));
        var e4 = e1.add(v2(0, this.pageHeight));

        var e5 = e1.add(v2(this.pageWidth, 0));
        var e6 = e5.add(v2(this.spineWidth, 0));
        var e7 = e6.add(v2(0, this.pageHeight));
        var e8 = e5.add(v2(0, this.pageHeight));

        graphics.drawPath([e1, e2, e3, e4, e1], "rgba(32, 32, 32, 1)", "black", 0);

        graphics.drawPath([e1.add(v2(0, -a)), e4.add(v2(0, a))], "none", c, 1, [10, 5]);
        graphics.drawPath([e5.add(v2(0, -a)), e8.add(v2(0, a))], "none", c, 1, [10, 5]);
        graphics.drawPath([e6.add(v2(0, -a)), e7.add(v2(0, a))], "none", c, 1, [10, 5]);
        graphics.drawPath([e2.add(v2(0, -a)), e3.add(v2(0, a))], "none", c, 1, [10, 5]);


        graphics.drawPath([e1.add(v2(-a, 0)), e2.add(v2(a, 0))], "none", c, 1, [10, 5]);
        graphics.drawPath([e4.add(v2(-a, 0)), e3.add(v2(a, 0))], "none", c, 1, [10, 5]);
    }
}

class AppEvent {
    constructor(pointOnScreen) {
        this.pointOnScreen = pointOnScreen;
        this.isConsumed = false;
    }

    get p() {
        return this.pointOnScreen;
    }
}

class App extends Application {
    constructor(canvasId) {
        super(canvasId);

        this.resolutionFactor = 1;

        this.elements = [];

    }

    initialise() {
        super.initialise();

        this.graphics = new GraphicsContext(this.context);

        var l = new CoverLayout();

        l.centre = v2(this.width / 2, this.height / 2);

        this.elements.push(l);
    }

    getPointOnScreen(event) {
        var x = event.clientX - this.canvasLeft;
        var y = event.clientY - this.canvasTop;

        return v(x, y);
    }

    getAppEvent(event) {
        return new AppEvent(this.getPointOnScreen(event));
    }

    mouseDown(event) {
        var e = this.getAppEvent(event);
    }

    mouseUp(event) {
        var e = this.getAppEvent(event);
    }

    mouseMove(event) {
        var e = this.getAppEvent(event);
    }

    update(timeDelta) {
        super.update(timeDelta);

        this.elements.forEach(e => e.update(this.time, timeDelta));
    }

    draw() {
        this.graphics.clear(this.width, this.height, "rgba(16, 16, 16, 1)");

        this.elements.forEach(e => {
            e.draw(this.graphics);
        });
    }
}

var app = new App("previewcanvas");