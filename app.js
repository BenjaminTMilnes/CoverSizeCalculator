
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

    drawMeasureLine(graphics, from, to, labelText = "") {

        var u = to.subtract(from).u;
        var n = u.n;

        var c = "hsla(220, 60%, 70%, 1)";

        graphics.drawPath([from.add(n.times(5)), from.add(n.times(-5))], "none", c, 1);
        graphics.drawPath([from, to], "none", c, 1);
        graphics.drawPath([to.add(n.times(5)), to.add(n.times(-5))], "none", c, 1);

    }

    draw(graphics) {
        var a = 5000;
        var b = 100;
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

        this.drawMeasureLine(graphics, e1.add(v2(-b, 4)), e4.add(v2(-b, -4)), "Total Height");
        this.drawMeasureLine(graphics, e1.add(v2(4, -b)), e2.add(v2(-4, -b)), "Total Width");
        this.drawMeasureLine(graphics, e5.add(v2(4, -b / 2)), e6.add(v2(-4, -b / 2)), "Spine Width");
    }
}

var l = new CoverLayout();

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

class Length {
    constructor(magnitude, unit) {
        this.magnitude = magnitude;
        this.unit = unit;
    }

    toMM() {
        if (this.unit == "mm") {
            return this;
        }
        else if (this.unit == "cm") {
            return new Length(this.magnitude * 10, "mm");
        }
        else if (this.unit == "dm") {
            return new Length(this.magnitude * 100, "mm");
        }
        else if (this.unit == "in") {
            return new Length(this.magnitude * 25.4, "mm");
        }
    }
}

var application = angular.module("CoverSizeCalculator", []);

application.controller("MainController", ["$scope", "$rootScope", function MainController($scope, $rootScope) {

    $scope.numberOfPages = 350;

    $scope.getLength = function (text, d) {
        if (text === undefined || text === null) {
            return d;
        }

        var match = text.match(/\s*(\d+(\.\d+)?)\s*(mm|cm|dm|in)\s*/);

        if (match !== undefined && match !== null) {
            var magnitude = match[1];
            var unit = match[3];

            return new Length(parseFloat(magnitude), unit);
        }
        else {
            return d;
        }
    }

    $scope.updateCanvas = function () {

        var pw = this.getLength($scope.pageWidth, new Length(176, "mm")).toMM();
        var ph = this.getLength($scope.pageHeight, new Length(250, "mm")).toMM();
        var pt = this.getLength($scope.paperThickness, new Length(0.002252, "in")).toMM();
        var r = pw.magnitude / ph.magnitude;

        l.pageHeight = app.height * 0.5;
        l.pageWidth = r * l.pageHeight;

        l.numberOfPages = $scope.numberOfPages;

    }

    $scope.$watchGroup(["pageWidth", "pageHeight", "paperThickness", "numberOfPages"], function (newValues, oldValues) {
        $scope.updateCanvas();
    });

}]);
